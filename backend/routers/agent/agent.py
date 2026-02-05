import asyncio
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from backend.helper.date import get_utc_now
from backend.passlib.jwt_token import get_current_user
from backend.model.user.user import User
from backend.logs.logging_route import LoggingRoute
from backend.model.agent.agent import Agent, AgentCreateResponse, AgentCreate, AgentUpdateResponse, AgentUpdate
from backend.db.engine import SessionDep
from backend.agent.agent import agent_worker_thread

router = APIRouter (
    tags = ["agent"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
    route_class = LoggingRoute,
)

@router.get("/get/agents")
async def get_agents (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
):
    return session.exec(select(Agent).where(Agent.user_id == current_user.id)).all()


@router.get("/get/agent/{id}")
async def get_agent (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    return session.exec(select(Agent).where(Agent.user_id == current_user.id, Agent.id == id)).one_or_none()


@router.post("/create/agent", response_model = AgentCreateResponse)
async def create_agent (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    agent_create: AgentCreate,
):
    # user_websocket = manager.get_connection(current_user.id)
    loop = asyncio.get_running_loop()
    response = await loop.run_in_executor(None, lambda: agent_worker_thread(agent_create.prompt))
    # manager.disconnect(current_user.id)

    agent = Agent.model_validate (
        agent_create,
        update = {
            "user_id": current_user.id
        }
    )

    agent.history = response["history"]
    agent.result = response["result"]
    session.add(agent)
    session.commit()
    session.refresh(agent)
    return agent


@router.patch("/update/agent/{id}", response_model = AgentUpdateResponse)
async def update_agent (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    agent_update: AgentUpdate,
    id: UUID
) -> Agent:
    agent = session.exec(select(Agent).where(Agent.user_id == current_user.id, Agent.id == id)).one_or_none()
    if not agent:
         raise HTTPException(status_code = 404, detail = "해당 에이전트가 존재 하지 않습니다.")

    update_data = agent_update.model_dump(exclude_unset = True, exclude_none = True)
    update_data["update_at"] = get_utc_now()
    agent.sqlmodel_update(update_data)

    session.add(agent)
    session.commit()
    session.refresh(agent)

    return agent


@router.delete("/delete/agent/{id}")
async def delete_agent (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    agent = session.exec(select(Agent).where(Agent.user_id == current_user.id, Agent.id == id)).one_or_none()
    if not agent:
        raise HTTPException(status_code = 404, detail = "해당 에이전트가 존재 하지 않습니다.")

    session.delete(agent)
    session.commit()

    return True