import pandas as pd
import os

REGION_CSV_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "data", "region_lookup.csv")

try:
    region_df = pd.read_csv(REGION_CSV_PATH)
except Exception as e:
    print(f"Error loading region lookup: {e}")
    region_df = pd.DataFrame(columns=['district', 'water_level', 'climate'])

def get_region_features(city):
    city = city.lower()
    row = region_df[region_df['district'] == city]

    if row.empty:
        return {
            "water_level": "medium",
            "climate": "moderate"
        }

    return {
        "water_level": row.iloc[0]['water_level'],
        "climate": row.iloc[0]['climate']
    }
