from fastapi import APIRouter
from pydantic import BaseModel

from db import SessionLocal
from models.safezone import SafeZone

router = APIRouter()


class SafeZoneCreate(BaseModel):
    name: str
    type: str
    latitude: float
    longitude: float


@router.get("/safezones")
def get_safe_zones():

    db = SessionLocal()

    zones = db.query(
        SafeZone
    ).all()

    return zones


@router.post("/safezones")
def create_safe_zone(
    data: SafeZoneCreate
):

    db = SessionLocal()

    zone = SafeZone(
        name=data.name,
        type=data.type,
        latitude=data.latitude,
        longitude=data.longitude
    )

    db.add(zone)

    db.commit()

    db.refresh(zone)

    return {
        "message": "Safe Zone Added",
        "id": zone.id
    }


@router.delete(
    "/safezones/{zone_id}"
)
def delete_safe_zone(
    zone_id: int
):

    db = SessionLocal()

    zone = db.query(
        SafeZone
    ).filter(
        SafeZone.id == zone_id
    ).first()

    if not zone:

        return {
            "message":
            "Safe Zone Not Found"
        }

    db.delete(zone)

    db.commit()

    return {
        "message":
        "Safe Zone Deleted"
    }


@router.get("/seed-safezones")
def seed_safezones():

    db = SessionLocal()

    zone1 = SafeZone(
        name="Apollo Hospital",
        type="Hospital",
        latitude=13.0674,
        longitude=80.2376
    )

    zone2 = SafeZone(
        name="Police Station",
        type="Police",
        latitude=13.0827,
        longitude=80.2707
    )

    zone3 = SafeZone(
        name="Women's Shelter",
        type="Shelter",
        latitude=13.0500,
        longitude=80.2200
    )

    db.add(zone1)
    db.add(zone2)
    db.add(zone3)

    db.commit()

    return {
        "message":
        "Safe Zones Added"
    }