from ultralytics import YOLO
import cv2

# Load model
model = YOLO("yolov8n.pt")

# Open webcam
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

while True:

    success, frame = cap.read()

    if not success:
        break

    # Run detection
    results = model(frame)

    person_count = 0

    # Get annotated frame
    annotated_frame = results[0].plot()

    # Process detections
    for box in results[0].boxes:

        class_id = int(box.cls[0])

        confidence = float(box.conf[0])

        # Get box size
        x1, y1, x2, y2 = box.xyxy[0]

        width = x2 - x1
        height = y2 - y1

        # Filter only proper persons
        if (
            class_id == 0
            and confidence > 0.7
            and width > 100
            and height > 200
        ):

            person_count += 1

    # Show people count
    cv2.putText(
        annotated_frame,
        f"People Count: {person_count}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        (0, 255, 0),
        2
    )

    # Crowd alert
    if person_count > 3:

        cv2.putText(
            annotated_frame,
            "Crowd Detected!",
            (20, 80),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (0, 0, 255),
            3
        )

    # Show frame
    cv2.imshow(
        "SAFENET Person Detection",
        annotated_frame
    )

    # ESC to exit
    if cv2.waitKey(1) == 27:
        break

cap.release()

cv2.destroyAllWindows()
