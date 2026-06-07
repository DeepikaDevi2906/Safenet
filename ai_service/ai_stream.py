import cv2
import torch
import torch.nn as nn
import numpy as np
import requests

from transformers import (
    AutoImageProcessor,
    SiglipForImageClassification
)

from ultralytics import YOLO

from PIL import Image

# =====================================================
# DEVICE
# =====================================================

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)

# =====================================================
# VIOLENCE MODEL PARAMETERS
# =====================================================

IMG_SIZE = (112, 112)

FRAMES_PER_CLIP = 16

# =====================================================
# VIOLENCE MODEL
# =====================================================

class Simple3DCNN(nn.Module):

    def __init__(self):

        super(Simple3DCNN, self).__init__()

        self.conv1 = nn.Conv3d(
            3,
            16,
            kernel_size=3,
            padding=1
        )

        self.pool = nn.MaxPool3d(2)

        self.conv2 = nn.Conv3d(
            16,
            32,
            kernel_size=3,
            padding=1
        )

        self.relu = nn.ReLU()

        self.fc1 = nn.Linear(
            32 * 4 * 28 * 28,
            128
        )

        self.fc2 = nn.Linear(
            128,
            2
        )

    def forward(self, x):

        x = self.relu(self.conv1(x))

        x = self.pool(x)

        x = self.relu(self.conv2(x))

        x = self.pool(x)

        x = x.view(x.size(0), -1)

        x = self.relu(self.fc1(x))

        x = self.fc2(x)

        return x

# =====================================================
# LOAD VIOLENCE MODEL
# =====================================================

violence_model = Simple3DCNN().to(DEVICE)

violence_model.load_state_dict(
    torch.load(
        "../ai_service/violence_model/violence_model.pth",
        map_location=DEVICE
    )
)

violence_model.eval()

print("[INFO] Violence model loaded")

# =====================================================
# LOAD FIRE MODEL
# =====================================================

FIRE_MODEL_NAME = "prithivMLmods/Fire-Detection-Siglip2"

fire_processor = AutoImageProcessor.from_pretrained(
    FIRE_MODEL_NAME
)

fire_model = SiglipForImageClassification.from_pretrained(
    FIRE_MODEL_NAME
)

fire_model.to(DEVICE)

print("[INFO] Fire model loaded")

# =====================================================
# LOAD YOLO PERSON MODEL
# =====================================================

person_model = YOLO("yolov8n.pt")

print("[INFO] YOLO person detector loaded")

# =====================================================
# WEBCAM
# =====================================================

camera = cv2.VideoCapture(0)

clip_frames = []

# =====================================================
# ALERT CONTROL
# =====================================================

violence_alert_sent = False

fire_alert_sent = False

# =====================================================
# PROCESS CLIP
# =====================================================

def process_clip(frames):

    clip = [
        cv2.resize(f, IMG_SIZE)
        for f in frames
    ]

    clip = np.array(
        clip,
        dtype=np.float32
    ) / 255.0

    clip = torch.tensor(clip).permute(
        3,
        0,
        1,
        2
    ).unsqueeze(0)

    return clip.to(DEVICE)

# =====================================================
# MAIN STREAM
# =====================================================

