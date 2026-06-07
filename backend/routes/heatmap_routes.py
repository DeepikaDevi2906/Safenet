from fastapi import APIRouter

from db import SessionLocal
from models.alert import Alert

router = APIRouter()


@router.get("/heatmap")
def heatmap_data():

    db = SessionLocal()

    alerts = db.query(
        Alert
    ).all()

    return [

        {
            "latitude":
            alert.latitude,

            "longitude":
            alert.longitude,

            "weight": 1
        }

        for alert in alerts

    ]