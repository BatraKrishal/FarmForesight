import joblib
import os

# Assuming the server is run from the root directory
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models", "crop_model.pkl")

# Load model once when module is imported
try:
    model = joblib.load(MODEL_PATH)
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

def get_model():
    return model
