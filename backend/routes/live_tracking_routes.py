from fastapi import APIRouter
from pydantic import BaseModel

from db import SessionLocal
from models.live_location import LiveLocation
from socket_manager import manager
import json

router = APIRouter()


class LocationData(BaseModel):

    user_id: int
    latitude: float
    longitude: float

@router.post("/track")
async def track_location(data: LocationData):

    db = SessionLocal()

    try:

        existing = db.query(
            LiveLocation
        ).filter(
            LiveLocation.user_id == data.user_id
        ).first()

        if existing:

            existing.latitude = data.latitude
            existing.longitude = data.longitude

        else:

            location = LiveLocation(
                user_id=data.user_id,
                latitude=data.latitude,
                longitude=data.longitude
            )

            db.add(location)

        db.commit()

        payload = {
            "user_id": data.user_id,
            "latitude": data.latitude,
            "longitude": data.longitude
        }
        print(
    "CLIENTS:",
    len(manager.active_connections)
)

        print(
    "BROADCASTING:",
    payload
)
        await manager.broadcast(
            json.dumps(payload)
        )

        return {
            "message": "Location Updated"
        }

    finally:

        db.close()
@router.get("/track/{user_id}")
def get_user_tracking(user_id: int):

    db = SessionLocal()

    try:

        locations = db.query(
            LiveLocation
        ).filter(
            LiveLocation.user_id == user_id
        ).all()

        return locations

    finally:

        db.close()


@router.get("/latest-tracking")
def latest_tracking():

    db = SessionLocal()

    try:

        locations = db.query(
            LiveLocation
        ).order_by(
            LiveLocation.id.desc()
        ).all()

        latest_users = {}

        for location in locations:

            if location.user_id not in latest_users:

                latest_users[
                    location.user_id
                ] = {

                    "user_id":
                    location.user_id,

                    "latitude":
                    location.latitude,

                    "longitude":
                    location.longitude,

                    "timestamp":
                    str(location.timestamp)

                }

        return list(
            latest_users.values()
        )

    finally:

        db.close()