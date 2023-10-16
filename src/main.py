import os
import requests
import sys
import pandas as pd
from datetime import timedelta
from delorean import Delorean, epoch
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

app = Flask(__name__)
cors = CORS(app)

try:
    API_KEY = os.environ["API_KEY"]
except KeyError:
    print("Missing API_KEY. Exiting.")
    sys.exit()

def forecast(location):
    r = requests.get("https://nominatim.openstreetmap.org/search?q={location}&format=json&limit=1&addressdetails=1".format(location=location))
    data = r.json()

    if not data:
        location = "Austin, TX"
        r = requests.get("https://nominatim.openstreetmap.org/search?q={location}&format=json&limit=1&addressdetails=1".format(location=location))
        data = r.json()
        location_not_found = True
    else:
        location_not_found = False

    lat = data[0].get("lat", None)
    lon = data[0].get("lon", None)
    village = data[0]["address"].get("village", None)
    town = data[0]["address"].get("town", None)
    city = data[0]["address"].get("city", None)
    postcode = data[0]["address"].get("postcode", None)
    county = data[0]["address"].get("county", None)
    state = data[0]["address"].get("state", None)
    country = data[0]["address"].get("country", None)

    r = requests.get("https://api.pirateweather.net/forecast/{API_KEY}/{LAT},{LON}?exclude=minutely,alerts&units=us&extend=hourly".format(API_KEY=API_KEY, LAT=lat, LON=lon))
    forecast = r.json()

    timezone = forecast["timezone"]

    current_datetime = Delorean().shift(timezone)
    current_day = Delorean().shift(timezone).truncate("day")
    current_hour = Delorean().shift(timezone).truncate("hour")

    # forecast_past = darksky.get_time_machine_forecast(
    #     lat,
    #     lon,
    #     extend=True,
    #     lang=languages.ENGLISH,
    #     values_units=units.US,
    #     exclude=[weather.MINUTELY, weather.ALERTS],
    #     time=current_day.datetime,
    # )

    current_time = current_datetime.epoch * 1000
    current_temperature = round(forecast["currently"]["temperature"])
    current_apparent_temperature = round(forecast["currently"]["apparentTemperature"])
    current_humidity = round(forecast["currently"]["humidity"] * 100)
    current_wind_speed = round(forecast["currently"]["windSpeed"])

    forecast_hours = [((current_hour + timedelta(hours=i)).epoch) * 1000 for i in range(169)]
    forecast_hours_past = [((current_day + timedelta(hours=i)).epoch) * 1000 for i in range(23)]
    forecast_days = [((current_day + timedelta(days=i)).epoch) * 1000 for i in range(7)]
    forecast_days_text = [(current_day + timedelta(days=i)).date.strftime("%a %b %-d") for i in range(7)]
    forecast_morning = [((current_day + timedelta(hours=6, days=i)).epoch) * 1000 for i in range(7)]

    daily_forecast_icons = [forecast["daily"]["data"][i]["icon"] for i in range(7)]
    daily_temperature_high = [round(forecast["daily"]["data"][i]["temperatureHigh"]) for i in range(7)]
    daily_temperature_high_time = [forecast["daily"]["data"][i]["temperatureHighTime"] * 1000 for i in range(7)]
    daily_temperature_low = [round(forecast["daily"]["data"][i]["temperatureLow"]) for i in range(7)]
    daily_temperature_low_time = [forecast["daily"]["data"][i]["temperatureLowTime"] * 1000 for i in range(7)]
    daily_precip_intensity = [round(forecast["daily"]["data"][i]["precipIntensity"] * 24, 1) for i in range(7)]

    # hourly_temperature_past = [round(forecast_past.hourly["data"][i].temperature) for i in range(23)]
    # hourly_humidity_past = [round(forecast_past.hourly["data"][i].humidity * 100) for i in range(23)]
    # hourly_cloud_cover_past = [round(forecast_past.hourly["data"][i].cloud_cover * 100) for i in range(23)]
    # hourly_precip_probability_past = [round(forecast_past.hourly["data"][i].precip_probability * 100) for i in range(23)]
    # hourly_wind_speed_past = [round(forecast_past.hourly["data"][i].wind_speed) for i in range(23)]

    hourly_temperature = [round(forecast["hourly"]["data"][i]["temperature"]) for i in range(169)]
    hourly_humidity = [round(forecast["hourly"]["data"][i]["humidity"] * 100) for i in range(169)]
    hourly_cloud_cover = [round(forecast["hourly"]["data"][i]["cloudCover"] * 100) for i in range(169)]
    hourly_precip_probability = [round(forecast["hourly"]["data"][i]["precipProbability"] * 100) for i in range(169)]
    hourly_wind_speed = [round(forecast["hourly"]["data"][i]["windSpeed"]) for i in range(169)]

    zipped_temperature_high = ([list(a) for a in zip(daily_temperature_high_time, daily_temperature_high)])
    zipped_temperature_low = ([list(a) for a in zip(daily_temperature_low_time, daily_temperature_low)])

    # df_past = pd.DataFrame({
    #     "hourly_temperature": hourly_temperature_past,
    #     "hourly_humidity": hourly_humidity_past,
    #     "hourly_cloud_cover": hourly_cloud_cover_past,
    #     "hourly_precip_probability": hourly_precip_probability_past,
    #     "hourly_wind_speed": hourly_wind_speed_past,
    #     },
    #     index=forecast_hours_past,
    # )

    df = pd.DataFrame({
        "hourly_temperature": hourly_temperature,
        "hourly_humidity": hourly_humidity,
        "hourly_cloud_cover": hourly_cloud_cover,
        "hourly_precip_probability": hourly_precip_probability,
        "hourly_wind_speed": hourly_wind_speed,
        },
        index=forecast_hours,
    )

    # df = df_past.combine_first(df_future)

    zipped_temperature = df.reset_index()[["index", "hourly_temperature"]].values.tolist()
    zipped_humidity = df.reset_index()[["index", "hourly_humidity"]].values.tolist()
    zipped_cloud_cover = df.reset_index()[["index", "hourly_cloud_cover"]].values.tolist()
    zipped_precip_probability = df.reset_index()[["index", "hourly_precip_probability"]].values.tolist()
    zipped_wind_speed = df.reset_index()[["index", "hourly_wind_speed"]].values.tolist()

    resp = {
        "location_not_found": location_not_found,
        "village": village,
        "town": town,
        "city": city,
        "postcode": postcode,
        "county": county,
        "state": state,
        "country": country,
        "current_time": current_time,
        "current_temperature": current_temperature,
        "current_apparent_temperature": current_apparent_temperature,
        "current_humidity": current_humidity,
        "current_wind_speed": current_wind_speed,
        "forecast_days_text": forecast_days_text,
        "forecast_days": forecast_days,
        "forecast_morning": forecast_morning,
        "daily_forecast_icons": daily_forecast_icons,
        "daily_temperature_high": daily_temperature_high,
        "daily_temperature_high_time": daily_temperature_high_time,
        "daily_temperature_low": daily_temperature_low,
        "daily_temperature_low_time": daily_temperature_low_time,
        "daily_precip_intensity": daily_precip_intensity,
        "zipped_temperature_high": zipped_temperature_high,
        "zipped_temperature_low": zipped_temperature_low,
        "zipped_temperature": zipped_temperature,
        "zipped_humidity": zipped_humidity,
        "zipped_cloud_cover": zipped_cloud_cover,
        "zipped_precip_probability": zipped_precip_probability,
        "zipped_wind_speed": zipped_wind_speed,
        "timezone": timezone,
    }

    return resp

@app.route("/", methods=["GET", "POST"])
def apply():
    request_json = request.get_json(silent=True)
    location = request_json.get("location", "Austin, TX")
    result = forecast(location)
    return (result, 200)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)), debug=True)
