import os
import librosa
import numpy as np

# =====================================================
# DATASET PATH
# =====================================================

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATASET_PATH = os.path.join(
    BASE_DIR,
    "datasets"
)

LABEL_MAP = {
    "NotScreaming": 0,
    "Screaming": 1
}

N_MFCC = 13

# =====================================================
# FEATURE EXTRACTION
# =====================================================

def extract_features(file_path):

    y, sr = librosa.load(
        file_path,
        sr=None
    )

    mfcc = librosa.feature.mfcc(
        y=y,
        sr=sr,
        n_mfcc=N_MFCC
    )

    mfcc_mean = np.mean(
        mfcc.T,
        axis=0
    )

    return mfcc_mean

# =====================================================
# MAIN
# =====================================================

def main():

    features = []
    labels = []

    for label_name, label_num in LABEL_MAP.items():

        folder_path = os.path.join(
            DATASET_PATH,
            label_name
        )

        if not os.path.exists(folder_path):

            print(f"Folder not found: {folder_path}")
            continue

        print(f"[INFO] Processing {label_name}")

        for filename in os.listdir(folder_path):

            if filename.endswith(".wav"):

                file_path = os.path.join(
                    folder_path,
                    filename
                )

                try:

                    feat = extract_features(
                        file_path
                    )

                    features.append(feat)

                    labels.append(label_num)

                except Exception as e:

                    print(f"Error processing {filename}: {e}")

    X = np.array(features)
    y = np.array(labels)

    print(f"[INFO] Dataset Shape: {X.shape}")

    np.save(
        os.path.join(BASE_DIR, "features.npy"),
        X
    )

    np.save(
        os.path.join(BASE_DIR, "labels.npy"),
        y
    )

    print("[INFO] Saved features.npy and labels.npy")

if __name__ == "__main__":
    main()