def generate_ai_frames():

    global clip_frames
    global violence_alert_sent
    global fire_alert_sent

    while True:

        success, frame = camera.read()
        cv2.putText(
    frame,
    "SAFENET TEST",
    (50, 50),
    cv2.FONT_HERSHEY_SIMPLEX,
    2,
    (0, 0, 255),
    4
)
        if not success:
            break

        # =================================================
        # DEFAULT VALUES
        # =================================================

        violence_label = "Analyzing..."
        violence_color = (255, 255, 0)

        fire_label_text = "Normal"
        fire_color = (0, 255, 0)

        person_count = 0

        # =================================================
        # VIOLENCE DETECTION
        # =================================================

        clip_frames.append(frame)

        if len(clip_frames) == FRAMES_PER_CLIP:

            input_clip = process_clip(
                clip_frames
            )

            with torch.no_grad():

                outputs = violence_model(
                    input_clip
                )

                probabilities = torch.softmax(
                    outputs,
                    dim=1
                )

                confidence = probabilities[0][1].item()

                prediction = torch.argmax(
                    probabilities,
                    dim=1
                ).item()

            if prediction == 1:

                violence_label = (
                    f"Violence {confidence*100:.2f}%"
                )

                violence_color = (0, 0, 255)

                # =========================================
                # SEND ALERT
                # =========================================

                if not violence_alert_sent:

                    try:

                        requests.post(
                            "http://localhost:5000/detect/violence"
                        )

                        print(
                            "🚨 Violence Alert Sent"
                        )

                        violence_alert_sent = True

                    except Exception as e:

                        print(e)

            else:

                violence_label = (
                    f"Safe {(1-confidence)*100:.2f}%"
                )

                violence_color = (0, 255, 0)

                violence_alert_sent = False

            clip_frames.pop(0)

        # =================================================
        # FIRE DETECTION
        # =================================================

        pil_image = Image.fromarray(
            cv2.cvtColor(
                frame,
                cv2.COLOR_BGR2RGB
            )
        )

        fire_inputs = fire_processor(
            images=pil_image,
            return_tensors="pt"
        ).to(DEVICE)

        with torch.no_grad():

            fire_outputs = fire_model(
                **fire_inputs
            )

            fire_probs = torch.nn.functional.softmax(
                fire_outputs.logits,
                dim=1
            )

            fire_confidence, fire_predicted = torch.max(
                fire_probs,
                dim=1
            )

        fire_label = fire_model.config.id2label[
            fire_predicted.item()
        ]

        fire_score = fire_confidence.item() * 100

        if fire_label.lower() == "fire":

            fire_color = (0, 0, 255)

            # =========================================
            # SEND FIRE ALERT
            # =========================================

            if not fire_alert_sent:

                try:

                    requests.post(
                        "http://localhost:5000/detect/fire"
                    )

                    print(
                        "🔥 Fire Alert Sent"
                    )

                    fire_alert_sent = True

                except Exception as e:

                    print(e)

        else:

            fire_alert_sent = False

            if fire_label.lower() == "smoke":

                fire_color = (0, 165, 255)

            else:

                fire_color = (0, 255, 0)

        fire_label_text = (
            f"{fire_label} {fire_score:.2f}%"
        )

        # =================================================
        # PERSON DETECTION
        # =================================================

        results = person_model(
            frame,
            conf=0.25,
            verbose=False
        )

        frame = results[0].plot()

        person_count = 0

        for box in results[0].boxes:

            cls = int(box.cls[0])

            if cls == 0:

                person_count += 1

        # =================================================
        # DRAW TEXT
        # =================================================

        cv2.putText(
            frame,
            violence_label,
            (20, 50),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            violence_color,
            3
        )

        cv2.putText(
            frame,
            fire_label_text,
            (20, 100),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            fire_color,
            3
        )

        cv2.putText(
            frame,
            f"People Count: {person_count}",
            (20, 150),
            cv2.FONT_HERSHEY_SIMPLEX,
            1,
            (255, 0, 0),
            3
        )

        if person_count >= 5:

            cv2.putText(
                frame,
                "CROWD ALERT!",
                (20, 200),
                cv2.FONT_HERSHEY_SIMPLEX,
                1,
                (0, 0, 255),
                4
            )

        # =================================================
        # STREAM FRAME
        # =================================================
        cv2.putText(
    frame,
    "SAFENET AI ACTIVE",
    (50, 300),
    cv2.FONT_HERSHEY_SIMPLEX,
    1,
    (0, 0, 255),
    3
)

        print("People Count =", person_count)
        _, buffer = cv2.imencode(
            ".jpg",
            frame
        )

        frame_bytes = buffer.tobytes()

        yield (
            b"--frame\r\n"
            b"Content-Type: image/jpeg\r\n\r\n"
            + frame_bytes +
            b"\r\n"
        )