from fastapi import APIRouter
from fastapi import Request
from fastapi.responses import RedirectResponse
from fastapi import HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from fastapi import Depends
from app.db.dependencies import get_db
from app.models.summary import Summary
from app.models.user import User
from datetime import datetime, timedelta,timezone
import json
from app.models.task import Task
from app.services.gmail_service import (
    get_auth_url,
    process_callback,
    fetch_emails_from_credentials
)

from app.services.summary_service import generate_summary


from app.auth.jwt import create_token
from fastapi.responses import JSONResponse
from app.auth.dependencies import get_current_user
from fastapi import Header


def match_message_id(email_from_ai, email_metadata):
    ai_sender = email_from_ai.get("sender", "").lower().strip()
    ai_subject = email_from_ai.get("subject", "").lower().strip()

    best_match = None
    best_score = 0

    for m in email_metadata:
        real_sender = m["sender"].lower().strip()
        real_subject = m["subject"].lower().strip()

        score = 0

        # Check both directions for sender
        if ai_sender and (ai_sender in real_sender or real_sender in ai_sender):
            score += 2  # sender match weighted higher

        # Check both directions for subject
        if ai_subject and (ai_subject in real_subject or real_subject in ai_subject):
            score += 1

        if score > best_score:
            best_score = score
            best_match = m

    # Only match if at least sender OR subject matched
    return best_match if best_score > 0 else None


router = APIRouter()


@router.get("/login")
def login():

    auth_url = get_auth_url()

    return RedirectResponse(auth_url)


@router.get("/auth/callback")
def callback(
    request: Request,
    code: str,
    state: str,
    db: Session = Depends(get_db)
):

    data = process_callback(code,state)

    email = data["email"]

    user = db.query(User).filter(
        User.email == email
    ).first()

    if not user:

        user = User(email=email)

        db.add(user)

        db.commit()

        db.refresh(user)

    token = create_token({
    "user_id": user.id,
    "user_email": user.email,
    "credentials": data["credentials"]
})
    frontend_url = "https://email-summerizer-ai-production.vercel.app"
    return RedirectResponse(f"{frontend_url}/?token={token}")

from pydantic import BaseModel

class SummaryRequest(BaseModel):
    range: str
    force_refresh: bool = False


@router.post("/generate-summary")
def generate_summary_route(
    body: SummaryRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
    authorization: str = Header(...)
):
    from jose import jwt as _jwt
    import os
    payload = _jwt.decode(authorization[7:], os.getenv("JWT_SECRET"), algorithms=["HS256"])
    credentials_json = payload.get("credentials")
    if not credentials_json:
        raise HTTPException(status_code=401, detail="Missing credentials")
    days = 1 if body.range == "today" else 7

    two_hours_ago = func.now() - timedelta(hours=2)

    latest_summary = db.query(Summary).filter(
    Summary.user_id == user_id,
    Summary.range == body.range,
    Summary.created_at >= two_hours_ago
).order_by(
    Summary.created_at.desc()
).first()


    if latest_summary and not body.force_refresh:

        print("Returning cached summary")
        return 

    # FETCH EMAILS
    email_text, email_metadata = fetch_emails_from_credentials(credentials_json, days)

    # EXISTING TASKS
    existing_tasks = db.query(Task).filter(
        Task.user_id == user_id
    ).all()

    existing_task_context = ""

    for t in existing_tasks:

        existing_task_context += f"""
        task_key: {t.task_key}
        title: {t.title}
        status: {t.status}
        """
   
    # AI SUMMARY
    result = generate_summary(
        email_text,
        existing_task_context,
        body.range
    )

    # important_emails
    for email in result.get("important_emails", []):
        match = match_message_id(email, email_metadata)
        if match:
            email["message_id"] = match["message_id"]

# all_emails
    for email in result.get("all_emails", []):
        match = match_message_id(email, email_metadata)
        if match:
            email["message_id"] = match["message_id"]

    # SAVE SUMMARY
    new_summary = Summary(
    user_id=user_id,
    overall_summary=result["overall_summary"],
    data=json.dumps(result),
    range=body.range
    )

    db.add(new_summary)
    db.flush()
    all_summaries = (
        db.query(Summary)
        .filter(Summary.user_id == user_id)
        .order_by(Summary.created_at.asc())   # oldest first
        .all()
    )
    excess = len(all_summaries) - 5
    if excess > 0:
        for old in all_summaries[:excess]:
            db.delete(old)

    # TASK UPDATE
    tasks = result.get("tasks", [])

    for task in tasks:

        existing_task = db.query(Task).filter(
            Task.user_id == user_id,
            Task.task_key == task["task_key"]
        ).first()

        if existing_task:

            existing_task.title = task["title"]
            existing_task.status = task["status"]

        else:

            new_task = Task(
                user_id=user_id,
                title=task["title"],
                type=task["type"],
                priority=task["priority"],
                status=task["status"],
                task_key=task["task_key"]
            )

            db.add(new_task)

    db.commit()

    return result

@router.post("/regenerate-summary")
def regenerate_summary(
    body : SummaryRequest,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user),
    authorization: str = Header(...)
):
    body = SummaryRequest(range=body.range, force_refresh=True)
    return generate_summary_route(body=body, db=db, user_id=user_id, authorization=authorization)

@router.get("/emails")
def getemails(
    request : Request
):
    user_id = request.session.get("user_id")
    credentials_json = request.session.get("credentials")
    email_text = fetch_emails_from_credentials(
        credentials_json,
        1
    )
    return email_text
