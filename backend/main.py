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

from backend.logs.logging_route import LoggingRoute
from backend.logs.logs import logger
from backend.db.engine import create_db_and_tables
from backend.routers.user import user
from backend.routers.api import api_requeset
from backend.routers.api import api_collection
from backend.routers.api import api_envirionment
from backend.routers.api import api_request_history
from backend.routers.file import file
from backend.routers.file import file_collection
from backend.routers.monitor import monitor
from backend.routers.web_analyze import web_analyze
from backend.routers.agent import agent
from backend.routers.websocket import websocket
from backend.routers.auth import auth
from backend.routers.database import database_server_info
from backend.routers.database import query
from fastapi import Request

warnings.filterwarnings("ignore", category=UserWarning, message="pkg_resources is deprecated as an API.")

origins = [
    "*"
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan = lifespan, route_class = LoggingRoute)
app.add_middleware (
    SessionMiddleware, # type: ignore
    secret_key = os.getenv("SECRET_KEY"),
    same_site="lax",
    https_only = False
)

app.add_middleware (
    CORSMiddleware, # type: ignore
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(user.router)
app.include_router(api_requeset.router)
app.include_router(api_collection.router)
app.include_router(api_envirionment.router)
app.include_router(api_request_history.router)
app.include_router(file.router)
app.include_router(file_collection.router)
app.include_router(monitor.router)
app.include_router(web_analyze.router)
app.include_router(agent.router)
app.include_router(websocket.router)
app.include_router(auth.router)
app.include_router(database_server_info.router)
app.include_router(query.router)

app.mount("/files", StaticFiles(directory = "uploads"), name = "files")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    print(exc.errors())

    for error in exc.errors():
        field = error['loc'][-1]
        error_type = error['type']
        ctx = error.get('ctx', {})
        min_len = error['ctx'].get('min_length')
        max_len = error['ctx'].get('max_length')

        if error_type == "string_too_short":
            if field == "name":
                msg = f"이름은 최소 {min_len}자 이상으로 입력해 주세요."
            elif field == "password":
                msg = f"비밀번호는 최소 {min_len}자 이상이어야 합니다."
            else:
                msg = f"최소 {min_len}자 이상으로 입력해 주세요."

        elif error_type == "string_too_long":
            if field == "email":
                msg = f"이메일은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "name":
                msg = f"이름은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "password":
                msg = f"이름은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "domain":
                msg = f"도메인은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "host":
                msg = f"호스트는 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "port":
                msg = f"포트는 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "username":
                msg = f"회원이름은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "key":
                msg = f"키값은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "db_type":
                msg = f"데이터베이스 타입은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "database":
                msg = f"데이터베이스 이름은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "driver":
                msg = f"드라이버는 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "method":
                msg = f"method는 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "url":
                msg = f"url은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "body_type":
                msg = f"body_type는 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "auth_type":
                msg = f"auth_type은 최대 {max_len}자 이하로 입력해 주세요."
            elif field == "prompt":
                msg = f"프롬포트는 최대 {max_len}자 이하로 입력해 주세요."
            else:
                msg = f"최대 {max_len}자까지 입력할 수 있습니다."

        elif error_type == "greater_than_equal":
            min_value = ctx.get("ge")
            if field == "port":
                msg = f"포트 번호는 {min_value} 이상의 값이어야 합니다."
            else:
                msg = f"입력값은 {min_value} 이상의 값이어야 합니다.."

        elif error_type == "less_than_equal":
            max_value = ctx.get("le")
            if field == "port":
                msg = f"포트 번호는 {max_value} 이하의 값이어야 합니다."
            else:
                msg = f"입력값은 {max_value} 이하의 값이어야 합니다."


        elif error_type == "string_pattern_mismatch":
            if field == "name":
                msg = "이름은 한글 또는 영문, 숫자로만 구성 되어야 합니다."

        elif error_type == "value_error":
            if field == "email":
                msg = "올바른 이메일 형식이 아닙니다."
            else:
                custom_msg = str(error.get("msg", ""))
                prefix = "Value error, "
                if custom_msg.startswith(prefix):
                    msg = custom_msg.removeprefix(prefix)
                else:
                    msg = custom_msg
        else: pass

        errors.append({"field": field, "message": msg})


    return JSONResponse(
        status_code = status.HTTP_422_UNPROCESSABLE_ENTITY,
        content = {"error_type": "RequestValidationError",
                 "detail": errors,
                 "trace": f"에러 상세: {traceback.format_exc()}",
        },
    )

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

