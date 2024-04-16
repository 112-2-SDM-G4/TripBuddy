import requests
import json
from typing import List, Tuple, Dict

class GoogleMapApi():
    """
    A Toolkit to utilize Google Maps API for getting formatted data.
    """
    def __init__(self, API_KEY, mode='production') -> None:
        self.api_key = API_KEY
        self.mode = mode
        # For text search(Places)
        self.place_field_mask = [
            'places.id', 
            'places.displayName',
            'places.formattedAddress',
            'places.googleMapsUri',
            'places.photos',
        ]
        self.place_params = {
            "key": self.api_key,
            "languageCode": "zh_TW",
            "rankPreference": "RELEVANCE",
        }
        if self.mode == 'production':
            self.place_params['maxResultCount'] = 15
        else: # dev
            self.place_params['maxResultCount'] = 5

        # For place photos
        self.photo_params = {
            "key": self.api_key,
            "maxHeightPx": 1600,
            "maxWidthPx": 1600,
            "skipHttpRedirect": True,
        }

        # For place details
        self.detail_field_mask = [
            # basic
            'id', 'displayName', 'formattedAddress',
            'location', 'googleMapsUri',
            'businessStatus',
            'photos',
            # advanced
            'regularOpeningHours', 'priceLevel',
            'rating', 'userRatingCount', 'websiteUri',
            # preferred
            'editorialSummary'
        ]
        self.detail_params = {
            "key": self.api_key,
            "languageCode": "zh_TW",
        }


    def get_places(
            self,
            search_text: str,
            language_code: str = "zh_TW",
    ) -> Tuple[requests.models.Response, List[Dict]]:
        """Google Maps Places API - Text Search """
        place_api_url = f"https://places.googleapis.com/v1/places:searchText?fields={('%2C').join(self.place_field_mask)}"
        params = self.place_params.copy()
        params['languageCode'] = language_code
        params['textQuery'] = search_text
        res = requests.post(place_api_url, params=params)
        if res.ok:
            res_json = json.loads(res.text)['places']
        else:
            res_json = {}

        return res, res_json

    def get_photos(
            self,
            photo_name: str,
    ) -> Tuple[requests.models.Response, dict]:
        """Google Maps Places API - Photos"""
        photo_api_url = f"https://places.googleapis.com/v1/{photo_name}/media"
        res = requests.get(photo_api_url, params=self.photo_params)
        if res.ok:
            res_json = json.loads(res.text)
        else:
            res_json = {}

        return res, res_json

    def get_search_info(
        self,
        search_text: str,
        language_code: str = "zh_TW",
    ) -> Tuple[requests.models.Response, List[dict]]:
        """Google Maps Places API - Text Search + Photos"""
        res, places = self.get_places(search_text, language_code)
        place_info_list = list()
        if res.ok:
            for place in places:
                # get available photo_uri
                try:
                    photo_list = place['photos']                
                    success = False
                    for i in range(len(photo_list)):
                        photo_name = photo_list[i]['name']
                        photo_res, photo = self.get_photos(photo_name)
                        if photo_res.ok:
                            success = True
                            photo_url = photo['photoUri']
                            break
                    # If all photo requests failed
                    if not success:
                        photo_url = ""
                except:
                    photo_url = ""

                # return value formatting
                info_json = {
                    'place_id': place['id'],
                    'name': place['displayName']['text'],
                    'address': place['formattedAddress'],
                    'google_maps_uri': place['googleMapsUri'],
                    'image': photo_url,
                }
                place_info_list.append(info_json)

        else: # searching failed
            info_json = {}
            place_info_list.append(info_json)

        return res, place_info_list


    def get_place_detail(
            self,
            place_id: str,
            language_code: str = "zh_TW",
    ) -> Tuple[requests.models.Response, List[dict]]:
        """Google Maps Places API - Place Detail + Photos"""
        detail_api_url = f"https://places.googleapis.com/v1/places/{place_id}?fields={('%2C').join(self.detail_field_mask)}"
        params = self.detail_params.copy()
        params['languageCode'] = language_code
        res = requests.get(detail_api_url, params=params)
        if res.ok:
            place = json.loads(res.text)
            success = False
            try:
                photo_list = place['photos']
                for p in photo_list:
                    p_res, photo = self.get_photos(p['name'])
                    if p_res.ok:
                        success = True
                        photo_url = photo['photoUri']
                        break
                if not success:
                    photo_url = ""
            except:
                photo_url = ""

            # return value formatting
            res_json = {
                'id': place['id'],
                'name': place['displayName']['text'],
                'address': place['formattedAddress'],
                'location': (place['location']['latitude'], place['location']['longitude']),
                'google_maps_uri': place['googleMapsUri'],
                'image': photo_url,
            }
            # exception handling
            res_json['rating'] = place['rating'] if 'rating' in place.keys() else None
            res_json['user_rating_count'] = place['userRatingCount'] if 'userRatingCount' in place.keys() else None
            res_json['opening_hours_d'] = place['regularOpeningHours']['weekdayDescriptions'] if 'regularOpeningHours' in place.keys() else None
            res_json['opening_hours_p'] = place['regularOpeningHours']['periods'] if 'regularOpeningHours' in place.keys() else None
            res_json['summary'] = place['editorialSummary']['text'] if 'editorialSummary' in place.keys() else None

        else: # searching failed
            res_json = {}

        return res, res_json
