import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Dict, Any
import asyncio # For background tasks

# Import our custom modules
from iot_simulator import SensorSimulator
from ai_forecaster import LSTMForecaster

# --- 1. Configuration ---
FORECAST_ALERT_THRESHOLD = 150.0  # "Warning" level
ACTUAL_PENALTY_THRESHOLD = 200.0  # "Lenient" penalty level
MONITORING_INTERVAL_SECONDS = 3   # How often to check (in seconds)
SLASH_AMOUNT = 10.0               # Amount to slash per breach

# --- 2. App & Middleware Setup ---
app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. In-Memory "Database" & Simulators ---
simulators = {
    "factory-001": SensorSimulator(base_level=80, spike_chance=0.05, max_level=220),
    "factory-002": SensorSimulator(base_level=60, spike_chance=0.02, max_level=220),
}

# Load the AI model, passing in our "Warning" threshold
forecaster = LSTMForecaster(
    model_path="lstm_model.keras", 
    scaler_path="scaler.joblib",
    breach_threshold=FORECAST_ALERT_THRESHOLD 
)

# Our "Fake Blockchain" database
db: Dict[str, Any] = {
    "factories": {
        "factory-001": {
            "name": "Bhilai Steel Plant", 
            "stake": 100.0,
            "status": "NORMAL" # Can be NORMAL, ALERT, or PENALTY
        },
        "factory-002": {
            "name": "Durg Cement Works", 
            "stake": 75.0,
            "status": "NORMAL"
        },
    },
    "admin_fund": 0.0, # Renamed from community_fund
    "sensor_history": {
        "factory-001": [], # Stores last N readings
        "factory-002": [],
    },
    "max_history_length": 50 # Store the last 50 readings per factory
}

# --- 4. Background Monitoring Task ---
async def autonomous_monitor():
    """
    This function runs in the background for the entire
    lifetime of the server.
    """
    while True:
        print("Running autonomous monitoring cycle...")
        for factory_id in simulators:
            
            # 1. Get new simulated data
            new_reading = simulators[factory_id].get_next_reading()
            current_pm2_5 = new_reading["pm2_5"]
            
            # 2. Add to history
            history = db["sensor_history"][factory_id]
            history.append(new_reading)
            if len(history) > db["max_history_length"]:
                db["sensor_history"][factory_id] = history[-db["max_history_length"]:]

            # 3. --- Check Tiers (Penalty > Alert) ---
            
            # TIER 2: PENALTY CHECK (Actual Breach)
            if current_pm2_5 > ACTUAL_PENALTY_THRESHOLD:
                print(f"!!! PENALTY: {factory_id} is breaching NOW ({current_pm2_5})")
                db["factories"][factory_id]["status"] = "PENALTY"
                
                # Perform the "Slash"
                current_stake = db["factories"][factory_id]["stake"]
                actual_slash = min(current_stake, SLASH_AMOUNT)
                db["factories"][factory_id]["stake"] -= actual_slash
                db["admin_fund"] += actual_slash
            
            # TIER 1: FORECAST CHECK (Predicted Breach)
            else:
                pm2_5_history = [r["pm2_5"] for r in history]
                if len(pm2_5_history) < forecaster.look_back:
                    db["factories"][factory_id]["status"] = "NORMAL"
                else:
                    breach_predicted, predicted_val = forecaster.predict_breach(pm2_5_history)
                    
                    if breach_predicted:
                        print(f"!!! ALERT: {factory_id} predicted to breach ({predicted_val})")
                        db["factories"][factory_id]["status"] = "ALERT"
                    else:
                        db["factories"][factory_id]["status"] = "NORMAL"
                        
        # Wait before the next cycle
        await asyncio.sleep(MONITORING_INTERVAL_SECONDS)

@app.on_event("startup")
async def startup_event():
    """
    On server startup, create the background task.
    """
    asyncio.create_task(autonomous_monitor())

# --- 5. API Endpoints ---

@app.get("/api/dashboard-data")
async def get_dashboard_data():
    """
    Provides all data needed to populate the dashboard.
    The frontend will poll this single endpoint.
    """
    return db

# --- 6. Run the Server ---
if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)

# To run this app:
# 1. Install dependencies: pip install -r requirements.txt
# 2. Run server: uvicorn main:app --reload --port 8000