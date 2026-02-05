from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlmodel import select
from backend.db.engine import SessionDep
from backend.helper.date import get_utc_now
from backend.logs.logging_route import LoggingRoute
from backend.model.api.api_collection import ApiCollection, ApiCollectionCreate, ApiCollectionUpdate, \
    ApiCollectionUpdateResponse, ApiCollectionCreateResponse
from backend.model.user.user import User
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    tags = ["api-collection"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
    route_class = LoggingRoute,
)

@router.get("/get/api-collections")
async def get_api_collections (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    return session.exec(select(ApiCollection).where(ApiCollection.user_id == current_user.id)).all()


@router.get("/get/api-collection/{id}")
async def get_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    return session.exec(select(ApiCollection).where(ApiCollection.user_id == current_user.id, ApiCollection.id == id)).one_or_none()


@router.post("/create/api-collection", response_model = ApiCollectionCreateResponse)
async def create_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    api_collection_create: ApiCollectionCreate
):
    api_collection = ApiCollection.model_validate (
        api_collection_create,
        update = {
            "user_id": current_user.id
        }
    )
    session.add(api_collection)
    session.commit()
    session.refresh(api_collection)
    return api_collection


@router.patch("/update/api-collection/{id}", response_model = ApiCollectionUpdateResponse)
async def update_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    api_collection_update: ApiCollectionUpdate,
    id: UUID,
):
    api_collection = session.exec(select(ApiCollection).where(ApiCollection.user_id == current_user.id, ApiCollection.id == id)).one_or_none()
    if not api_collection:
        raise HTTPException(status_code = 404, detail = "해당 컬렉션이 존재 하지 않습니다.")

    update_data = api_collection_update.model_dump(exclude_unset = True, exclude_none = True)
    update_data["update_at"] = get_utc_now()
    api_collection.sqlmodel_update(update_data)

    session.add(api_collection)
    session.commit()
    session.refresh(api_collection)

    return api_collection


@router.delete("/delete/api-collection/{id}")
async def delete_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    api_collection = session.exec(select(ApiCollection).where(ApiCollection.user_id == current_user.id, ApiCollection.id == id)).one_or_none()
    if not api_collection:
        raise HTTPException(status_code = 404, detail = "해당 컬렉션이 존재 하지 않습니다.")

    session.delete(api_collection)
    session.commit()

    return True