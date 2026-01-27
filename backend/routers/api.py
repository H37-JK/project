from fastapi import APIRouter
from sqlmodel import select

from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from backend.model.api import API

router = APIRouter (
    prefix = "/api",
    tags = ["api"],
    responses = {404: {"description": "Nou Found"}},
    route_class = LoggingRoute,
)

@router.get("/get/apis")
async def get_apis(session: SessionDep):
    return session.exec(select(API)).all()


@router.get("/get/{id}")
async def get_api(session: SessionDep, id: int):
    return session.exec(select(API).where(API.id == id)).one_or_none()


@router.post("/create/api")
async def create_api(api: API, session: SessionDep) -> API:
    session.add(api)
    session.commit()
    session.refresh(api)
    return api