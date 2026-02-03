from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from backend.helper.date import get_utc_now
from backend.logs.logging_route import LoggingRoute
from backend.model.monitor import Monitor, MonitorCreate, MonitorCreateResponse, MonitorUpdateResponse, MonitorUpdate
from backend.db.engine import SessionDep
from backend.model.user import User
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    tags = ["monitor"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
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
    return session.exec(select(Monitor).where(Monitor.user_id == current_user.id, Monitor.id == id)).one_or_none()


@router.post("/create/monitor", response_model = MonitorCreateResponse)
async def create_monitor (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    monitor_create: MonitorCreate,
):
    monitor = Monitor.model_validate (
        monitor_create,
        update = {
            "user_id": current_user.id
        }
    )
    session.add(monitor)
    session.commit()
    session.refresh(monitor)
    return monitor


@router.patch("/update/monitor/{id}", response_model = MonitorUpdateResponse)
async def update_monitor (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    monitor_update: MonitorUpdate,
    id: UUID
):
    monitor = session.exec(select(Monitor).where(Monitor.user_id == current_user.id, Monitor.id == id)).one_or_none()
    if not monitor:
         raise HTTPException(status_code = 404, detail = "해당 모니터가 존재 하지 않습니다")

    update_data = monitor_update.model_dump(exclude_unset = True, exclude_none = True)
    update_data["update_at"] = get_utc_now()
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
    monitor = session.exec(select(Monitor).where(Monitor.user_id == current_user.id, Monitor.id == id)).one_or_none()
    if not monitor:
        raise HTTPException(status_code = 404, detail = "해당 모니터가 존재 하지 않습니다")

    session.delete(monitor)
    session.commit()

    return True