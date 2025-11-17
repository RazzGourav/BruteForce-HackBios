from tensorflow.keras.models import load_model
import joblib
import numpy as np
from typing import List

class LSTMForecaster:
    """
    This class loads a pre-trained Keras LSTM model and its associated
    scaler to make predictions on new, live data.
    """
    def __init__(self, model_path, scaler_path, breach_threshold=150.0):
        print("Loading LSTM model and scaler...")
        try:
            self.model = load_model(model_path)
            self.scaler = joblib.load(scaler_path)
            
            # Get LOOK_BACK from the model's input shape
            self.look_back = self.model.input_shape[1] 
            
            self.breach_threshold = breach_threshold
            print(f"Model loaded. Expecting {self.look_back} time steps.")
        except Exception as e:
            print(f"CRITICAL ERROR: Could not load model or scaler. {e}")
            self.model = None
            self.scaler = None

    def predict_breach(self, data_history: List[float]) -> tuple[bool, float]:
        """
        Predicts if a breach will occur using the loaded LSTM.
        
        Args:
            data_history: A list of the most recent PM2.5 readings.
            
        Returns:
            A tuple (bool: breach_predicted, float: predicted_value)
        """
        if not self.model or not self.scaler:
            return (False, 0.0)

        if len(data_history) < self.look_back:
            # Not enough data to make a prediction
            print(f"Warning: Not enough data. Need {self.look_back}, got {len(data_history)}")
            return (False, 0.0)
            
        try:
            # 1. Get the last 'look_back' points
            recent_data = np.array(data_history[-self.look_back:]).reshape(-1, 1)
            
            # 2. Scale the data using the *saved* scaler
            scaled_data = self.scaler.transform(recent_data)
            
            # 3. Reshape for LSTM input: [1, time_steps, features]
            # (1 sample, 'look_back' timesteps, 1 feature)
            input_data = scaled_data.reshape((1, self.look_back, 1))
            
            # 4. Make prediction
            predicted_scaled = self.model.predict(input_data)
            
            # 5. Inverse transform the prediction
            # This converts the 0-1 value back to a real PM2.5 value
            predicted_value = self.scaler.inverse_transform(predicted_scaled)[0][0]
            
            # 6. Check for breach
            breach = predicted_value > self.breach_threshold
            
            return (breach, round(float(predicted_value), 2))
                
        except Exception as e:
            print(f"Error during LSTM prediction: {e}")
            return (False, 0.0)