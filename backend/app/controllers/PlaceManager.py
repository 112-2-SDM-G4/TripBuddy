import os
from flask_restful import Resource
from flask import request, make_response
from typing import Dict
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.controllers.utils import *

from app.services.google import GoogleMapApi

from app.models.schedule import Schedule
from app.models.place import Place
from app.models.relation_spot_sch import RelationSpotSch

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
        place = Place.get_by_id(place_info['place_id'])
        if not place:
            if 'regular_opening_hours' in place_info:
                place_info['regular_opening_hours'] = array_to_str(place_info['regular_opening_hours'])
            place = Place.create(place_info) 

        # move the corresponding places than the inserted place
        RelationSpotSch.update_order(trip_id, place_info['date'], place_info['order'], increase=True)
        relation = RelationSpotSch.create({
            'schedule_id': trip_id,
            'place_id': place.place_id,
            'category': 'common',
            'date': place_info['date'],
            'order': place_info['order'],
            'period_hours': place_info['stay_time'][0],
            'period_minutes': place_info['stay_time'][1],
            'comment': place_info['comment'],
            'money': place_info['money']
        })
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
    def put(self, trip_id: str, relation_id: str):
        '''Update place in trip, move the corresponding places'''
        pass
