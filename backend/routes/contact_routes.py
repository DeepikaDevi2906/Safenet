from fastapi import APIRouter
from pydantic import BaseModel

from db import SessionLocal
from models.contact import Contact

router = APIRouter()


class ContactCreate(BaseModel):
    user_id: int
    name: str
    phone: str
    relationship: str


@router.post("/contacts")
def create_contact(contact: ContactCreate):

    db = SessionLocal()

    new_contact = Contact(
        user_id=contact.user_id,
        name=contact.name,
        phone=contact.phone,
        relationship=contact.relationship
    )

    db.add(new_contact)
    db.commit()

    return {
        "message": "Contact Added"
    }


@router.get("/contacts/{user_id}")
def get_contacts(user_id: int):

    db = SessionLocal()

    contacts = db.query(Contact).filter(
        Contact.user_id == user_id
    ).all()

    return contacts


@router.delete("/contacts/{contact_id}")
def delete_contact(contact_id: int):

    db = SessionLocal()

    contact = db.query(Contact).filter(
        Contact.id == contact_id
    ).first()

    if contact:
        db.delete(contact)
        db.commit()

    return {
        "message": "Deleted"
    }