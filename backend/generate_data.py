import pandas as pd
from iot_simulator import SensorSimulator
import time

# Number of data points to generate
N_SAMPLES = 20000 
OUTPUT_FILE = "training_data.csv"

print(f"Generating {N_SAMPLES} data points...")

# Use the same simulator from our main app
simulator = SensorSimulator(base_level=80, spike_chance=0.05)
data = []

start_time = time.time()
for i in range(N_SAMPLES):
    reading = simulator.get_next_reading()
    data.append(reading)
    
    if (i + 1) % 1000 == 0:
        print(f"Generated {i+1}/{N_SAMPLES} samples...")

# Convert to a pandas DataFrame
df = pd.DataFrame(data)

# Save to CSV
df.to_csv(OUTPUT_FILE, index=False)

end_time = time.time()
print(f"Done! Data saved to {OUTPUT_FILE}.")
print(f"Time taken: {end_time - start_time:.2f} seconds.")