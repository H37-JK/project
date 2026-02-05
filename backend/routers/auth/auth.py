from authlib.integrations.starlette_client import OAuth
from fastapi import FastAPI, Request, APIRouter, Response, HTTPException
import os

from sqlmodel import select
from starlette.responses import RedirectResponse

from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from backend.model import User
from backend.passlib.jwt_token import create_access_token
from backend.schemas.token import Token
GOOGLE_REDIRECT_URI = "http://localhost:8000/auth/callback/google"

router = APIRouter (
    tags = ["auth"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
)

oauth = OAuth()
oauth.register (
    name = "google",
    client_id = os.getenv("GOOGLE_CLIENT_ID"),
    client_secret = os.getenv("GOOGLE_CLIENT_SECRET"),
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
    client_kwargs={
        'scope': 'openid email profile',
        'prompt': 'select_account'
    }
)

@router.get("/login/google")
async def login(request: Request):
    return await oauth.google.authorize_redirect(request, GOOGLE_REDIRECT_URI)


@router.get("/auth/callback/google")
async def auth (
    session: SessionDep,
    request: Request,
    response: Response,
):

    try:
        token = await oauth.google.authorize_access_token(request)
    except Exception as e:
        raise HTTPException(status_code=400, detail="인증에 실패 했습니다.")

    user_info = token.get("userinfo")

    user = session.exec(select(User).where(User.email == user_info.get("email"))).one_or_none()
    if not user:
        user = User (
            email = user_info.get("email"),
            name = user_info.get("name"),
            provider = "GOOGLE",
            provider_id = user_info.get("sub")
        )
    else:
        update_data = User (
            provider = "GOOGLE",
            provider_id = user_info.get("sub")
        )
        update_data = update_data.model_dump(exclude_unset = True)
        user.sqlmodel_update(update_data)

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
    return {"user": user}
