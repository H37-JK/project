from typing import Annotated
from uuid import UUID
from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import select

from backend.model.file.file_collection import FileCollection, FileCollectionCreateResponse, FileCollectionCreate, \
    FileCollectionUpdateResponse, FileCollectionUpdate
from backend.model.user.user import User
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    tags = ["file-collection"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
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


@router.post("/create/file-collection", response_model = FileCollectionCreateResponse)
async def create_file_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    file_collection_create: FileCollectionCreate
):
    file_collection = FileCollection.model_validate (
        file_collection_create,
        update = {
            "user_id": current_user.id
        }
    )
    session.add(file_collection)
    session.commit()
    session.refresh(file_collection)

    return file_collection


@router.patch("/update/file-collection/{id}", response_model = FileCollectionUpdateResponse)
async def update_file_collection (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    file_collection_update: FileCollectionUpdate,
    id: UUID,
):
    file_collection = session.exec(select(FileCollection).where(FileCollection.user_id == current_user.id, FileCollection.id == id)).one_or_none()
    if not file_collection:
        raise HTTPException(status_code = 404, detail = "해당 파일 컬렉션이 존재 하지 않습니다.")

    update_data = file_collection_update.model_dump(exclude_unset = True)
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
    file_collection = session.exec(select(FileCollection).where(FileCollection.user_id == current_user.id, FileCollection.id == id)).one_or_none()
    if not file_collection:
        raise HTTPException(status_code = 404, detail = "해당 파일 컬렉션이 존재 하지 않습니다.")

    session.delete(file_collection)
    session.commit()

    return True
