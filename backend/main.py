import sys
import os
import warnings

import traceback

from contextlib import asynccontextmanager
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from starlette.status import HTTP_500_INTERNAL_SERVER_ERROR

from fastapi import FastAPI
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

app.mount("/files", StaticFiles(directory = "uploads"), name = "files")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    error_details = exc.errors()
    logger.error(f"잘못된 요청 데이터 (422 Unprocessable Entity) | {request.method} {request.url.path}")
    logger.error(f"  > 클라이언트 IP: {request.client.host}")
    logger.error(f"  > 오류 상세: {error_details}")
    return JSONResponse(
        status_code = 422,
        content = {"detail": error_details},
    )

@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error(f"예상치 못한 오류 발생 (500 Internal Server Error) | {request.method} {request.url.path}")
    logger.error(f"  > 클라이언트 IP: {request.client.host}")
    logger.error(f"  > Traceback: {traceback.format_exc()}")
    return JSONResponse(
        status_code = HTTP_500_INTERNAL_SERVER_ERROR,
        content = {"message": "서버 내부 오류가 발생 했습니다. (Internal Server Error)"},
    )

