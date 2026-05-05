import pandas as pd
from .model import get_model
from .utils.weather import get_weather_smart
from .utils.region import get_region_features
from .utils.irrigation import recommend_irrigation, enrich_irrigation
from .utils.sustainability import get_sustainability

def confidence_label(score):
    if score > 80:
        return "High"
    elif score > 50:
        return "Moderate"
    else:
        return "Low"

def filter_crops_by_region(top_crops, city):
    region = get_region_features(city)
    filtered = []

    for item in top_crops:
        crop = item["crop"]
        # Example rule
        if region["climate"] == "arid" and crop in ["rice", "jute"]:
            continue
        filtered.append(item)

    return filtered

def generate_reason(crop, rainfall, humidity, temp, n, p, k):
    return (
        f"{crop.capitalize()} suits the current conditions: "
        f"temperature ~{round(temp,1)}°C, humidity {humidity}%, "
        f"and recent rainfall {round(rainfall,1)} mm. "
        f"Soil nutrients (N:{n}, P:{p}, K:{k}) support its growth."
    )

def full_recommendation(n, p, k, ph, city):
    temp, humidity, rainfall = get_weather_smart(city)

    if temp is None or humidity is None or rainfall is None:
        raise ValueError("Weather data could not be fetched for the specified city.")

    input_df = pd.DataFrame([{
        "n": n,
        "p": p,
        "k": k,
        "temperature": temp,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall
    }])

    model = get_model()
    if model is None:
        raise ValueError("Machine learning model could not be loaded.")

    probs = model.predict_proba(input_df)[0]
    classes = model.classes_
    top_indices = probs.argsort()[-3:][::-1]
    top_crops = [
        {
            "crop": str(classes[i]),
            "confidence": float(round(probs[i] * 100, 2)),
            "confidence_level": confidence_label(probs[i] * 100)
        }
        for i in top_indices
    ]
    
    top_crops = filter_crops_by_region(top_crops, city)
    top_crops = [c for c in top_crops if c["confidence"] >= 40]

    if not top_crops:
        raise ValueError("No suitable crops found with high enough confidence.")

    crop = top_crops[0]["crop"]

    irrigation = recommend_irrigation(crop, rainfall, humidity, city)
    irrigation = enrich_irrigation(irrigation, crop, humidity)

    sustainability = get_sustainability(crop)

    return {
        "recommended_crop": crop,
        "top_crops": top_crops,
        "temperature": float(temp),
        "humidity": float(humidity),
        "rainfall_last_30_days": float(rainfall),
        "irrigation": irrigation,
        "sustainability": sustainability,
        "reason": generate_reason(crop, rainfall, humidity, temp, n, p, k)
    }
