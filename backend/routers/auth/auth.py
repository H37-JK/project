from aiohttp.web_exceptions import HTTPException
from authlib.integrations.starlette_client import OAuth
from fastapi import FastAPI, Request, APIRouter, Response
import os

from sqlmodel import select

from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from backend.model import User
from backend.passlib.jwt_token import create_access_token

router = APIRouter (
    tags = ["auth"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
    route_class = LoggingRoute,
)

oauth = OAuth()
oauth.register (
    name = "google",
    client_id = os.getenv("GOOGLE_CLIENT_ID"),
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={'scope': 'openid email profile'}
)

@router.get("/login/google")
async def login(request: Request):
    redirect_uri = "http://localhost:8000/auth/callback/google"
    return await oauth.google.authorize_redirect(request, redirect_uri)


@router.get("/auth/callback/google")
async def auth (
    session: SessionDep,
    request: Request,
    response: Response
):
    try:
        token = await oauth.google.authrize_acess_token(request)
    except Exception:
        raise HTTPException(status_code = 400, detail = "인증에 실패 했습니다.")

    user_info = token.get("userinfo")
    user = session.exec(select(User).where(User.email == user_info.get("email"))).one_or_none()
    if not user:
        user = User (
            email = user_info.get('email'),
            name = user_info.get('name')
        )
        session.add(user)
        session.commit()
        session.refresh(user)

    data = {"id": user.id}
    access_token = create_access_token(data)
    response.set_cookie (
        key = "access_token",
        value = access_token,
        httponly = True,
        max_age = 3600,
    )

    return {"user": user_info, "access_token": "test"}