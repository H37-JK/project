from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import Annotated
from backend.model.user import User
from backend.passlib.jwt_token import get_current_user
from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from backend.model.api.api_environment import ApiEnvironment

router = APIRouter (
    prefix = "/api-environment",
    tags = ["api-environment"],
    responses = {404: {"description": "Nou Found"}},
    route_class = LoggingRoute,
)


@router.get("/get/api-environment/{id}")
async def get_api_environment (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: int
):
    return session.exec(select(ApiEnvironment).where(ApiEnvironment.id == id, ApiEnvironment.user_id == current_user.id)).one_or_none()


@router.post("/create/api-environment")
async def create_api_api_environment (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    api_environment: ApiEnvironment,
) -> ApiEnvironment:
    api_environment.user_id = current_user.id
    session.add(api_environment)
    session.commit()
    session.refresh(api_environment)
    return api_environment


@router.patch("/update/api-environment/{id}")
async def update_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    request_api_environment: ApiEnvironment,
    id: UUID
) -> ApiEnvironment:
    api_environment = session.exec(select(ApiEnvironment).where(ApiEnvironment.user_id == current_user.id, ApiEnvironment.id == id)).one_or_noe()
    if not api_environment:
        raise HTTPException(status_code = 404, detail = "Request not found")

    update_data = request_api_environment.model_dump(exclude_unset = True)
    api_environment.sqlmodel_update(update_data)

    session.add(api_environment)
    session.commit()
    session.refresh(api_environment)

    return api_environment


@router.delete("/delete/api-collection/{id}")
async def delete_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    api_environment = session.exec(select(ApiEnvironment).where(ApiEnvironment.user_id == current_user.id, ApiEnvironment.id == id)).one_or_noe()
    if not api_environment:
        raise HTTPException(status_code = 404, detail = "Request not found")

    session.delete(api_environment)
    session.commit()

    return None