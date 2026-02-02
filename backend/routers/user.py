from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import select

from backend.logs.logging_route import LoggingRoute
from backend.model.user import User
from backend.db.engine import SessionDep
from backend.passlib.argon2 import encode_password, verify_password
from backend.passlib.jwt_token import create_access_token
from backend.schemas.token import Token
from fastapi.security import OAuth2PasswordRequestForm
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    prefix = "/user",
    tags = ["user"],
    responses = {404: {"description" : "Not Found"}},
    route_class = LoggingRoute
)

@router.get("/get/users")
async def get_users (
    session: SessionDep
):
    return session.exec(select(User)).all()


@router.get("/get/user/{id}")
async def get_user (
    session: SessionDep,
    id: UUID
):
    return session.exec(select(User).where(User.id == id)).one_or_none()


@router.get("/get/me", response_model = User)
async def get_me (
    current_user: Annotated[User, Depends(get_current_user)]
):
    return current_user


@router.get("/authenticate")
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
    session: SessionDep
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
    return Token(access_token = access_token, token_type = "Bearer")


@router.post("/create/user", response_model_exclude = {"password"})
async def create_user (
    user: User,
    session: SessionDep
) -> User:
    user.password = encode_password(user.password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@router.patch("/update/user", response_model_exclude = {"password"})
async def update_user (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    request_user: User,
):
    user = session.exec(select(User).where(User.id == current_user.id)).one_or_noe()
    if not user:
        raise HTTPException(status_code = 404, detail = "Request not found")

    update_data = request_user.model_dump(exclude_unset = True)
    user.sqlmodel_update(update_data)

    session.add(user)
    session.commit()
    session.refresh(user)

    return user


@router.patch("/delete/user")
async def delete_user (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    user = session.exec(select(User).where(User.id == current_user.id)).one_or_noe()
    if not user:
        raise HTTPException(status_code = 404, detail = "Request not found")

    session.delete(user)
    session.commit()

    return None



