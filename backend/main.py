from contextlib import asynccontextmanager

import warnings
warnings.filterwarnings("ignore", category=UserWarning, module='Wappalyzer')

import httpx
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware import Middleware

from backend.db.engine import create_db_and_tables
from backend.routers import user
from backend.routers import api
from backend.routers import files
from backend.routers import db
from backend.routers import monitor
from backend.routers import web_analyze

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

app = FastAPI(middleware = middleware, lifespan = lifespan)

app.include_router(user.router)
app.include_router(api.router)
app.include_router(files.router)
app.include_router(db.router)
app.include_router(monitor.router)
app.include_router(web_analyze.router)






# @app.exception_handlers(StarletteHTTPException)
# async def custom_http_exception_handler(request, exc):
#     print(f"Http Error: {repr(exc)}")
#     return await http_exception_handler(request, exc)
