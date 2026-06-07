from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    DateTime
)

from datetime import datetime

from db import Base


class Alert(Base):

    __tablename__ = "alerts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(Integer)

    latitude = Column(Float)

    longitude = Column(Float)

    status = Column(
        String,
        default="Active"
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )