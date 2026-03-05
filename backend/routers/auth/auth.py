import urllib

from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
from fastapi import FastAPI, Request, APIRouter, Response, HTTPException
import os

from sqlmodel import select
from starlette.responses import RedirectResponse

from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from backend.model import User, ApiRequest
from backend.model.api.api_request import ApiRequestCreate
from backend.passlib.jwt_token import create_access_token
from backend.routers.api.api_request import get_api_requests
from backend.schemas.token import Token

load_dotenv()
host = os.getenv("HOST_URL", "http://localhost:8000")
front = os.getenv("FRONT_URL", "http://localhost:3000")
GOOGLE_REDIRECT_URI = f"{host}/auth/callback/google"
GITHUB_REDIRECT_URI = f"{host}/auth/callback/github"


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

oauth.register(
    name='github',
    client_id=os.getenv("GITHUB_CLIENT_ID"),
    client_secret=os.getenv("GITHUB_CLIENT_SECRET"),
    access_token_url='https://github.com/login/oauth/access_token',
    access_token_params=None,
    authorize_url='https://github.com/login/oauth/authorize',
    authorize_params=None,
    api_base_url='https://api.github.com/',
    client_kwargs={'scope': 'user:email'}, # 이메일 권한 필수
)

@router.get("/login/github")
async def login_github(request: Request):
    return await oauth.github.authorize_redirect(request, GITHUB_REDIRECT_URI)


@router.get("/auth/callback/github")
async def auth_github(session: SessionDep, request: Request):
    try:
        try:
            token = await oauth.github.authorize_access_token(request)
        except Exception as e:
            print(e)
            return RedirectResponse(url=f"{front}/login?error=github_auth_failed")

        resp = await oauth.github.get('user', token=token)
        user_info = resp.json()
        print(user_info)

        user = session.exec(select(User).where(User.email == user_info.get("login"))).one_or_none()
        if not user:
            user = User (
                email = user_info.get("login"),
                name = user_info.get("login"),
                provider = "GITHUB",
                provider_id = user_info.get("sub")
            )
        else:
            update_data = User (
                provider = "GITHUB",
                provider_id = user_info.get("sub")
            )
            update_data = update_data.model_dump(exclude_unset = True)
            user.sqlmodel_update(update_data)

        session.add(user)
        session.commit()
        session.refresh(user)
        res = await get_api_requests(session, user)
        if not res:
            api_request_create = ApiRequestCreate (

            )
            api_request = ApiRequest.model_validate (
                api_request_create,
                update = {
                    "user_id": user.id,
                    "api_collection_id": None,
                    "is_deletable": False,
                    "params": [
                        {
                            'key': '',
                            'value': '',
                            'desc': '',
                            'active': True
                        }
                    ],
                    "headers": [
                        {
                            'key': '',
                            'value': '',
                            'desc': '',
                            'active': True
                        }
                    ],
                    "body_type": 'application/json'
                }
            )
            session.add(api_request)
            session.commit()
            session.refresh(api_request)

        data = {"id": user.id}
        access_token = create_access_token(data)

        base_url = f"{front}/auth/google/callback"
        params = {
            "access_token": access_token,
            "email": user.email,
            "id": str(user.id)
        }
        query_string = urllib.parse.urlencode(params)
        response = RedirectResponse(url=f"{base_url}?{query_string}")
        return response

    except Exception as e:
        print(f"GitHub Login Error: {e}")
        return RedirectResponse(url=f"{front}/login?error=github_auth_failed")


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
        return RedirectResponse(url=f"{front}/login?error=google_auth_failed")

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
    res = await get_api_requests(session, user)
    if not res:
        api_request_create = ApiRequestCreate (

        )
        api_request = ApiRequest.model_validate (
        api_request_create,
        update = {
            "user_id": user.id,
            "api_collection_id": None,
            "is_deletable": False,
            "params": [
                {
                    'key': '',
                    'value': '',
                    'desc': '',
                    'active': True
                }
            ],
            "headers": [
                {
                    'key': '',
                    'value': '',
                    'desc': '',
                    'active': True
                }
            ],
            "body_type": 'application/json'
        }
        )
        session.add(api_request)
        session.commit()
        session.refresh(api_request)




    data = {"id": user.id}
    access_token = create_access_token(data)

    base_url = f"{front}/auth/google/callback"
    params = {
        "access_token": access_token,
        "email": user.email,
        "id": str(user.id)
    }
    query_string = urllib.parse.urlencode(params)
    response = RedirectResponse(url=f"{base_url}?{query_string}")
    return response
