from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.db.engine import create_db_and_tables
from backend.routers import files
from backend.routers import user
from backend.routers import db
from backend.routers import monitor

origins = [
    "*"
]

async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan = lifespan)
app.add_middleware (
    CORSMiddleware,
    allow_origins = origins,
    allow_credentials = True,
    allow_methods = ["*"],
    allow_headers = ["*"]
)

app.include_router(user.router)
app.include_router(files.router)
app.include_router(db.router)
app.include_router(monitor.router)






# @app.exception_handlers(StarletteHTTPException)
# async def custom_http_exception_handler(request, exc):
#     print(f"Http Error: {repr(exc)}")
#     return await http_exception_handler(request, exc)
