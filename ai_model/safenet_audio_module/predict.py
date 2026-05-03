import librosa
import numpy as np
import torch
import requests
import os # NEW: Import the OS module for path handling
from .train import AudioClassifier 
# Assuming train.py defines AudioClassifier and sets SR/INPUT_DIM

# --- GLOBAL MODEL AND CONFIGURATION ---
MODEL = None
# Dynamically construct the path to the model file
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(CURRENT_DIR, "audio_classifier.pth")

SR = 22050
INPUT_DIM = 13
LABELS = {0: "Not Screaming", 1: "Screaming"}

def load_audio_model():
    """Loads the model into global variable once."""
    global MODEL
    if MODEL is None:
        try:
            model = AudioClassifier(input_dim=INPUT_DIM)
            # Load the model using the calculated path
            model.load_state_dict(torch.load(MODEL_PATH, map_location=torch.device('cpu')))
            model.eval()
            MODEL = model
            print("Audio Classifier Model loaded successfully.")
        except FileNotFoundError:
            print(f"ERROR: Audio model file not found at {MODEL_PATH}")
            MODEL = None
        except Exception as e:
            print(f"ERROR loading audio model: {e}")
            MODEL = None
    return MODEL

def sliding_window_predict(model, audio, sr=SR, window_sec=3, step_sec=1):
    # This function remains unchanged (using global SR)
    window_len = int(window_sec * sr)
    step_len = int(step_sec * sr)
    preds = []

    for start in range(0, len(audio) - window_len + 1, step_len):
        chunk = audio[start:start+window_len]
        mfcc = librosa.feature.mfcc(y=chunk, sr=sr, n_mfcc=INPUT_DIM)
        mfcc_mean = np.mean(mfcc.T, axis=0)
        x = torch.tensor(mfcc_mean, dtype=torch.float32).unsqueeze(0)
        with torch.no_grad():
            output = model(x)
            pred = torch.argmax(output, dim=1).item()
            preds.append(pred)

    if preds:
        final_pred = max(set(preds), key=preds.count)
    else:
        final_pred = 0 
        
    return final_pred, preds

def send_scream_alert(location="Unknown", source="audio_detector", user_id=None):
    """Sends alert to the Flask /ai-alert endpoint."""
    url = "http://localhost:5000/ai-alert"
    data = {
        "type": "Screaming",
        "location": location,
        "details": f"Screaming detected by AI at {location}",
        "user_id": user_id
    }
    try:
        response = requests.post(url, json=data)
        if response.status_code in [200, 201]:
            print("AI Alert sent successfully to /ai-alert")
            return True
        else:
            print("Failed to send AI alert:", response.text)
            return False
    except Exception as e:
        print("Error sending AI alert:", e)
        return False

def predict_audio_file(file_path, location="Unknown", user_id=None):
    """
    Predicts from an uploaded audio file and triggers alert if screaming is detected.
    This is the function your main Flask route should call.
    """
    model = load_audio_model()
    if model is None:
        return {"error": "Audio model failed to load."}

    try:
        audio, sr = librosa.load(file_path, sr=SR)
    except Exception as e:
        return {"error": f"Failed to load audio file: {e}"}

    final_pred, preds = sliding_window_predict(model, audio, sr)

    final_prediction_label = LABELS[final_pred]

    if final_pred == 1:
        send_scream_alert(location=location, user_id=user_id)

    result = {
        "predictions": [LABELS[p] for p in preds],
        "final_prediction": final_prediction_label,
        "alert_triggered": final_pred == 1
    }

    return result