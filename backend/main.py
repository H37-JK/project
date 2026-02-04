import sys
import os
import warnings

import traceback

from contextlib import asynccontextmanager
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from starlette.middleware.sessions import SessionMiddleware
from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware import Middleware

current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
sys.path.append(parent_dir)

from backend.logs.logs import logger
from backend.logs.logging_route import LoggingRoute
from backend.db.engine import create_db_and_tables
from backend.routers import user
from backend.routers.api import api_requeset
from backend.routers.api import api_collection
from backend.routers.api import api_envirionment
from backend.routers.api import api_request_history
from backend.routers.file import file
from backend.routers.file import file_collection
from backend.routers import db
from backend.routers import monitor
from backend.routers import web_analyze
from backend.routers import agent
from backend.routers import websocket
from backend.routers.auth import auth
from fastapi import Request

warnings.filterwarnings("ignore", category=UserWarning, message="pkg_resources is deprecated as an API.")

origins = [
    "*"
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


middleware = [
    Middleware (
        CORSMiddleware, # type: ignore
        allow_origins = origins,
        allow_credentials = True,
        allow_methods = ["*"],
        allow_headers = ["*"]
    )
]

app = FastAPI(middleware = middleware, lifespan = lifespan, route_class = LoggingRoute)
app.add_middleware(SessionMiddleware, secret_key = os.getenv("SECRET_KEY")) #type: ignore

app.include_router(user.router)
app.include_router(api_requeset.router)
app.include_router(api_collection.router)
app.include_router(api_envirionment.router)
app.include_router(api_request_history.router)
app.include_router(file.router)
app.include_router(file_collection.router)
app.include_router(db.router)
app.include_router(monitor.router)
app.include_router(web_analyze.router)
app.include_router(agent.router)
app.include_router(websocket.router)
app.include_router(auth.router)

app.mount("/files", StaticFiles(directory = "uploads"), name = "files")


@app.exception_handler(IntegrityError)
async def integrity_exception_handler(request: Request, error: IntegrityError):
    logger.error(f"데이터베이스 제약 조건 위반 | {request.method} {request.url.path}")
    logger.error(f"  > 클라이언트 IP: {request.client.host}")
    logger.error(f"  > 오류 메시지: {traceback.format_exc()}")
    return JSONResponse (
        status_code = status.HTTP_400_BAD_REQUEST,
        content = {
            "error_type": "IntegrityError",
            "detail": "데이터 제약 조건 위반 입니다. (중복된 데이터나 잘못된 참조 입니다.)",
            "trace": f"에러 상세: {traceback.format_exc()}",
        }
    )

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request: Request, error: SQLAlchemyError):
    logger.error(f"기타 데이터베이스 오류 | {request.method} {request.url.path}")
    logger.error(f"  > 클라이언트 IP: {request.client.host}")
    logger.error(f"  > 오류 메시지: {traceback.format_exc()}")
    return JSONResponse (
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
        content = {
            "error_type": "기타 데이터베이스 오류",
            "detail": "데이터베이스 작업 중 오류가 발생 하였습니다",
            "trace": f"에러 상세: {traceback.format_exc()}",
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, error: RequestValidationError):
    error_details = error.errors()
    logger.error(f"잘못된 요청 데이터 (422 Unprocessable Entity) | {request.method} {request.url.path}")
    logger.error(f"  > 클라이언트 IP: {request.client.host}")
    logger.error(f"  > 오류 메시지: {error_details}")
    return JSONResponse(
        status_code = status.HTTP_422_UNPROCESSABLE_CONTENT,
        content = {
            "error_type": "클라이언트 오류",
            "detail": "클라이언트 요청중 오류가 발생 하였습니다",
            "trace": f"에러 상세: {traceback.format_exc()}",
        }
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, error: Exception):
    logger.error(f"예상치 못한 오류 발생 (500 Internal Server Error) | {request.method} {request.url.path}")
    logger.error(f"  > 클라이언트 IP: {request.client.host}")
    logger.error(f"  > 오류 메시지: {traceback.format_exc()}")
    return JSONResponse(
        status_code = status.HTTP_500_INTERNAL_SERVER_ERROR,
        content = {
            "error_type": "서버 내부 오류",
            "detail": "서버 내부 오류가 발생 했습니다. (Internal Server Error)",
            "trace": f"에러 상세: {traceback.format_exc()}",
        }
    )

