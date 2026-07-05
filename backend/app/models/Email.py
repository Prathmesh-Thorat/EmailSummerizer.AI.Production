from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Text
from sqlalchemy import DateTime
from sqlalchemy import ForeignKey
from sqlalchemy import String
from app.db.database import Base
from sqlalchemy import func


class Email(Base):

    __tablename__ = "emails"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer, ForeignKey("users.id"))

    range = Column(String)

    raw_text = Column(Text)

    metadata_json = Column(Text)

    created_at = Column(
        DateTime(timezone=True),
        default=func.now()
    )