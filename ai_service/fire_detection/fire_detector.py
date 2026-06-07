from transformers import (
    AutoImageProcessor,
    SiglipForImageClassification
)

from PIL import Image

import torch
import cv2
import numpy as np

# -----------------------------
# Load Model
# -----------------------------
MODEL_NAME = "prithivMLmods/Fire-Detection-Siglip2"

processor = AutoImageProcessor.from_pretrained(
    MODEL_NAME
)

model = SiglipForImageClassification.from_pretrained(
    MODEL_NAME
)

device = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

model.to(device)

# -----------------------------
# Webcam
# -----------------------------
cap = cv2.VideoCapture(0)

while True:

    success, frame = cap.read()

    if not success:
        break

    # Convert OpenCV frame to PIL
    image = Image.fromarray(
        cv2.cvtColor(
            frame,
            cv2.COLOR_BGR2RGB
        )
    )

    # Process image
    inputs = processor(
        images=image,
        return_tensors="pt"
    ).to(device)

    # Prediction
    with torch.no_grad():

        outputs = model(**inputs)

        probs = torch.nn.functional.softmax(
            outputs.logits,
            dim=1
        )

        confidence, predicted_class = torch.max(
            probs,
            dim=1
        )

    label = model.config.id2label[
        predicted_class.item()
    ]

    confidence_score = confidence.item() * 100

    # Colors
    if label.lower() == "fire":

        color = (0, 0, 255)

    elif label.lower() == "smoke":

        color = (0, 165, 255)

    else:

        color = (0, 255, 0)

    # Draw text
    text = f"{label} {confidence_score:.2f}%"

    cv2.putText(
        frame,
        text,
        (20, 50),
        cv2.FONT_HERSHEY_SIMPLEX,
        1,
        color,
        3
    )

    # Show frame
    cv2.imshow(
        "SAFENET Fire Detection",
        frame
    )

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()

cv2.destroyAllWindows()