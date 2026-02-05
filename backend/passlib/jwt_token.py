import jwt
import os
from datetime import datetime, timedelta
from dotenv import load_dotenv
from backend.passlib.oauth2 import oauth2_scheme
from typing import Annotated
from fastapi import Depends, HTTPException, status
from jwt.exceptions import InvalidTokenError
from backend.db.engine import SessionDep
from sqlmodel import select
from backend.model.user.user import User

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM  = os.getenv("ALGORITHM")

def get_user(session: SessionDep, user_id: int):
    return session.exec(select(User).where(User.id == user_id)).one_or_none()

def create_access_token(data: dict):
    to_encode = data.copy()

    if "id" in to_encode and not isinstance(to_encode["id"], str):
        to_encode["id"] = str(to_encode["id"])

    expire = datetime.now() + timedelta(minutes = 30)
    to_encode.update({"exp": expire})

    encode_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm = ALGORITHM)
    return encode_jwt


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    session: SessionDep,
):
    credentials_exception = HTTPException (
        status_code = status.HTTP_401_UNAUTHORIZED,
        detail = "Could not validate credentials",
        headers = {"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms = [ALGORITHM])
        user_id = payload.get("id")
        if user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception
    user = get_user(session, user_id)
    if user is None:
        raise credentials_exception
    return user


def verify_token(token: str):
    try:
        payload = jwt.encode(token, SECRET_KEY, algorithm = [ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return "토큰 만료됨"
    except jwt.InvalidTokenError:
        return "잘못된 토큰"