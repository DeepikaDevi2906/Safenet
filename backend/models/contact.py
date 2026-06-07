# models/contact.py

from sqlalchemy import Column, Integer, String
from db import Base

class Contact(Base):
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(Integer)

    name = Column(String)

    phone = Column(String)

    relationship = Column(String)