from typing import Annotated
from uuid import UUID
from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from fastapi import APIRouter, UploadFile, Depends, HTTPException
from sqlmodel import select

from backend.model.fle.file_collection import FileCollection
from backend.model.user import User
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    prefix = "/file-collection",
    tags = ["file-collection"],
    responses = {404: {"페이지": "찾을 수 없습니다."}},
    route_class = LoggingRoute,
)

@router.get("/get/file-collections")
async def get_file_collections (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    return session.exec(select(FileCollection).where(FileCollection.user_id == current_user.id)).all()


@router.get("/get/file-collection/{id}")
async def get_file_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    return session.exec(select(FileCollection).where(FileCollection.user_id == current_user.id, FileCollection.id == id)).one_or_none()


@router.post("/create/file-collection")
async def create_file_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    file_collection: FileCollection
) -> FileCollection:
    file_collection.user_id = current_user.id
    session.add(file_collection)
    session.commit()
    session.refresh(file_collection)

    return file_collection


@router.patch("/update/file-collection/{id}")
async def update_file_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    request_file_collection: FileCollection,
    id: UUID,
) -> FileCollection:
    file_collection = session.exec(select(FileCollection).where(FileCollection.user_id == current_user.id, FileCollection.id == id)).one_or_noe()
    if not file_collection:
        raise HTTPException(status_code = 404, detail = "Request not found")

    update_data = request_file_collection.model_dump(exclude_unset = True)
    file_collection.sqlmodel_update(update_data)

    session.add(file_collection)
    session.commit()
    session.refresh(file_collection)

    return file_collection


@router.delete("/delete/file-cllection/{id}")
async def delete_file_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID,
):
    file_collection = session.exec(select(FileCollection).where(FileCollection.user_id == current_user.id, FileCollection.id == id)).one_or_noe()
    if not file_collection:
        raise HTTPException(status_code = 404, detail = "Request not found")

    session.delete(file_collection)
    session.commit()

    return None
