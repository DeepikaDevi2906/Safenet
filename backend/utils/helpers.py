from fastapi import Header

from utils.jwt_handler import verify_token


def get_current_user(authorization: str = Header(None)):

    if not authorization:
        return None

    token = authorization.split(" ")[1]

    payload = verify_token(token)

    return payload