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

def enrich_irrigation(irrigation, crop, humidity, rainfall_30d):
    guide = crop_guidelines.get(crop, {})

    irrigation["crop_stage"] = guide.get("stage", "General growth")
    irrigation["water_requirement"] = guide.get("water_mm_per_week", "N/A")

    # humidity-based risk
    if humidity > 80:
        irrigation["warning"] = "High humidity → risk of fungal diseases. Avoid over-irrigation."
        
    # Calculate water saved
    recommended_method = irrigation.get("method", "Flood")
    water_metrics = calculate_water_savings(crop, rainfall_30d, recommended_method)
    irrigation["water_saved_liters_per_hectare"] = water_metrics["saved_liters_per_hectare"]
    irrigation["water_baseline_liters_per_hectare"] = water_metrics["baseline_liters_per_hectare"]
    irrigation["water_optimized_liters_per_hectare"] = water_metrics["optimized_liters_per_hectare"]

    return irrigation

def calculate_water_savings(crop, rainfall_30d, recommended_method):
    # 1. Get standard weekly need (defaulting to 40mm for medium crops)
    guide = crop_guidelines.get(crop, {})
    standard_need_str = guide.get("water_mm_per_week", "40")
    # Parse the string (e.g., "50-70 mm" -> 60)
    import re
    numbers = [int(s) for s in re.findall(r'\d+', standard_need_str)]
    avg_standard_need = sum(numbers) / len(numbers) if numbers else 40
    
    # 2. Baseline: Assuming 50% flood efficiency and ignoring rainfall
    baseline_water_mm = avg_standard_need / 0.50
    
    # 3. Optimized: Subtract rainfall (convert 30d to weekly)
    weekly_rainfall = rainfall_30d / 4
    net_need = max(0, avg_standard_need - weekly_rainfall)
    
    # Determine efficiency based on your recommendation
    efficiency = 0.90 if "drip" in recommended_method.lower() else 0.75 if "sprinkler" in recommended_method.lower() else 0.50
    optimized_water_mm = net_need / efficiency
    
    # 4. Calculate savings
    water_saved_mm = max(0, baseline_water_mm - optimized_water_mm)
    
    return {
        "baseline_liters_per_hectare": round(baseline_water_mm * 10000),
        "optimized_liters_per_hectare": round(optimized_water_mm * 10000),
        "saved_liters_per_hectare": round(water_saved_mm * 10000)
    }

