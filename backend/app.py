from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from db import engine
from db import Base

from models.user import User
from models.incident import Incident
from models.alert import Alert
from models.safezone import SafeZone
from models.live_location import LiveLocation

from routes.auth_routes import router as auth_router
from routes.user_routes import router as user_router
from routes.websocket_routes import router as websocket_router
from routes.incident_routes import router as incident_router
from routes.contact_routes import router as contact_router
from routes.sms_routes import router as sms_router
from routes.sos_routes import router as sos_router
from routes.alert_routes import router as alert_router
from routes.safezone_routes import router as safezone_router
from routes.live_tracking_routes import router as tracking_router
from routes.heatmap_routes import router as heatmap_router
from routes.analytics_routes import router as analytics_router      

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
SafeZone.metadata.create_all(
    bind=engine
)
LiveLocation.metadata.create_all(
    bind=engine
)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(websocket_router)
app.include_router(incident_router)
app.include_router(contact_router)
app.include_router(sms_router)
app.include_router(sos_router)
app.include_router(alert_router)
app.include_router(safezone_router)
app.include_router(tracking_router)
app.include_router(heatmap_router)
app.include_router(analytics_router)

@app.get("/")
def home():
    return {
        "message": "SAFENET Backend Running"
    }