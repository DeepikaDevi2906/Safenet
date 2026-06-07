from fastapi import APIRouter
from fastapi import Depends

from utils.helpers import get_current_user

router = APIRouter()


@router.get("/me")
def get_me(current_user = Depends(get_current_user)):

    if not current_user:
        return {
            "message": "Unauthorized"
        }

    return {
        "user": current_user
    }