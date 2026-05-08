from .region import get_region_features

crop_water_needs = {
    "rice": "high",
    "banana": "high",
    "coconut": "high",
    "cotton": "high",
    "maize": "medium",
    "muskmelon": "medium",
    "watermelon": "medium",
    "orange": "medium",
    "papaya": "medium",
    "mango": "medium",
    "grapes": "medium",
    "coffee": "medium",
    "jute": "medium",
    "kidneybeans": "medium",
    "mungbean": "medium",
    "blackgram": "medium",
    "chickpea": "low",
    "pigeonpeas": "low",
    "mothbeans": "low",
    "lentil": "low"
}

crop_guidelines = {
    # ── High water-need crops ──────────────────────────────────────────────────
    "rice": {
        "stage": "Tillering/Heading",
        "water_mm_per_week": "50–70 mm",
        "notes": "Maintain 5–10 cm standing water; reduce near maturity"
    },
    "banana": {
        "stage": "Vegetative/Flowering",
        "water_mm_per_week": "35–50 mm",
        "notes": "Requires consistent moisture; drip irrigation preferred"
    },
    "coconut": {
        "stage": "Year-round",
        "water_mm_per_week": "35–50 mm",
        "notes": "Deep watering 2–3 times/week; mulch to retain moisture"
    },
    # ── Medium water-need crops ────────────────────────────────────────────────
    "maize": {
        "stage": "Vegetative/Tasseling",
        "water_mm_per_week": "30–40 mm",
        "notes": "Critical watering at tasseling and silking stages"
    },
    "muskmelon": {
        "stage": "Vegetative/Fruiting",
        "water_mm_per_week": "25–40 mm",
        "notes": "Avoid overwatering during fruiting stage"
    },
    "watermelon": {
        "stage": "Vegetative/Fruiting",
        "water_mm_per_week": "25–40 mm",
        "notes": "Reduce water 1–2 weeks before harvest for sweetness"
    },
    "orange": {
        "stage": "Flowering/Fruit set",
        "water_mm_per_week": "20–30 mm",
        "notes": "Consistent moisture at fruit set; reduce during ripening"
    },
    "papaya": {
        "stage": "Vegetative/Fruiting",
        "water_mm_per_week": "25–35 mm",
        "notes": "Avoid waterlogging; drip irrigation recommended"
    },
    "mango": {
        "stage": "Fruit development",
        "water_mm_per_week": "20–30 mm",
        "notes": "Withhold water pre-flowering to induce blooming"
    },
    "grapes": {
        "stage": "Berry development",
        "water_mm_per_week": "20–30 mm",
        "notes": "Drip irrigation preferred; reduce water near harvest"
    },
    # ── Low water-need crops ───────────────────────────────────────────────────
    "chickpea": {
        "stage": "Vegetative/Podding",
        "water_mm_per_week": "10–15 mm",
        "notes": "Critical irrigation at flowering and pod filling"
    },
    "kidneybeans": {
        "stage": "Vegetative/Podding",
        "water_mm_per_week": "15–25 mm",
        "notes": "Avoid waterlogging; irrigate at flowering and pod fill"
    },
    "pigeonpeas": {
        "stage": "Flowering/Podding",
        "water_mm_per_week": "8–12 mm",
        "notes": "Drought-tolerant; 1–2 irrigations at critical stages"
    },
    "mothbeans": {
        "stage": "Vegetative",
        "water_mm_per_week": "10–15 mm",
        "notes": "Highly drought-tolerant; minimal irrigation needed"
    },
    "mungbean": {
        "stage": "Vegetative/Podding",
        "water_mm_per_week": "15–22 mm",
        "notes": "Light irrigation at flowering; avoid excess moisture"
    },
    "blackgram": {
        "stage": "Vegetative/Podding",
        "water_mm_per_week": "15–22 mm",
        "notes": "Sensitive to waterlogging; irrigate at flowering stage"
    },
    "lentil": {
        "stage": "Vegetative/Podding",
        "water_mm_per_week": "12–18 mm",
        "notes": "One or two irrigations at flowering and pod fill"
    },
    "cotton": {
        "stage": "Boll development/Square formation",
        "water_mm_per_week": "35–50 mm",
        "notes": "Critical watering at squaring and boll formation stages"
    },
    "jute": {
        "stage": "Vegetative",
        "water_mm_per_week": "15–20 mm",
        "notes": "Requires warm, moist conditions; avoid standing water"
    },
    "coffee": {
        "stage": "Flowering/Berry development",
        "water_mm_per_week": "20–30 mm",
        "notes": "Consistent moisture at berry development; avoid drought stress"
    },
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

