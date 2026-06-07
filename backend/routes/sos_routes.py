from fastapi import APIRouter
from pydantic import BaseModel

from db import SessionLocal

from models.contact import Contact
from models.alert import Alert

from services.sms_service import send_sms

from socket_manager import manager

import asyncio
import json

router = APIRouter()


class SOSRequest(BaseModel):
    latitude: float
    longitude: float


@router.post("/sos/{user_id}")
async def trigger_sos(
    user_id: int,
    data: SOSRequest
):

    db = SessionLocal()

    contacts = db.query(Contact).filter(
        Contact.user_id == user_id
    ).all()

    maps_link = (
        f"https://maps.google.com/?q="
        f"{data.latitude},"
        f"{data.longitude}"
    )

    message = f"""
🚨 SAFENET ALERT

Emergency detected.

Location:
{maps_link}
"""

    # ==========================
    # SAVE ALERT
    # ==========================

    alert = Alert(
        user_id=user_id,
        latitude=data.latitude,
        longitude=data.longitude
    )

    print("SAVING ALERT")

    db.add(alert)
    db.commit()
    db.refresh(alert)

    print(
        "ALERT SAVED:",
        alert.id
    )

    # ==========================
    # SEND SMS
    # ==========================

    for contact in contacts:

        phone = contact.phone

        if not phone.startswith("+"):
            phone = "+91" + phone

        send_sms(
            phone,
            message
        )

    # ==========================
    # WEBSOCKET BROADCAST
    # ==========================

    print("REACHED BROADCAST SECTION")

    try:

        print("TRYING TO BROADCAST")

        await manager.broadcast(
            json.dumps({
                "type": "SOS",
                "user_id": user_id,
                "latitude": data.latitude,
                "longitude": data.longitude,
                "time": str(alert.created_at)
            })
        )

        print("SOS Broadcast Sent")

    except Exception as e:

        print(
            "WebSocket Error:",
            e
        )

    return {
        "message": "SOS Sent",
        "contacts_notified": len(
            contacts
        ),
        "location": maps_link,
        "alert_id": alert.id
    }