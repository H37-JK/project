from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException
from typing import Annotated
from sqlmodel import select
from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from backend.model.api.api_collection import ApiCollection
from backend.model.user import User
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    prefix = "/api-collection",
    tags = ["api-collection"],
    responses = {404: {"description": "Nou Found"}},
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


@router.post("/create/api-collection")
async def create_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    api_collection: ApiCollection
) -> ApiCollection:
    api_collection.user_id = current_user.id
    session.add(api_collection)
    session.commit()
    session.refresh(api_collection)
    return api_collection


@router.patch("/update/api-collection/{id}")
async def update_api_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    request_api_collection: ApiCollection,
    id: UUID,
) -> ApiCollection:
    api_collection = session.exec(select(ApiCollection).where(ApiCollection.user_id == current_user.id, ApiCollection.id == id)).one_or_noe()
    if not api_collection:
        raise HTTPException(status_code = 404, detail = "Request not found")

    update_data = request_api_collection.model_dump(exclude_unset = True)
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
    api_collection = session.exec(select(ApiCollection).where(ApiCollection.user_id == current_user.id, ApiCollection.id == id)).one_or_noe()
    if not api_collection:
        raise HTTPException(status_code = 404, detail = "Request not found")

    session.delete(api_collection)
    session.commit()

    return None