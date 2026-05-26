from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session
from fastapi import Depends
from app.db.dependencies import get_db
from app.models.summary import Summary
from app.models.user import User
import json
from app.models.task import Task
from app.services.gmail_service import (
    get_auth_url,
    process_callback
)

from app.services.summary_service import generate_summary

router = APIRouter()


@router.get("/login")
def login():

    auth_url = get_auth_url()

    return RedirectResponse(auth_url)


@router.get("/auth/callback")
def callback(
    request : Request,
    code: str,
    db: Session = Depends(get_db)
):

    data = process_callback(code)
    email_text = data["email_text"]
    email = data["email"]

    user = db.query(User).filter(
        User.email == email
    ).first()


    if not user:

        user = User(email=email)

        db.add(user)

        db.commit()

        db.refresh(user)

    request.session["user_email"] = user.email
    request.session["user_id"] = user.id

    # GET EXISTING TASKS
    existing_tasks = db.query(Task).filter(
        Task.user_id == user.id
    ).all()


    existing_task_context = ""

    for t in existing_tasks:

        existing_task_context += f"""
        task_key: {t.task_key}
        title: {t.title}
        status: {t.status}
        """
    

    result = generate_summary(email_text,existing_task_context)

    new_summary = Summary(
        user_id=user.id,
        overall_summary=result["overall_summary"],
        data=json.dumps(result)
    )

    print("Saving summary")

    db.add(new_summary)

    db.commit()

    tasks = result.get("tasks", [])

    for task in tasks:

        existing_task = db.query(Task).filter(
        Task.user_id == user.id,
        Task.task_key == task["task_key"]
        ).first()

    # UPDATE EXISTING TASK
        if existing_task:

            existing_task.title = task["title"]
            existing_task.status = task["status"]

    # CREATE NEW TASK
        else:

            new_task = Task(
                user_id=user.id,
                title=task["title"],
                type=task["type"],
                priority=task["priority"],
                status=task["status"],
                task_key=task["task_key"]
            )

            db.add(new_task)

    db.commit()

    print("Saved")

    return RedirectResponse("http://localhost:5173/")