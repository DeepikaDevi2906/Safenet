from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Float

from db import Base


class SafeZone(Base):

    __tablename__ = "safe_zones"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String
    )

    type = Column(
        String
    )

    latitude = Column(
        Float
    )

    longitude = Column(
        Float
    )