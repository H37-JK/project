from typing import Annotated

from fastapi import APIRouter, UploadFile, Depends

from backend.db.engine import SessionDep
from backend.logs.logging_route import LoggingRoute
import shutil

from backend.model.file import File
from backend.model.user import User
from backend.passlib.jwt_token import get_current_user

router = APIRouter (
    prefix = "/files",
    tags = ["files"],
    responses = {404: {"페이지": "찾을 수 없습니다."}},
    route_class = LoggingRoute,
)

UPLOAD_DIR = "uploads"
BASEURL = "http://localhost:8000/files"

@router.post("/upload/file/")
async def create_upload_file(
    upload_file: UploadFile | None,
    current_user: Annotated[User, Depends(get_current_user)],
    session: SessionDep
) -> File:
    file_path = f"{UPLOAD_DIR}/{upload_file.filename}"

    with open(file_path, "wb+") as file_object:
        shutil.copyfileobj(upload_file.file, file_object)

    file = File()
    file.filename = upload_file.filename
    file.content_type = upload_file.content_type
    file.size = upload_file.size
    file.url = f"{BASEURL}/{upload_file.filename}"
    file.user_id = current_user.id

    session.add(file)
    session.commit()
    session.refresh(file)

    return file

