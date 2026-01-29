import asyncio
from typing import Annotated

from fastapi import APIRouter, Depends
from backend.passlib.jwt_token import get_current_user
from backend.model.user import User
from backend.logs.logging_route import LoggingRoute
from backend.model.agent import Agent
from backend.db.engine import SessionDep
from backend.agent.agent import agent_worker_thread
from backend.websocket.connection_anager import manager

router = APIRouter (
    prefix = "/agent",
    tags = ["agent"],
    responses = {404: {"description" : "Not Found"}},
    route_class = LoggingRoute,
)

@router.post("/create/agent")
async def create_agent (
    agent: Agent,
    current_user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
) -> Agent:
    # user_websocket = manager.get_connection(current_user.id)
    loop = asyncio.get_running_loop()
    response = await loop.run_in_executor(None, lambda: agent_worker_thread(agent.prompt))
    # manager.disconnect(current_user.id)

    agent.user_id = current_user.id
    agent.history = response["history"]
    agent.result = response["result"]
    session.add(agent)
    session.commit()
    session.refresh(agent)
    return agent