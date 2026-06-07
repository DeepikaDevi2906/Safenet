from fastapi import APIRouter
from pydantic import BaseModel

from db import SessionLocal
from models.incident import Incident
from socket_manager import manager

router = APIRouter()


class IncidentCreate(BaseModel):

    incident_type: str
    location: str
    severity: str
    status: str


@router.post("/incidents")
async def create_incident(data: IncidentCreate):

    db = SessionLocal()

    incident = Incident(
        incident_type=data.incident_type,
        location=data.location,
        severity=data.severity,
        status=data.status
    )

    db.add(incident)

    db.commit()

    await manager.broadcast(
        f"ALERT: {data.incident_type} detected at {data.location}"
    )

    return {
        "message": "Incident created"
    }


@router.get("/incidents")
def get_incidents():

    db = SessionLocal()

    incidents = db.query(Incident).all()

    return incidents

