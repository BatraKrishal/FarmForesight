import requests
import time
from datetime import datetime, timedelta

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

    try:
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
    except Exception as e:
        print(f"Exception getting coordinates: {e}")
        return None, None

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

    try:
        response = requests.get(url)
        data = response.json()
        temps = data['daily']['temperature_2m_mean']
        rain = data['daily']['precipitation_sum']

        avg_temp = sum(temps) / len(temps)
        total_rainfall = sum(rain)
        return avg_temp, total_rainfall
    except Exception as e:
        print(f"Exception getting historical weather: {e}")
        return None, None

def get_weather_smart(city):
    lat, lon = get_coordinates(city)
    if lat is None or lon is None:
        return None, None, None

    try:
        # current humidity
        current = requests.get(
            f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&hourly=relativehumidity_2m"
        ).json()
        humidity = current['hourly']['relativehumidity_2m'][0]

        # historical averages
        temp, rainfall = get_historical_weather(lat, lon)
        return temp, humidity, rainfall
    except Exception as e:
        print(f"Exception getting weather smart: {e}")
        return None, None, None
