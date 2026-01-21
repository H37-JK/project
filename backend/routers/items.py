from fastapi import APIRouter, Depends, HTTPException

router = APIRouter (
    prefix = "/items",
    tags = ["items"],
    responses = {404: {"description": "Not Found"}},
)

fake_items_db = {"plumbus": {"name": "Plumbus"}, "gun": {"name": "Portal Gun"}}


@router.get("/")
async def read_items():
    return fake_items_db


@router.put (
    "/{item_id}",
    responses = {403: {"description" : "접근 금지"}},
)
async def update_item(item_id: str):
    if item_id != 'test':
        raise HTTPException(status_code = 403, detail = "test 아이템만 업데이트 가능합니다")
    return {"item_id": item_id, "name": "test"}