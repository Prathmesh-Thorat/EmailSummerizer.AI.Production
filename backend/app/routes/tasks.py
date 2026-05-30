from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.db.dependencies import get_db
from app.models.task import Task
from app.auth.dependencies import get_current_user
from datetime import datetime, timedelta,timezone
from sqlalchemy import func

router = APIRouter()

def _prune_stale_completed_tasks(db: Session, user_id: int) -> None:
    """Delete completed tasks whose updated_at is older than 2 days.
    Tasks with updated_at = NULL were never updated and are left untouched.
    """
    cutoff = func.now() - timedelta(days=2)
    stale = (
        db.query(Task)
        .filter(
            Task.user_id == user_id,
            Task.status == "completed",
            Task.updated_at.isnot(None),
            Task.updated_at <= cutoff,
        )
        .all()
    )
    for task in stale:
        db.delete(task)

@router.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    _prune_stale_completed_tasks(db, user_id)
    db.commit()
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

    _prune_stale_completed_tasks(db, user_id)
    db.commit()
 

    return {
        "message": "Task completed"
    }