from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.summary import Summary
from app.auth.dependencies import get_current_user

import json

router = APIRouter()


@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    latest_summary = db.query(Summary).filter(
        Summary.user_id == user_id
    ).order_by(
        Summary.created_at.desc()
    ).first()

    if not latest_summary:

        return {
            "message": "No summaries found"
        }

    return json.loads(latest_summary.data)