from fastapi import APIRouter, File, UploadFile
from typing import Annotated

router = APIRouter (
    prefix = "/files",
    tags = ["files"],
    responses = {404: {"페이지": "찾을 수 없습니다"}},
)

@router.post("/files")
async def create_file(file: Annotated[bytes | None, File()] = None):
    if not file:
        return {"message": "파일이 전송 되지 않았습니다."}
    else:
        return {"file_size": len(file)}


@router.post("/upload/file/")
async def create_upload_file(file: UploadFile | None = None):
    if not file:
        return {"message": "파일이 전송 되지 않았습니다."}
    else:
        return {"filename": file.filename}

