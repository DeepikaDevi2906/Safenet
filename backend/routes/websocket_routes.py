from fastapi import APIRouter
from fastapi import WebSocket
from fastapi import WebSocketDisconnect

from socket_manager import manager

import asyncio

router = APIRouter()


@router.websocket("/ws/location")
async def location_websocket(
    websocket: WebSocket
):

    print(
        "LOCATION CLIENT CONNECTED"
    )

    await manager.connect(
        websocket
    )

    try:

        while True:

            await asyncio.sleep(1)

    except WebSocketDisconnect:

        print(
            "LOCATION CLIENT DISCONNECTED"
        )

        manager.disconnect(
            websocket
        )