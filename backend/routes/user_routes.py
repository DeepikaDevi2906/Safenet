from fastapi import APIRouter
from fastapi import Depends

from db import SessionLocal
from models.user import User

from utils.helpers import get_current_user

router = APIRouter()


@router.get("/me")
def get_me(current_user=Depends(get_current_user)):

    if not current_user:
        return {
            "message": "Unauthorized"
        }

    return {
        "user": current_user
    }


@router.get("/users")
def get_users():

    db = SessionLocal()

    try:

        users = db.query(User).all()

        result = []

        for user in users:

            result.append({
                "id": user.id,
                "username": user.username,
                "email": user.email
            })

        return result

    finally:

        db.close()