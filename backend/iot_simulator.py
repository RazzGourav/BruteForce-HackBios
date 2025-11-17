import random
import numpy as np

class SensorSimulator:
    """
    Generates realistic, stateful sensor data.
    It "remembers" its last value and can simulate drifts and spikes.
    """
    def __init__(self, base_level=80.0, max_level=180.0, spike_chance=0.05):
        self.current_pm2_5 = base_level
        self.base_level = base_level
        self.max_level = max_level
        self.spike_chance = spike_chance
        self.in_spike = False
        self.spike_duration = 0
        self.trend = 1 # 1 for up, -1 for down
    
    def _generate_normal_reading(self):
        """ Simulates normal, gentle drift. """
        noise = random.uniform(-2.5, 2.5)
        self.current_pm2_5 += noise
        
        # Add a gentle sine wave for daily variation
        self.current_pm2_5 += np.sin(random.random() * np.pi) * 1
        
        # Keep it from drifting too far from base
        if self.current_pm2_5 < self.base_level - 20:
            self.current_pm2_5 = self.base_level - 20
        elif self.current_pm2_5 > self.base_level + 20:
            self.current_pm2_5 = self.base_level + 20
        
        self.current_pm2_5 = round(self.current_pm2_5, 2)

    def _generate_spike_reading(self):
        """ Simulates a pollution breach event. """
        self.current_pm2_5 += random.uniform(5, 15) # Increase rapidly
        self.spike_duration -= 1
        if self.spike_duration <= 0 or self.current_pm2_5 > self.max_level:
            self.in_spike = False
            self.current_pm2_5 = self.base_level # Cool down
        
        self.current_pm2_5 = round(min(self.current_pm2_5, self.max_level), 2)

    def get_next_reading(self) -> dict:
        """
        Gets the next simulated data point.
        This is the only function the main API will call.
        """
        if self.in_spike:
            self._generate_spike_reading()
        else:
            self._generate_normal_reading()
            # Check if a new spike should start
            if random.random() < self.spike_chance:
                self.in_spike = True
                self.spike_duration = random.randint(5, 10) # Spike lasts for 5-10 readings
        
        # Also generate other sensor data
        so2 = round(self.current_pm2_5 / 3.0 + random.uniform(-5, 5), 2)
        nox = round(self.current_pm2_5 / 2.0 + random.uniform(-3, 3), 2)

        return {
            "pm2_5": max(0, self.current_pm2_5),
            "so2": max(0, so2),
            "nox": max(0, nox),
            "timestamp": np.datetime_as_string(np.datetime64('now', 's'))
        }