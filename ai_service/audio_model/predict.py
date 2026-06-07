import librosa
import numpy as np
import torch
import os

from train import AudioClassifier

# =====================================================
# CONFIG
# =====================================================

SR = 22050
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

def extract_features(file_path):

    y, sr = librosa.load(
        file_path,
        sr=SR
    )

    mfcc = librosa.feature.mfcc(
        y=y,
        sr=sr,
        n_mfcc=INPUT_DIM
    )

    mfcc_mean = np.mean(
        mfcc.T,
        axis=0
    )

    return mfcc_mean

# =====================================================
# PREDICTION
# =====================================================

def predict_audio(file_path):

    feat = extract_features(file_path)

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

    return label

# =====================================================
# TEST
# =====================================================

if __name__ == "__main__":

    test_file = "datasets/Screaming/1.wav"

    result = predict_audio(test_file)

    print("Prediction:", result)