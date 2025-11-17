import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout
from tensorflow.keras.callbacks import EarlyStopping
import joblib
import time

# --- Configuration ---
TRAINING_FILE = "training_data.csv"
MODEL_SAVE_PATH = "lstm_model.keras"
SCALER_SAVE_PATH = "scaler.joblib"

# These MUST match how we query the model later
LOOK_BACK = 20  # Use 20 previous readings
LOOK_FORWARD = 3 # To predict 3 steps into the future

# --- 1. Load and Preprocess Data ---
print("Loading and preprocessing data...")
data = pd.read_csv(TRAINING_FILE)
# We will train *only* on the pm2_5 data for this example
pm_data = data[['pm2_5']].values.astype(float)

# LSTMs are sensitive to scale. We must normalize data (e.g., to 0-1)
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(pm_data)

# --- 2. Create Sequences ---
# This function converts our data into [X, y] pairs
# X = a sequence of 'LOOK_BACK' readings
# y = the reading 'LOOK_FORWARD' steps in the future
def create_sequences(data, look_back, look_forward):
    X, y = [], []
    for i in range(len(data) - look_back - look_forward):
        X.append(data[i:(i + look_back), 0])
        y.append(data[i + look_back + look_forward - 1, 0])
    return np.array(X), np.array(y)

print(f"Creating sequences with look_back={LOOK_BACK}, look_forward={LOOK_FORWARD}...")
X, y = create_sequences(scaled_data, LOOK_BACK, LOOK_FORWARD)

# Reshape X for LSTM input: [samples, time_steps, features]
X = np.reshape(X, (X.shape[0], X.shape[1], 1))

# Split into training and validation sets (90% train, 10% valid)
split = int(len(X) * 0.9)
X_train, X_val = X[:split], X[split:]
y_train, y_val = y[:split], y[split:]

print(f"Training samples: {len(X_train)}")
print(f"Validation samples: {len(X_val)}")

# --- 3. Build the LSTM Model ---
print("Building LSTM model...")
model = Sequential()
# Input layer
model.add(LSTM(
    units=50, 
    return_sequences=True, 
    input_shape=(LOOK_BACK, 1) # (time_steps, features)
))
model.add(Dropout(0.2)) # Prevent overfitting
# Hidden layer
model.add(LSTM(units=50, return_sequences=False))
model.add(Dropout(0.2))
# Output layer
model.add(Dense(units=1)) # Predicts a single value

# Compile the model
model.compile(optimizer='adam', loss='mean_squared_error')
model.summary()

# --- 4. Train the Model ---
print("Training model...")
# We'll stop training early if the loss stops improving
early_stop = EarlyStopping(monitor='val_loss', patience=5, verbose=1)

start_time = time.time()
history = model.fit(
    X_train, 
    y_train, 
    epochs=50, # Max epochs
    batch_size=64, 
    validation_data=(X_val, y_val),
    callbacks=[early_stop],
    shuffle=False # Order matters in time series!
)
end_time = time.time()
print(f"Training took {end_time - start_time:.2f} seconds.")

# --- 5. Save the Model and Scaler ---
print("Saving model and scaler...")
model.save(MODEL_SAVE_PATH)
joblib.dump(scaler, SCALER_SAVE_PATH)

print(f"Model saved to {MODEL_SAVE_PATH}")
print(f"Scaler saved to {SCALER_SAVE_PATH}")
print("Training complete!")