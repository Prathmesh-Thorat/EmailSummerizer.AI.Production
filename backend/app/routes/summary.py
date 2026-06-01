from fastapi import APIRouter, Depends, Request,HTTPException
from sqlalchemy.orm import Session

from app.db.dependencies import get_db
from app.models.summary import Summary
from app.auth.dependencies import get_current_user

import json

router = APIRouter()


@router.get("/summary")
def get_summary(
    range: str = "today",
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):
    summary_range = range

    latest_summary = db.query(Summary).filter(
        Summary.user_id == user_id,
        Summary.range == summary_range
    ).order_by(
        Summary.created_at.desc()
    ).first()

    return { "summary": json.loads(latest_summary.data),
             "created_at": latest_summary.created_at,
             "range" : latest_summary.range}

@router.get("/summary/history")
def get_summary_history(
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    summaries = db.query(Summary).filter(
        Summary.user_id == user_id
    ).order_by(
        Summary.created_at.desc()
    ).all()

    result = []

    for summary in summaries:

        result.append({
            "id": summary.id,
            "range": summary.range,
            "overall_summary": summary.overall_summary,
            "created_at": summary.created_at
        })

    return result

@router.get("/summary/{summary_id}")
def get_single_summary(
    summary_id: int,
    db: Session = Depends(get_db),
    user_id: int = Depends(get_current_user)
):

    summary = db.query(Summary).filter(
        Summary.id == summary_id,
        Summary.user_id == user_id
    ).first()

    if not summary:

        raise HTTPException(
            status_code=404,
            detail="Summary not found"
        )

    return {"summary" : json.loads(summary.data),
            "created_at" : summary.created_at,
            "range ": summary.range}