import pandas as pd
import sys
from app.model import get_model

def run_predictions():
    try:
        print("Loading test data from data/test.csv...")
        df = pd.read_csv('data/test.csv')
    except Exception as e:
        print(f"Error loading test.csv: {e}")
        sys.exit(1)
        
    # The model expects lowercase feature names based on predictor.py
    expected_cols = ['n', 'p', 'k', 'temperature', 'humidity', 'ph', 'rainfall']
    
    original_df = df.copy()
    
    # Rename columns to lowercase to match the model's expected feature names
    df.columns = [col.lower() for col in df.columns]
    
    try:
        df = df[expected_cols]
    except KeyError as e:
        print(f"Missing expected columns in test.csv: {e}")
        sys.exit(1)
        
    print("Loading model...")
    model = get_model()
    if model is None:
        print("Failed to load the model.")
        sys.exit(1)
        
    print("Making predictions...")
    try:
        predictions = model.predict(df)
    except Exception as e:
        print(f"Error during prediction: {e}")
        sys.exit(1)
    
    # Add prediction column
    original_df['prediction'] = predictions
    
    output_file = 'prediction.csv'
    print(f"Saving predictions to {output_file}...")
    try:
        original_df.to_csv(output_file, index=False)
        print(f"Done! Predictions saved to {output_file}.")
    except Exception as e:
        print(f"Error saving file: {e}")
        sys.exit(1)

if __name__ == '__main__':
    run_predictions()
