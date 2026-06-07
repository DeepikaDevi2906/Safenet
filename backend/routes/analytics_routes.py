from fastapi import APIRouter

from db import SessionLocal

from models.alert import Alert
from models.safezone import SafeZone
from models.live_location import LiveLocation

router = APIRouter()


@router.get("/analytics")
def get_analytics():

    db = SessionLocal()

    try:

        total_alerts = db.query(
            Alert
        ).count()

        active_alerts = db.query(
            Alert
        ).filter(
            Alert.status == "Active"
        ).count()

        investigating_alerts = db.query(
            Alert
        ).filter(
            Alert.status == "Investigating"
        ).count()

        resolved_alerts = db.query(
            Alert
        ).filter(
            Alert.status == "Resolved"
        ).count()

        safe_zones = db.query(
            SafeZone
        ).count()

        tracked_locations = db.query(
            LiveLocation
        ).count()

        return {

            "total_alerts":
            total_alerts,

            "active_alerts":
            active_alerts,

            "investigating_alerts":
            investigating_alerts,

            "resolved_alerts":
            resolved_alerts,

            "safe_zones":
            safe_zones,

            "tracked_locations":
            tracked_locations

        }

    finally:

        db.close()