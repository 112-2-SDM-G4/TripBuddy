import os
from flask_restful import Resource
from flask import request, make_response
from typing import Dict
from app.services.google import GoogleMapApi

GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

class PlaceSearch(Resource):
    # @jwt_required()
    def get(self) -> Dict:
        search_text = request.args.get('search') # TODO: can be edited
        google_maps = GoogleMapApi(GOOGLE_MAPS_API_KEY)
        search_res, search_places = google_maps.get_search_info(search_text)
        responses = make_response({
            'result': search_places
        }, search_res.status_code
        )
        responses.headers["Content-Type"] = "application/json"
        return responses


class PlaceDetail(Resource):
    # @jwt_required()
    def get(self) -> Dict:
        place_id = request.args.get('place_id') # TODO: can be edited
        google_maps = GoogleMapApi(GOOGLE_MAPS_API_KEY)
        detail_res, place_detail = google_maps.get_place_detail(place_id)
        responses = make_response({
            'result': place_detail
        }, detail_res.status_code
        )
        responses.headers["Content-Type"] = "application/json"
        return responses