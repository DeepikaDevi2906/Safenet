from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from db import Base


class Incident(Base):

    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    incident_type = Column(String)

    location = Column(String)

    severity = Column(String)

    status = Column(String)