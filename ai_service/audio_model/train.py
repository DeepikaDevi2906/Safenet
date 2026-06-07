import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim

from torch.utils.data import (
    TensorDataset,
    random_split,
    DataLoader
)

import os

# =====================================================
# MODEL
# =====================================================

class AudioClassifier(nn.Module):

    def __init__(self, input_dim):

        super(AudioClassifier, self).__init__()

        self.fc1 = nn.Linear(input_dim, 64)

        self.relu = nn.ReLU()

        self.fc2 = nn.Linear(64, 32)

        self.fc3 = nn.Linear(32, 2)

    def forward(self, x):

        x = self.relu(self.fc1(x))

        x = self.relu(self.fc2(x))

        x = self.fc3(x)

        return x


# =====================================================
# TRAINING ENTRY POINT
# =====================================================

if __name__ == "__main__":

    BASE_DIR = os.path.dirname(
        os.path.abspath(__file__)
    )

    features_path = os.path.join(
        BASE_DIR,
        "features.npy"
    )

    labels_path = os.path.join(
        BASE_DIR,
        "labels.npy"
    )

    model_save_path = os.path.join(
        BASE_DIR,
        "audio_classifier.pth"
    )

    # =================================================
    # LOAD DATA
    # =================================================

    X = np.load(features_path)

    y = np.load(labels_path)

    print("Features shape:", X.shape)

    print("Labels shape:", y.shape)

    if len(X) == 0 or len(y) == 0:

        raise ValueError(
            "Dataset is empty."
        )

    # =================================================
    # TENSORS
    # =================================================

    X_tensor = torch.tensor(
        X,
        dtype=torch.float32
    )

    y_tensor = torch.tensor(
        y,
        dtype=torch.long
    )

    dataset = TensorDataset(
        X_tensor,
        y_tensor
    )

    print(
        "Dataset size:",
        len(dataset)
    )

    # =================================================
    # SPLIT
    # =================================================

    train_size = int(
        0.8 * len(dataset)
    )

    test_size = (
        len(dataset)
        - train_size
    )

    train_dataset, test_dataset = random_split(
        dataset,
        [train_size, test_size]
    )

    # =================================================
    # DATALOADERS
    # =================================================

    train_loader = DataLoader(
        train_dataset,
        batch_size=32,
        shuffle=True
    )

    test_loader = DataLoader(
        test_dataset,
        batch_size=32
    )

    # =================================================
    # MODEL
    # =================================================

    model = AudioClassifier(
        input_dim=X.shape[1]
    )

    criterion = nn.CrossEntropyLoss()

    optimizer = optim.Adam(
        model.parameters(),
        lr=0.001
    )

    # =================================================
    # TRAINING
    # =================================================

    EPOCHS = 30

    for epoch in range(EPOCHS):

        model.train()

        running_loss = 0

        correct = 0

        total = 0

        for inputs, labels in train_loader:

            optimizer.zero_grad()

            outputs = model(inputs)

            loss = criterion(
                outputs,
                labels
            )

            loss.backward()

            optimizer.step()

            running_loss += loss.item()

            _, predicted = torch.max(
                outputs,
                1
            )

            total += labels.size(0)

            correct += (
                predicted == labels
            ).sum().item()

        accuracy = (
            100 * correct / total
        )

        print(
            f"Epoch {epoch+1}/{EPOCHS} | "
            f"Loss: {running_loss:.4f} | "
            f"Accuracy: {accuracy:.2f}%"
        )

    # =================================================
    # SAVE MODEL
    # =================================================

    torch.save(
        model.state_dict(),
        model_save_path
    )

    print(
        "[INFO] Model saved successfully"
    )