from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.db.dependencies import get_db
from app.models.task import Task
from app.auth.dependencies import get_current_user

router = APIRouter()


@router.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    tasks = db.query(Task).filter(
        Task.user_id == user_id
    ).order_by(
        Task.created_at.desc()
    ).all()

    return tasks




@router.put("/tasks/{task_id}/complete")
def complete_task(
    task_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    task = db.query(Task).filter(
        Task.id == task_id,
        Task.user_id == user_id
    ).first()

    if not task:

        raise HTTPException(
            status_code=404,
            detail="Task not found"
        )

    task.status = "completed"

    db.commit()

    return {
        "message": "Task completed"
    }