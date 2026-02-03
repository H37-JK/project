import uuid
from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, UploadFile, Depends, HTTPException
from sqlmodel import select

from backend.db.engine import SessionDep
from backend.helper.date import get_utc_now
from backend.logs.logging_route import LoggingRoute
import shutil
import os

from backend.model.fle.file import File, FileCreateResponse, FileUpdateResponse, FileUpdate
from backend.model.user import User
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    tags = ["file"],
    responses = {404: {"description": "잘못된 경로 입니다."}},
    route_class = LoggingRoute,
)

UPLOAD_DIR = "uploads"
BASEURL = "http://localhost:8000/files"

@router.get("/get/files")
async def get_files (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)]
):
    return session.exec(select(File).where(File.user_id == current_user.id)).all()


@router.get("/get/file/{id}")
async def get_file (
    session: SessionDep,
    current_user: Annotated[User, Depends(get_current_user)],
    id: UUID
):
    return session.exec(select(File).where(File.user_id == current_user.id, File.id == id)).one_or_none()


@router.post("/upload/file/", response_model = FileCreateResponse)
async def create_upload_file (
    upload_file: UploadFile | None,
    current_user: Annotated[User, Depends(get_current_user)],
    session: SessionDep
):
    _, file_extension = os.path.splitext(upload_file.filename)

    filename = f"{str(uuid.uuid4())}{file_extension}"
    file_path = f"{UPLOAD_DIR}/{filename}"

    with open(file_path, "wb+") as file_object:
        shutil.copyfileobj(upload_file.file, file_object)

    file = File()
    file.filename = upload_file.filename
    file.content_type = upload_file.content_type
    file.size = upload_file.size
    file.url = f"{BASEURL}/{filename}"
    file.user_id = current_user.id

    session.add(file)
    session.commit()
    session.refresh(file)

    return file


@router.patch("/update/file/{id}", response_model = FileUpdateResponse)
async def update_file (
    file_update: FileUpdate,
    current_user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    id: UUID
):
    file = session.exec(select(File).where(File.user_id == current_user.id, File.id == id)).one_or_none()
    if not file:
        raise HTTPException(status_code = 404, detail = "해당 파일이 존재 하지 않습니다.")

    update_data = file_update.model_dump(exclude_unset = True, exclude_none = True)
    update_data["update_at"] = get_utc_now()
    file.sqlmodel_update(update_data)

    session.add(file)
    session.commit()
    session.refresh(file)

    return file


@router.delete("/delete/file/{id}")
async def delete_file (
    current_user: Annotated[User, Depends(get_current_user)],
    session: SessionDep,
    id: UUID,
):
    file = session.exec(select(File).where(File.user_id == current_user.id, File.id == id)).one_or_none()
    if not file:
        raise HTTPException(status_code = 404, detail = "해당 파일이 존재 하지 않습니다.")

    file_path = f"{UPLOAD_DIR}/{file.filename}"
    if os.path.exists(file_path):
        os.remove(file_path)
    else:
        pass

    session.delete(file)
    session.commit()

    return True