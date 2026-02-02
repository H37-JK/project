from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from backend.logs.logging_route import LoggingRoute
from backend.model.monitor import Monitor
from backend.db.engine import SessionDep
from backend.model.user import User
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    prefix = "/monitor",
    tags = ["monitor"],
    responses = {404: {"description" : "Not Found"}},
    route_class = LoggingRoute,
)

@router.get("/get/monitors")
async def get_monitors (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    return session.exec(select(Monitor).where(Monitor.user_id == current_user.id)).all()


@router.get("/get/monitor/{id}")
async def get_monitor (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    return session.exec(select(Monitor).where(Monitor.user_id == current_user.id, Monitor.id == id)).one_or_noe()


@router.post("/create/monitor")
async def create_monitor (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    monitor: Monitor,
) -> Monitor:
    monitor.user_id = current_user.id
    session.add(monitor)
    session.commit()
    session.refresh(monitor)
    return monitor


@router.patch("/update/monitor/{id}")
async def update_monitor (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    request_monitor: Monitor,
) -> Monitor:
    monitor = session.exec(select(Monitor).where(Monitor.user_id == current_user.id, Monitor.id == id)).one_or_noe()
    if not monitor:
         raise HTTPException(status_code = 404, detail = "Request not found")

    update_data = request_monitor.model_dump(exclude_unset = True)
    monitor.sqlmodel_update(update_data)

    session.add(monitor)
    session.commit()
    session.refresh(monitor)

    return monitor


@router.delete("/delete/monitor/{id}")
async def delete_monitor (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    monitor = session.exec(select(Monitor).where(Monitor.user_id == current_user.id, Monitor.id == id)).one_or_noe()
    if not monitor:
        raise HTTPException(status_code = 404, detail = "Request not found")

    session.delete(monitor)
    session.commit()

    return None