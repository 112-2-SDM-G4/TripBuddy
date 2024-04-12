from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request, make_response, jsonify

from app.controllers.utils import date_to_array, array_to_date, check_date_status, str_to_array, array_to_str
from app.models.schedule import Schedule
from app.models.ledger import Ledger
from app.models.post import Post
from app.models.place import Place
from app.models.relation_user_sch import RelationUserSch
from app.models.relation_spot_sch import RelationSpotSch
from app.models.user import User

class TripManager(Resource):
    def varify_user(self, user_email):
        user = User.get_by_email(user_email)
        if not user:
            return None
        return user.user_id
    
    def user_owns_schedule(self, user_id, schedule_id):
        relation = RelationUserSch.get_by_user_schedule(user_id, schedule_id)
        if not relation or not relation.access:
            return False
        return True
    
    def get_trip_length(self, trip):
        return (trip.end_date - trip.start_date).days + 1

    @jwt_required()
    def get(self, trip_id=None):
        if trip_id: # get a specific schedule detail
            user_id = self.varify_user(get_jwt_identity())
            if user_id == None:
                return make_response({'message': 'User not found.'}, 400)
            
            if not Schedule.get_by_id(trip_id):
                return make_response({'message': 'Trip not found.'}, 400)
            
            if not self.user_owns_schedule(user_id, trip_id):
                return make_response({'message': 'User does not have access to this trip.'}, 403)
            
            schedule = Schedule.get_by_id(trip_id)
            places_in_trip = RelationSpotSch.get_by_schedule(trip_id)
            
            trip = [[] for _ in range(self.get_trip_length(schedule))]
            places_in_trip.sort(key=lambda x: (x.date, x.order))
            for relation_spot_sch in places_in_trip:
                place = Place.get_by_id(relation_spot_sch.place_id)
                place_info = {
                    'place_id': place.place_id,
                    'name': place.name,
                    'formatted_address': place.formatted_address,
                    "google_maps_uri": place.google_map_uri,
                    "image": place.image,
                    "rating": place.rating,
                    "user_rating_count": place.user_rating_count,
                    "regular_opening_hours": str_to_array(place.regular_opening_hours),
                    "place_summary": place.place_summary,
                    "comment": relation_spot_sch.comment,
                    "money": relation_spot_sch.money,
                    "stay_time": [relation_spot_sch.period_hours, relation_spot_sch.period_minutes],
                }
                trip[relation_spot_sch.date].append(place_info)

            responce = {"trip": trip}
            responce['public'] = schedule.public


        else: # get all schedules accessible by the user
            user_id = self.varify_user(get_jwt_identity())
            if user_id == None:
                return make_response({'message': 'User not found.'}, 400)
            
            trips = []
            relations = RelationUserSch.get_by_user(user_id)
            for relation in relations:
                trip_info = {}
                schedule = Schedule.get_by_id(relation.schedule_id)
                trip_info['trip_id'] = schedule.schedule_id
                trip_info['trip_name'] = schedule.schedule_name
                trip_info['image'] = None
                trip_info['date_status'] = check_date_status(schedule.start_date, schedule.end_date)
                trip_info['start_date'] = date_to_array(schedule.start_date)
                trip_info['end_date'] = date_to_array(schedule.end_date)
                trips.append(trip_info) 

            responce = {
                'user_trip': trips,
            }
        
        return make_response(responce, 200) 
    
    @jwt_required()
    def post(self):
        user_id = self.varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        data = request.get_json()
            

        # create new ledger for the schedule
        ledger_params = {
        }
        ledger = Ledger.create(ledger_params)

        # create new post for the schedule
        post_params = {
            'content': None,
            'like_count': 0,
        }
        post = Post.create(post_params)

        # create new schedule
        schedule_params = {
            'ledger_id': ledger.ledger_id,
            'post_id': post.post_id,
        }
        if 'trip_name' not in data or data['trip_name'] == '':
            return make_response({'message': 'Trip name is required.'}, 400)
        else:
            schedule_params['schedule_name'] = data['trip_name']

        try:
            schedule_params['start_date'] = array_to_date(data['start_date'])
            schedule_params['end_date'] = array_to_date(data['end_date'])
            assert schedule_params['start_date'] <= schedule_params['end_date']
        except:
            return make_response({'message': 'Invalid date.'}, 400)
        
        schedule = Schedule.create(schedule_params)

        
        relation = RelationUserSch.create({
            'user_id': user_id,
            'schedule_id': schedule.schedule_id,
            'access': True,
            'heart': False,
            'rate': None,
        })

        respose = {
            'trip_id': schedule.schedule_id,
            'message': 'Trip created successfully.',
        }
    
        return make_response(respose, 201)
    
    @jwt_required()
    def put(self, trip_id):
        data = request.get_json()
        user_id = self.varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        if not Schedule.get_by_id(trip_id):
            return make_response({'message': 'Trip has not created.'}, 400)
        
        if not self.user_owns_schedule(user_id, trip_id):
            return make_response({'message': 'User does not have access to this trip.'}, 403)
        
        if self.get_trip_length(Schedule.get_by_id(trip_id)) != len(data['trip']):
            return make_response({'message': 'Trip length does not match.'}, 400)

        for day_count, day_list in enumerate(data['trip']):
            for order_count, place_info in enumerate(day_list):
                # if spot is not in Place, create new Place
                place = Place.get_by_id(place_info['place_id'])
                if not place:
                    if 'regular_opening_hours' in place_info:
                        place_info['regular_opening_hours'] = array_to_str(place_info['regular_opening_hours'])
                    place = Place.create(place_info)

                # create new relation if not exist, update if exist
                place_info['schedule_id'] = trip_id
                place_info['place_id'] = place.place_id
                place_info['category'] = 'common'
                place_info['date'] = day_count
                place_info['order'] = order_count
                place_info['stay_time'] = [1,0] if 'stay_time' not in place_info else place_info['stay_time']
                place_info['period_hours'] = place_info['stay_time'][0]
                place_info['period_minutes'] = place_info['stay_time'][1]
                relation = RelationSpotSch.get_by_spot_schedule(trip_id, place.place_id)
                if not relation:
                    relation = RelationSpotSch.create(place_info)
                else:
                    relation = RelationSpotSch.update(trip_id, place.place_id, place_info)

        return make_response({'message': 'Trip updated successfully.'}, 200)
    
    def delete(self, trip_id):
        # schedule = Schedule.delete(trip_id)
        # return schedule
        pass