from fastapi import FastAPI, WebSocket, APIRouter
from backend.logs.logging_route import LoggingRoute
from backend.websocket.connection_anager import manager
from fastapi import WebSocketDisconnect

router = APIRouter (
    tags = ["websocket"],
    responses = {404: {"description" : "Not Found"}},
    route_class = LoggingRoute,
)

@router.websocket("/ws/view/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: int):
    await manager.connect(user_id, websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(user_id)
