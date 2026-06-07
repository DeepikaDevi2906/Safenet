from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import Float
from sqlalchemy import DateTime

from datetime import datetime

from db import Base


class LiveLocation(Base):

    __tablename__ = "live_locations"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id = Column(
        Integer
    )

    latitude = Column(
        Float
    )

    longitude = Column(
        Float
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )