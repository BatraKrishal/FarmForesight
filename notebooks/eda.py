#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd

df = pd.read_csv("../data/Crop_recommendation_messy.csv")

df.head()


# In[2]:


df.shape
df.columns
df.info()
df.describe()
df.isnull().sum()


# In[3]:


df.columns = df.columns.str.strip().str.lower()
df = df.dropna().drop_duplicates()


# In[4]:


import seaborn as sns
import matplotlib.pyplot as plt

sns.countplot(y=df['label'])
plt.show()


# In[5]:


df['label'] = df['label'].str.strip().str.lower()


# In[6]:


sns.countplot(y=df['label'])
plt.show()


# In[7]:


df.to_csv("../data/crop_cleaned.csv", index=False)


# In[8]:


import pandas as pd

df = pd.read_csv("../data/crop_cleaned.csv")


# In[9]:


X = df.drop("label", axis=1)
y = df["label"]


# In[10]:


from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

y_pred = model.predict(X_test)

accuracy = accuracy_score(y_test, y_pred)
print("Accuracy:", accuracy)


# In[14]:


import pandas as pd

feature_importance = pd.Series(model.feature_importances_, index=X.columns)
feature_importance.sort_values(ascending=False)


# In[13]:


import joblib

joblib.dump(model, "../models/crop_model.pkl")


# In[15]:


train_acc = model.score(X_train, y_train)
test_acc = model.score(X_test, y_test)

print("Train Accuracy:", train_acc)
print("Test Accuracy:", test_acc)


# In[16]:


from sklearn.model_selection import cross_val_score

scores = cross_val_score(model, X, y, cv=5)
print("CV Accuracy:", scores.mean())


# In[23]:


import requests
import time

def get_coordinates(city):
    url = "https://nominatim.openstreetmap.org/search"

    params = {
        "q": city,
        "format": "json",
        "limit": 1
    }

    headers = {
        "User-Agent": "AiForesightApp/1.0 (krishalbatra18@gmail.com)",
        "Accept-Language": "en"
    }

    response = requests.get(url, params=params, headers=headers)

    # Rate limit safety (IMPORTANT)
    time.sleep(1)

    if response.status_code != 200:
        print("Error:", response.status_code)
        print(response.text)
        return None, None

    data = response.json()

    if not data:
        print("No results found")
        return None, None

    lat = data[0]['lat']
    lon = data[0]['lon']

    return lat, lon


# In[50]:


import requests
from datetime import datetime, timedelta

def get_historical_weather(lat, lon):
    end_date = datetime.today() - timedelta(days=2)
    start_date = end_date - timedelta(days=30)

    url = (
        f"https://archive-api.open-meteo.com/v1/archive?"
        f"latitude={lat}&longitude={lon}"
        f"&start_date={start_date.date()}"
        f"&end_date={end_date.date()}"
        f"&daily=temperature_2m_mean,precipitation_sum"
        f"&timezone=auto"
    )

    response = requests.get(url)
    data = response.json()

    temps = data['daily']['temperature_2m_mean']
    rain = data['daily']['precipitation_sum']

    avg_temp = sum(temps) / len(temps)
    total_rainfall = sum(rain)

    return avg_temp, total_rainfall


# In[37]:


def get_weather_smart(city):
    lat, lon = get_coordinates(city)

    # current humidity
    current = requests.get(
        f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=relativehumidity_2m"
    ).json()

    humidity = current['hourly']['relativehumidity_2m'][0]

    # historical averages
    temp, rainfall = get_historical_weather(lat, lon)

    return temp, humidity, rainfall


# In[38]:


temp, humidity, rainfall = get_weather_smart("Delhi")

print(temp, humidity, rainfall)


# In[41]:


import pandas as pd

def predict_with_weather(n, p, k, ph, city):
    temp, humidity, rainfall = get_weather_smart(city)

    if temp is None:
        return "Weather fetch failed"

    input_df = pd.DataFrame([{
        "n": n,
        "p": p,
        "k": k,
        "temperature": temp,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall
    }])

    crop = model.predict(input_df)[0]

    return {
        "crop": crop,
        "temperature": temp,
        "humidity": humidity,
        "rainfall_last_30_days": rainfall
    }


# In[43]:


result = predict_with_weather(90, 40, 40, 6.5, "Delhi")
print(result)


# In[44]:


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


# In[52]:


import pandas as pd

region_df = pd.read_csv("../data/region_lookup.csv")


# In[53]:


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


# In[58]:


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


# In[75]:


def generate_reason(crop, rainfall, humidity, temp, n, p, k):
    return (
        f"{crop.capitalize()} suits the current conditions: "
        f"temperature ~{round(temp,1)}°C, humidity {humidity}%, "
        f"and recent rainfall {round(rainfall,1)} mm. "
        f"Soil nutrients (N:{n}, P:{p}, K:{k}) support its growth."
    )


# In[61]:


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


# In[62]:


def enrich_irrigation(irrigation, crop, humidity):
    guide = crop_guidelines.get(crop, {})

    irrigation["crop_stage"] = guide.get("stage", "General growth")
    irrigation["water_requirement"] = guide.get("water_mm_per_week", "N/A")

    # humidity-based risk
    if humidity > 80:
        irrigation["warning"] = "High humidity → risk of fungal diseases. Avoid over-irrigation."

    return irrigation


# In[71]:


def confidence_label(score):
    if score > 80:
        return "High"
    elif score > 50:
        return "Moderate"
    else:
        return "Low"


# In[73]:


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


# In[90]:


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


# In[93]:


def get_sustainability(crop):
    return sustainability_data.get(
        crop,
        ["Use organic farming practices", "Optimize water usage", "Maintain soil health"]
    )


# In[94]:


def full_recommendation(n, p, k, ph, city):
    temp, humidity, rainfall = get_weather_smart(city)

    input_df = pd.DataFrame([{
        "n": n,
        "p": p,
        "k": k,
        "temperature": temp,
        "humidity": humidity,
        "ph": ph,
        "rainfall": rainfall
    }])

    probs = model.predict_proba(input_df)[0]
    classes = model.classes_
    top_indices = probs.argsort()[-3:][::-1]
    top_crops = [
    {
        "crop": classes[i],
        "confidence": float(round(probs[i] * 100, 2)),
        "confidence_level": confidence_label(probs[i] * 100)
    }
    for i in top_indices
]
    top_crops = filter_crops_by_region(top_crops, city)
    top_crops = [c for c in top_crops if c["confidence"] >= 40]

    crop = top_crops[0]["crop"]

    irrigation = recommend_irrigation(crop, rainfall, humidity, city)
    irrigation = enrich_irrigation(irrigation, crop, humidity)

    sustainability = get_sustainability(crop)

    return {
    "recommended_crop": crop,
    "top_crops": top_crops,
    "temperature": temp,
    "humidity": humidity,
    "rainfall_last_30_days": rainfall,
    "irrigation": irrigation,
    "sustainability": sustainability,
    "reason": generate_reason(crop, rainfall, humidity, temp, n, p, k)
}


# In[95]:


print(full_recommendation(90, 40, 40, 6.5, "Delhi"))

