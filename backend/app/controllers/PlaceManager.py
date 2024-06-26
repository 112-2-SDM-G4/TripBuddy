import os
import random
from flask_restful import Resource
from flask import request, make_response
from typing import Dict
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.utils import *
from app import socketio
from app.services.googlemap import GoogleMapApi
from app.controllers.SocketTripManager import emit_trip_update
from app.models.schedule import Schedule
from app.models.place import Place
from app.models.relation_spot_sch import RelationSpotSch

GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

class PlaceSearch(Resource):
    # @jwt_required()
    def get(self) -> Dict:
        search_text = request.args.get('search')
        if str(search_text).strip(' ') == '':
            default_places = Place.query[1:16]
            search_places = []
            for p in default_places:
                place = query_row_to_dict(p)
                place_json = {
                    'place_id': place['place_id'],
                    'name': place['name'],
                    'address': place['formatted_address'],
                    'rating': place['rating'],
                    'user_rating_count': place['user_rating_count'],
                    'google_map_uri': place['google_map_uri'],
                    'image': place['image'],
                }
                search_places.append(place_json)
            return make_response({'result': search_places, 'language': None, 'location_lat': None, 'location_lng': None,}, 200)

        language = request.args.get('language')
        location_lat = request.args.get('location_lat')
        location_lng = request.args.get('location_lng')
        location_lat = float(location_lat) if location_lat else None
        location_lng = float(location_lng) if location_lng else None

        google_maps = GoogleMapApi(GOOGLE_MAPS_API_KEY)
        search_res, search_places = google_maps.get_search_info(search_text, language, location_lat, location_lng)
        responses = make_response({
            'result': search_places,
            'language': language,
            'location_lat': location_lat,
            'location_lng': location_lng,
        }, search_res.status_code
        )
        responses.headers["Content-Type"] = "application/json"
        return responses


class PlaceDetail(Resource):
    # @jwt_required()
    def get(self) -> Dict:
        place_id = request.args.get('place_id')
        language = request.args.get('language')
        print(place_id, language)
        # check database, fetch it from google if not exists
        res_code, place_detail = fetch_and_save_place(place_id, language)

        responses = make_response({
            'result': place_detail,
            'language': language,
        }, res_code
        )
        return responses
    
class PlaceInTrip(Resource):
    @jwt_required()
    def post(self, trip_id: str):
        '''Insert place into trip, move the corresponding places'''
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        if not Schedule.get_by_id(trip_id):
                return make_response({'message': 'Trip not found.'}, 400)
            
        if not user_owns_schedule(user_id, trip_id):
            return make_response({'message': 'User does not have access to this trip.'}, 403)

        place_info = request.get_json()
        res_code, place_detail = fetch_and_save_place(place_info['place_id'], 'zh')

        # move the corresponding places than the inserted place
        # if order = 0 then insert at the end
        if place_info['order'] == 0:
            place_info['order'] = RelationSpotSch.get_max_order(trip_id, place_info['date']) + 1

        RelationSpotSch.update_order(trip_id, place_info['date'], place_info['order'], increase=True)
        place_info['schedule_id'] = trip_id
        place_info['place_id'] = place_info['place_id']
        place_info['category'] = "common"
        place_info['period_hours'] = place_info['stay_time'][0]
        place_info['period_minutes'] = place_info['stay_time'][1]
        relation = RelationSpotSch.create(place_info)
        
        emit_trip_update(trip_id)
        return make_response({'message': 'Place added to trip successfully.',
                              'relation_id': relation.rss_id},
                                200)
                              

    @jwt_required()
    def delete(self, trip_id: str, relation_id: str):
        '''Remove place from trip, move the corresponding places'''
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        if not Schedule.get_by_id(trip_id):
            return make_response({'message': 'Trip not found.'}, 400)
        
        if not user_owns_schedule(user_id, trip_id):
            return make_response({'message': 'User does not have access to this trip.'}, 403)
        
        relation = RelationSpotSch.get_by_relation_id(relation_id)
        if not relation:
            return make_response({'message': 'Relation Id not found.'}, 400)
        
        # move the corresponding places than the removed place
        RelationSpotSch.update_order(trip_id, relation.date, relation.order, increase=False)
        RelationSpotSch.delete_by_relation_id(relation_id)

        return make_response({'message': 'Place removed from trip successfully.'}, 200)

    @jwt_required()
    def patch(self, trip_id: str, relation_id: str):
        '''Update place in trip, move the corresponding places'''
        
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        if not Schedule.get_by_id(trip_id):
            return make_response({'message': 'Trip not found.'}, 400)
        
        if not user_owns_schedule(user_id, trip_id):
            return make_response({'message': 'User does not have access to this trip.'}, 403)
        
        relation = RelationSpotSch.get_by_relation_id(relation_id)
        if not relation:
            return make_response({'message': 'Relation Id not found.'}, 400)
        
        relation_info = request.get_json()
        # check the date and order have been changed
        if 'date' in relation_info or 'order' in relation_info:
            if 'date' not in relation_info:
                relation_info['date'] = relation.date
            if 'order' not in relation_info:
                relation_info['order'] = relation.order
            # move the corresponding places than the updated place
            RelationSpotSch.update_order(trip_id, relation.date, relation.order, increase=False)
            RelationSpotSch.update_order(trip_id, relation_info['date'], relation_info['order'], increase=True)

        if 'stay_time' in relation_info:
            relation_info['period_hours'] = relation_info['stay_time'][0]
            relation_info['period_minutes'] = relation_info['stay_time'][1]
        relation = RelationSpotSch.update(relation_id, relation_info)

        return make_response({'message': 'Place updated successfully.'}, 200)
