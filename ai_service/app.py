from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

import socketio
import requests
import threading
import subprocess
import sys
import os
from fastapi.responses import StreamingResponse
from ai_stream import generate_ai_frames
# =====================================================
# SOCKET.IO SERVER
# =====================================================

sio = socketio.AsyncServer(
    async_mode="asgi",
    cors_allowed_origins="*"
)

# =====================================================
# FASTAPI APP
# =====================================================

app = FastAPI()

# =====================================================
# SOCKET APP
# =====================================================

socket_app = socketio.ASGIApp(
    sio,
    app
)

# =====================================================
# CORS
# =====================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# =====================================================
# START AUDIO AI
# =====================================================

def start_audio_detection():

    try:

        script_path = os.path.join(
            os.path.dirname(__file__),
            "audio_model",
            "live_audio_detect.py"
        )

        subprocess.Popen(
            [sys.executable, script_path]
        )

        print("[INFO] Audio AI Started")

    except Exception as e:

        print("[ERROR] Audio AI:", e)

# =====================================================
# STARTUP EVENT
# =====================================================

@app.on_event("startup")
async def startup_event():

    print("[INFO] Starting Audio AI...")

    threading.Thread(
        target=start_audio_detection,
        daemon=True
    ).start()

# =====================================================
# SOCKET EVENTS
# =====================================================

@sio.event
async def connect(sid, environ):

    print(f"[SOCKET] Connected: {sid}")

@sio.event
async def disconnect(sid):

    print(f"[SOCKET] Disconnected: {sid}")

@sio.event
async def new_alert(sid, data):

    print(f"[NEW ALERT] {data}")

    await sio.emit(
        "receive_alert",
        data
    )

# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "message": "AI Service Running"
    }

# =====================================================
# FIRE ALERT
# =====================================================

@app.post("/detect/fire")
async def detect_fire():

    incident_data = {
        "incident_type": "Fire",
        "location": "Block A",
        "severity": "High",
        "status": "Active"
    }

    try:

        requests.post(
            "http://127.0.0.1:8000/incidents",
            json=incident_data
        )

    except Exception as e:

        print("Incident API Error:", e)

    await sio.emit(
        "receive_alert",
        {
            "type": "Fire",
            "message": "🔥 Fire detected at Block A"
        }
    )

    return {
        "message": "Fire detected"
    }

# =====================================================
# VIOLENCE ALERT
# =====================================================

@app.post("/detect/violence")
async def detect_violence():

    incident_data = {
        "incident_type": "Violence",
        "location": "Main Camera",
        "severity": "Critical",
        "status": "Active"
    }

    try:

        requests.post(
            "http://127.0.0.1:8000/incidents",
            json=incident_data
        )

    except Exception as e:

        print("Incident API Error:", e)

    await sio.emit(
        "receive_alert",
        {
            "type": "Violence",
            "message": "🚨 Violence detected at Main Camera"
        }
    )

    return {
        "message": "Violence detected"
    }

# =====================================================
# SCREAM ALERT
# =====================================================

@app.post("/detect/scream")
async def detect_scream():

    incident_data = {
        "incident_type": "Screaming",
        "location": "Microphone Sensor",
        "severity": "Critical",
        "status": "Active"
    }

    try:

        requests.post(
            "http://127.0.0.1:8000/incidents",
            json=incident_data
        )

    except Exception as e:

        print("Incident API Error:", e)

    await sio.emit(
        "receive_alert",
        {
            "type": "Screaming",
            "message": "🚨 Scream detected from microphone"
        }
    )

    return {
        "message": "Scream detected"
    }

@app.get("/video-feed")
def video_feed():
    return StreamingResponse(
        generate_ai_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )