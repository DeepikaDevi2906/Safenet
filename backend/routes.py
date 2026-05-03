from flask import Blueprint, request, jsonify
from backend.extensions import db, socketio
from backend.models import AlertLog, User, EmergencyContact
from backend.alert_service import trigger_alert
from datetime import datetime, timedelta
from collections import Counter
import os # NEW: Required for file handling
import uuid # NEW: For unique filenames

# Assuming you have defined the correct paths and helper functions
from ai_model.person_detector import process_frame
from ai_model.safenet_audio_module.predict import predict_audio_file # Using the correct name

routes_bp = Blueprint("routes_bp", __name__)

# --- Configuration for Temporary File Storage ---
# CRITICAL: Define a safe folder path for temporary files
UPLOAD_FOLDER = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'temp_audio')


@routes_bp.route("/")
def home():
    return jsonify({"message": "SAFENET backend is working ✅"})

# ------------------- AUTH -------------------
@routes_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")
    phone = data.get("phone")

    if not name or not email or not password:
        return jsonify({"message": "Missing fields"}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "Email already exists"}), 400

    user = User(name=name, email=email, phone=phone)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "Registration successful"}), 201

@routes_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        return jsonify({"message": "Login successful", "user_id": user.id}), 200
    return jsonify({"message": "Invalid email or password"}), 401

# ------------------- EMERGENCY CONTACTS -------------------
@routes_bp.route("/contacts/<int:user_id>", methods=["GET"])
def get_contacts(user_id):
    contacts = EmergencyContact.query.filter_by(user_id=user_id).all()
    return jsonify([{
        "id": c.id,
        "name": c.name,
        "phone": c.phone
    } for c in contacts])

@routes_bp.route("/contacts/<int:user_id>", methods=["POST"])
def add_contact(user_id):
    data = request.get_json()
    name = data.get("name")
    phone = data.get("phone")
    if not name or not phone:
        return jsonify({"error": "Missing contact info"}), 400
    
    # Check if contact already exists (optional safety)
    if EmergencyContact.query.filter_by(user_id=user_id, phone=phone).first():
         return jsonify({"error": "Contact with this number already exists"}), 409
         
    contact = EmergencyContact(user_id=user_id, name=name, phone=phone)
    db.session.add(contact)
    db.session.commit()
    return jsonify({"message": "Contact added", "contact": {"id": contact.id, "name": name, "phone": phone}}), 201

@routes_bp.route("/contacts/<int:user_id>/<int:contact_id>", methods=["PUT"])
def edit_contact(user_id, contact_id):
    contact = EmergencyContact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return jsonify({"error": "Contact not found"}), 404
    data = request.get_json()
    contact.name = data.get("name", contact.name)
    contact.phone = data.get("phone", contact.phone)
    db.session.commit()
    return jsonify({"message": "Contact updated"})

@routes_bp.route("/contacts/<int:user_id>/<int:contact_id>", methods=["DELETE"])
def delete_contact(user_id, contact_id):
    contact = EmergencyContact.query.filter_by(id=contact_id, user_id=user_id).first()
    if not contact:
        return jsonify({"error": "Contact not found"}), 404
    db.session.delete(contact)
    db.session.commit()
    return jsonify({"message": "Contact deleted"})

# ------------------- SOS ALERT -------------------
@routes_bp.route("/sos", methods=["POST"])
def sos_alert():
    data = request.get_json()
    user_id = data.get("user_id")
    location = data.get("location", "Unknown")
    
    # Optional: Get user name if sent by the React Native app for better logs
    user_name = data.get("user_name", f"User {user_id}") 
    
    # Create the AlertLog entry with all fields
    alert = AlertLog(
        user_id=user_id, 
        alert_type="SOS", 
        location=location, 
        message=f"SOS triggered by {user_name} from {location}"
    )
    
    db.session.add(alert)
    db.session.commit()

    socketio.emit("new_alert", {
        "type": "SOS",
        "location": location,
        "message": f"SOS triggered by {user_name} at {location}", 
        "timestamp": alert.timestamp.strftime("%Y-%m-%d %H:%M:%S")
    })

    # Trigger external alert service (SMS/Email/etc.)
    trigger_alert(alert_type="sos", location=location, details=f"User {user_id} ({user_name}) pressed SOS")
    
    return jsonify({"message": "SOS alert sent successfully"}), 200


# ------------------- AI AUDIO ANALYSIS -------------------
@routes_bp.route("/analyze-audio", methods=["POST"])
def analyze_audio():
    # 1. Check for audio file
    if "audio" not in request.files:
        return jsonify({"error": "No audio file provided"}), 400

    audio_file = request.files["audio"]
    
    # Get metadata from the mobile app
    user_id = request.form.get("user_id") 
    location = request.form.get("location", "Unknown Audio Source")
    
    # 2. Save file temporarily
    if not os.path.exists(UPLOAD_FOLDER):
        os.makedirs(UPLOAD_FOLDER)
        
    # Use a unique name to prevent conflicts
    unique_filename = str(uuid.uuid4()) + os.path.splitext(audio_file.filename)[1]
    temp_filepath = os.path.join(UPLOAD_FOLDER, unique_filename)
    audio_file.save(temp_filepath)

    try:
        # 3. Analyze audio (assumes predict_audio_file is correctly defined)
        result = predict_audio_file(temp_filepath, location=location, user_id=user_id) 

        # 4. Trigger alert system if screaming is detected
        if result.get("alert_triggered"):
            alert_msg = result.get("message", "Screaming detected by AI.")
            
            # Log to DB
            alert = AlertLog(user_id=user_id, alert_type="Screaming", location=location, message=alert_msg)
            db.session.add(alert)
            db.session.commit()
            
            # Notify dashboard/mobile clients via socket.io
            socketio.emit("new_alert", {"type": "Screaming", "location": location, "message": alert_msg})
            trigger_alert(alert_type="scream", location=location, details=alert_msg)
            
            return jsonify({"message": "Screaming Alert Triggered", "result": result}), 200

        return jsonify({"message": "Audio analyzed, no alert detected", "result": result}), 200

    except Exception as e:
        print(f"Audio analysis error: {e}")
        return jsonify({"error": "Internal server error during analysis"}), 500
    
    finally:
        # 5. Clean up the temporary file
        if os.path.exists(temp_filepath):
            os.remove(temp_filepath)


# ------------------- VIDEO FRAME (CAMERA AI) -------------------
@routes_bp.route("/video-frame", methods=["POST"])
def receive_frame():
    frame_file = request.files.get("frame")
    lat = request.form.get("lat", "Unknown")
    lon = request.form.get("lon", "Unknown")
    user_id = request.form.get("user_id")
    
    if frame_file:
        frame_bytes = frame_file.read()
        
        # Call the gender-based threat model
        alert_result = process_frame(frame_bytes, location=f"{lat},{lon}")

        if alert_result.get("triggered"): 
            
            # 1. Log the alert to the database
            alert = AlertLog(
                user_id=user_id, 
                alert_type=alert_result["alert_type"],
                location=alert_result["location"],
                message=alert_result["message"]
            )
            db.session.add(alert)
            db.session.commit()
            
            # 2. Trigger notifications
            trigger_alert(
                alert_type="ai_group_threat", 
                location=alert_result["location"], 
                details=alert_result["message"]
            )
            
            return jsonify({"alert": True, "message": alert_result["message"]}), 200
            
        return jsonify({"alert": False}), 200

    return jsonify({"error": "No frame received"}), 400