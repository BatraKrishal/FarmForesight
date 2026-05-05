from .region import get_region_features

crop_water_needs = {
    "rice": "high",
    "banana": "high",
    "coconut": "high",
    "maize": "medium",
    "muskmelon": "medium",
    "watermelon": "medium",
    "orange": "medium",
    "papaya": "medium",
    "mango": "medium",
    "grapes": "medium",
    "chickpea": "low",
    "kidneybeans": "low",
    "pigeonpeas": "low",
    "mothbeans": "low",
    "mungbean": "low",
    "blackgram": "low",
    "lentil": "low",
    "cotton": "low",
    "jute": "low",
    "coffee": "low"
}

crop_guidelines = {
    "muskmelon": {
        "stage": "Vegetative/Fruiting",
        "water_mm_per_week": "20–30 mm",
        "notes": "Avoid overwatering during fruiting stage"
    },
    "rice": {
        "stage": "Standing water",
        "water_mm_per_week": "50–70 mm",
        "notes": "Maintain flooded conditions"
    }
}

def recommend_irrigation(crop, rainfall_30d, humidity, city):
    need = crop_water_needs.get(crop, "medium")
    region = get_region_features(city)

    if need == "high":
        if rainfall_30d < 50:
            base = {
                "method": "Flood or drip irrigation",
                "frequency": "Frequent (every 2-3 days)",
                "priority": "High"
            }
        else:
            base = {
                "method": "Maintain water levels",
                "frequency": "Regular monitoring",
                "priority": "Medium"
            }
    elif need == "medium":
        if rainfall_30d < 30:
            base = {
                "method": "Sprinkler or drip irrigation",
                "frequency": "Every 3-5 days",
                "priority": "Medium"
            }
        elif rainfall_30d < 80:
            base = {
                "method": "Supplementary irrigation",
                "frequency": "Weekly",
                "priority": "Low"
            }
        else:
            base = {
                "method": "Minimal irrigation",
                "frequency": "Rare",
                "priority": "Low"
            }
    else:
        if rainfall_30d < 20:
            base = {
                "method": "Light drip irrigation",
                "frequency": "Occasional",
                "priority": "Low"
            }
        else:
            base = {
                "method": "No irrigation",
                "frequency": "Not required",
                "priority": "Low"
            }

    # Region adjustment
    if region["water_level"] == "very_low":
        base["note"] = "Strict water conservation advised"
    elif region["water_level"] == "high":
        base["note"] = "Irrigation demand may reduce"

    return base

def enrich_irrigation(irrigation, crop, humidity):
    guide = crop_guidelines.get(crop, {})

    irrigation["crop_stage"] = guide.get("stage", "General growth")
    irrigation["water_requirement"] = guide.get("water_mm_per_week", "N/A")

    # humidity-based risk
    if humidity > 80:
        irrigation["warning"] = "High humidity → risk of fungal diseases. Avoid over-irrigation."

    return irrigation
