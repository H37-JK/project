from typing import Annotated
from uuid import UUID

from argon2 import hash_password
from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlmodel import select

from backend.logs.logging_route import LoggingRoute
from backend.model.user import User, UserCreate, UserUpdate, UserCreateResponse, UserUpdateResponse
from backend.db.engine import SessionDep
from backend.passlib.argon2 import encode_password, verify_password
from backend.passlib.jwt_token import create_access_token
from backend.schemas.token import Token
from fastapi.security import OAuth2PasswordRequestForm
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    tags = ["user"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
    route_class = LoggingRoute
)

@router.get("/get/users", response_model_exclude = {"password"})
async def get_users (
    session: SessionDep
):
    return session.exec(select(User)).all()


@router.get("/get/user/{id}", response_model_exclude = {"password"})
async def get_user (
    session: SessionDep,
    id: UUID
):
    return session.exec(select(User).where(User.id == id)).one_or_none()


@router.get("/get/me", response_model_exclude = {"password"})
async def get_me (
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user


@router.get("/authenticate", response_model_exclude = {"password"})
async def authenticate (
    session: SessionDep,
    email: str,
    password: str
):
    user = session.exec(select(User).where(User.email == email)).one_or_none()
    if not user:
        return False
    if not verify_password(password, user.password):
        return False
    return user


@router.post("/login")
async def login_for_access_token (
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    session: SessionDep,
    response: Response
) -> Token:
    user = await authenticate(session, form_data.username, form_data.password)
    if not user:
        raise HTTPException (
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = "이메일이나 비밀번호가 틀립니다.",
            headers = {"WWW-Authenticate": "Bearer"},
        )
    data = {"id": user.id}
    access_token = create_access_token(data)
    response.set_cookie (
        key = "access_token",
        value = access_token,
        httponly = True,
        max_age = 3600,
    )
    return Token(access_token = access_token, token_type = "Bearer")


@router.post("/create/user", response_model = UserCreateResponse)
async def create_user (
    user_create: UserCreate,
    session: SessionDep
):
    user = User.model_validate(user_create)
    user.password = encode_password(user.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.patch("/update/user", response_model = UserUpdateResponse)
async def update_user (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    user_update: UserUpdate,
):
    update_data = user_update.model_dump(exclude_unset = True)
    if "password" in update_data:
        update_data["password"] = hash_password(update_data["password"])

    current_user.sqlmodel_update(update_data)

    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return current_user


@router.patch("/delete/user")
async def delete_user (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    session.delete(current_user)
    session.commit()

    return True



