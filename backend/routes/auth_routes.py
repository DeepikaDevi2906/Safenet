from fastapi import APIRouter
from pydantic import BaseModel

from db import SessionLocal
from models.user import User
from utils.jwt_handler import hash_password
from utils.jwt_handler import create_access_token
from utils.jwt_handler import (
    hash_password,
    verify_password
)
router = APIRouter()


class RegisterUser(BaseModel):
    username: str
    email: str
    password: str


@router.post("/register")
def register(user: RegisterUser):

    db = SessionLocal()

    hashed_password = hash_password(user.password)
    existing_user = db.query(User).filter(
    User.email == user.email
).first()
    
    if existing_user:
       return {
        "message": "Email already exists"
       }

    new_user = User(
        username=user.username,
        email=user.email,
        password=hashed_password
    )

    db.add(new_user)
    db.commit()

    return {
        "message": "User registered successfully"
    }

class LoginUser(BaseModel):
    email:str
    password:str

@router.post("/login")
def login(user:LoginUser):
    db = SessionLocal()
    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not existing_user:
        return {
            "message": "User not found"
        }
    
    valid_password=verify_password(
        user.password,
        existing_user.password
    )

    if not valid_password:
        return {
            "message": "Invalid password"
        }
    token = create_access_token({
        "user_id": existing_user.id,
        "email": existing_user.email
    })
    return {
    "message": "Login successful",
    "access_token": token,
    "user": {
        "id": existing_user.id,
        "username": existing_user.username,
        "email": existing_user.email
    }
}