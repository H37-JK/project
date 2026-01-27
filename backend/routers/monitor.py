from typing import Annotated

from fastapi import APIRouter, Depends

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

@router.post("/create/monitor")
async def create_monitor (
    monitor: Monitor,
    current_user: Annotated[User, Depends(get_current_user)],
    session: SessionDep
) -> Monitor:
    monitor.user_id = current_user.id
    session.add(monitor)
    session.commit()
    session.refresh(monitor)
    return monitor
