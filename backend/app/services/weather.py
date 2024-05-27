import requests
from typing import Tuple, Dict


class OpenWeatherAPI():
    def __init__(self, API_KEY) -> None:
        self.API_KEY = API_KEY
        self.base_url = 'https://api.openweathermap.org/data/2.5/forecast'
        self.geocodeing_url = 'https://api.openweathermap.org/data/2.5/weather'

    def get_weather(
            self,
            location_lat: float,
            location_lon: float
    ) -> Tuple[requests.models.Response, Dict]:

        weather_info = requests.get(self.base_url, params={
            'lat': location_lat,
            'lon': location_lon,
            'units': 'metric',
            'APPID': self.API_KEY,
            'lang': 'en'
        }).json()

        target_data = {}
        temp_max_list = []
        temp_min_list = []

        for data in weather_info['list']:
            temp_max_list.append(data['main']['temp_max'])
            temp_min_list.append(data['main']['temp_min'])

            target_data['temp_max'] = max(temp_max_list)
            target_data['temp_min'] = min(temp_min_list)

            if data.get('dt_txt', '').endswith("12:00:00"):
                if data['weather'][0]['main'] in ['Drizzle', 'Atmosphere', 'Thunderstorm']:
                    target_data['main'] = 'Rain'
                target_data['main'] = data['weather'][0]['main']

        return target_data

    def get_geocoding(self,
                      location_name: str
                      ) -> Tuple[requests.models.Response, Dict]:
        location = requests.get(self.geocodeing_url, params={
            'q': location_name,
            'appid': self.API_KEY
        }).json()

        location = {
            'lat': location['coord']['lat'],
            'lon': location['coord']['lon']
        }
        return location
