import cv2
import numpy as np
from ultralytics import YOLO
from .gender_predictor import predict_gender

# Load YOLO model (for person detection)
yolo_model = YOLO("yolov8m.pt")  # Make sure yolov8m.pt is available

def process_frame(frame_bytes, location="Unknown"):
    """
    Process a single camera frame:
    - Detect persons using YOLO
    - Crop person regions
    - Predict gender
    - Apply the security rule (1 woman and >= 6 men)
    - Returns a dictionary with alert details if the condition is met.
    """
    # Convert bytes to OpenCV image
    nparr = np.frombuffer(frame_bytes, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    # Initialize counters
    male_count = 0
    female_count = 0

    # YOLO detection (confidence threshold 0.3)
    # Using 'classes=0' ensures we only detect 'person' objects (class 0 in COCO dataset)
    results = yolo_model(frame, conf=0.3, classes=0)[0] 

    for box in results.boxes:
        # Extract bounding box coordinates (already filtered for person)
        x1, y1, x2, y2 = map(int, box.xyxy[0])
        person_crop = frame[y1:y2, x1:x2]

        # Predict gender for the detected person
        gender = predict_gender(person_crop)

        # Update counts based on prediction
        if gender == "Male":
            male_count += 1
        elif gender == "Female":
            female_count += 1

    # Apply the Security Rule Check
    if female_count == 1 and male_count >= 3:
        alert_details = (
            f"Suspicious group detected: Exactly 1 woman with {male_count} men "
            f"at location {location}."
        )
        
        # Return alert status and details
        return {
            "alert_type": "Group Threat",
            "message": alert_details,
            "location": location,
            "triggered": True 
        }
    else:
        # No alert triggered
        return {"triggered": False}