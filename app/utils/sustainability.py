sustainability_data = {
    "muskmelon": [
        "Use drip irrigation to reduce water wastage",
        "Apply organic compost to improve soil health",
        "Practice mulching to retain soil moisture",
        "Avoid over-irrigation to prevent fungal diseases"
    ],
    "rice": [
        "Use alternate wetting and drying (AWD) method",
        "Reduce water flooding to save water",
        "Use organic fertilizers instead of chemical-heavy inputs"
    ],
    "cotton": [
        "Use drip irrigation for water efficiency",
        "Adopt integrated pest management (IPM)",
        "Practice crop rotation to maintain soil fertility"
    ],
    "papaya": [
        "Use organic manure for better fruit quality",
        "Ensure proper drainage to avoid root rot",
        "Adopt mulching techniques"
    ]
}

def get_sustainability(crop):
    return sustainability_data.get(
        crop,
        ["Use organic farming practices", "Optimize water usage", "Maintain soil health"]
    )
