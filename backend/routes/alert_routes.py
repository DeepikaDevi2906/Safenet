from fastapi import APIRouter
from pydantic import BaseModel

from db import SessionLocal
from models.alert import Alert

router = APIRouter()


class StatusUpdate(BaseModel):
    status: str


@router.get("/alerts")
def get_alerts():

    db = SessionLocal()

    try:

        alerts = db.query(Alert).all()

        return [
            {
                "id": alert.id,
                "user_id": alert.user_id,
                "latitude": alert.latitude,
                "longitude": alert.longitude,
                "status": alert.status,
                "created_at": str(alert.created_at)
            }
            for alert in alerts
        ]

    finally:

        db.close()


@router.get("/alerts/{alert_id}")
def get_alert(alert_id: int):

    db = SessionLocal()

    try:

        alert = db.query(Alert).filter(
            Alert.id == alert_id
        ).first()

        if not alert:
            return {
                "message": "Alert Not Found"
            }

        return {
            "id": alert.id,
            "user_id": alert.user_id,
            "latitude": alert.latitude,
            "longitude": alert.longitude,
            "status": alert.status,
            "created_at": str(alert.created_at)
        }

    finally:

        db.close()


@router.patch("/alerts/{alert_id}/status")
def update_status(
    alert_id: int,
    data: StatusUpdate
):

    db = SessionLocal()

    try:

        alert = db.query(Alert).filter(
            Alert.id == alert_id
        ).first()

        if not alert:

            return {
                "message": "Alert Not Found"
            }

        alert.status = data.status

        db.commit()

        return {
            "message": "Status Updated",
            "status": alert.status
        }

    finally:

        db.close()