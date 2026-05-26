from fastapi import APIRouter
from sqlalchemy.orm import Session
from fastapi import Depends

from app.db.dependencies import get_db
from app.models.task import Task

router = APIRouter()


@router.get("/tasks")
def get_tasks(
    db: Session = Depends(get_db)
):

    tasks = db.query(Task).order_by(
        Task.created_at.desc()
    ).all()

    return tasks