import sounddevice as sd
import numpy as np
import librosa
import torch
import time
import os
import requests

from train import AudioClassifier

# =====================================================
# CONFIG
# =====================================================

SR = 22050
DURATION = 3
INPUT_DIM = 13

LABELS = {
    0: "Not Screaming",
    1: "Screaming"
}

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "audio_classifier.pth"
)

# =====================================================
# LOAD MODEL
# =====================================================

model = AudioClassifier(
    input_dim=INPUT_DIM
)

model.load_state_dict(
    torch.load(
        MODEL_PATH,
        map_location=torch.device("cpu")
    )
)

model.eval()

print("[INFO] Audio model loaded")

# =====================================================
# FEATURE EXTRACTION
# =====================================================

def extract_features(audio):

    mfcc = librosa.feature.mfcc(
        y=audio,
        sr=SR,
        n_mfcc=INPUT_DIM
    )

    mfcc_mean = np.mean(
        mfcc.T,
        axis=0
    )

    return mfcc_mean

# =====================================================
# SEND ALERT
# =====================================================

def send_alert():

    try:

        response = requests.post(
            "http://localhost:5000/detect/scream"
        )

        print(
            f"[INFO] Alert Sent ({response.status_code})"
        )

    except Exception as e:

        print(
            "[ERROR] Failed to send alert:",
            e
        )

# =====================================================
# LIVE DETECTION
# =====================================================

while True:

    print("\n[INFO] Listening...")

    audio = sd.rec(
        int(DURATION * SR),
        samplerate=SR,
        channels=1,
        dtype="float32"
    )

    sd.wait()

    audio = audio.flatten()

    feat = extract_features(audio)

    x = torch.tensor(
        feat,
        dtype=torch.float32
    ).unsqueeze(0)

    with torch.no_grad():

        output = model(x)

        pred = torch.argmax(
            output,
            dim=1
        ).item()

    label = LABELS[pred]

    print(
        f"[RESULT] {label}"
    )

    if pred == 1:

        print(
            "🚨 SCREAM DETECTED 🚨"
        )

        send_alert()

    time.sleep(1)