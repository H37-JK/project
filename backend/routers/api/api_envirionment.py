from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select
from typing import Annotated

from backend.helper.date import get_utc_now
from backend.model.user.user import User
from backend.passlib.jwt_token import get_current_user
from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from backend.model.api.api_environment import ApiEnvironment, ApiEnvironmentCreate, ApiEnvironmentCreateResponse, \
    ApiEnvironmentUpdateResponse, ApiEnvironmentUpdate

router = APIRouter (
    tags = ["api-environment"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
    route_class = LoggingRoute,
)


@router.get("/get/api-environment/{id}")
async def get_api_environment (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: int
):
    return session.exec(select(ApiEnvironment).where(ApiEnvironment.id == id, ApiEnvironment.user_id == current_user.id)).one_or_none()


@router.post("/create/api-environment", response_model = ApiEnvironmentCreateResponse)
async def create_api_api_environment (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    api_environment_create: ApiEnvironmentCreate,
):
    api_environment = ApiEnvironment.model_validate (
        api_environment_create,
        update = {
            "user_id": current_user.id
        }
    )
    api_environment.user_id = current_user.id
    session.add(api_environment)
    session.commit()
    session.refresh(api_environment)
    return api_environment


@router.patch("/update/api-environment/{id}", response_model = ApiEnvironmentUpdateResponse)
async def update_api_environment (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    api_environment_update: ApiEnvironmentUpdate,
    id: UUID
):
    api_environment = session.exec(select(ApiEnvironment).where(ApiEnvironment.user_id == current_user.id, ApiEnvironment.id == id)).one_or_none()
    if not api_environment:
        raise HTTPException(status_code = 404, detail = "해당 API 환경 변수가 존재 하지 않습니다.")

    update_data = api_environment_update.model_dump(exclude_unset = True, exclude_none = True)
    update_data["update_at"] = get_utc_now()
    api_environment.sqlmodel_update(update_data)

    session.add(api_environment)
    session.commit()
    session.refresh(api_environment)

    return api_environment


@router.delete("/delete/api-environment/{id}")
async def delete_api_environment (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    api_environment = session.exec(select(ApiEnvironment).where(ApiEnvironment.user_id == current_user.id, ApiEnvironment.id == id)).one_or_none()
    if not api_environment:
        raise HTTPException(status_code = 404, detail = "해당 API 환경 변수가 존재 하지 않습니다.")

    session.delete(api_environment)
    session.commit()

    return True