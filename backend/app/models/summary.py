from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey

from datetime import datetime

from app.db.database import Base


class Summary(Base):

    __tablename__ = "summaries"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    overall_summary = Column(Text)

    data = Column(Text)

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )