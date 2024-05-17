from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request, make_response, jsonify
import json
import ast

from app.controllers.utils import *
from app.models.schedule import Schedule
from app.models.post import Post
from app.models.place import Place
from app.models.tags import Tags
from app.models.relation_user_sch import RelationUserSch
from app.models.relation_spot_sch import RelationSpotSch
from app.models.relation_sch_tag import RelationSchTag
from app.services.gemini import Gemini

class TripManager(Resource):
    def get_trip_length(self, trip):
        return (trip.end_date - trip.start_date).days + 1

    def get_trip_location_id(self, trip):
        location_tag = Tags.get_by_name_zh(trip.location)
        if location_tag:
            return location_tag.tag_id
        return None
    
    def get_trip_photo(self, trip):
        places_in_trip = RelationSpotSch.get_by_schedule(trip.schedule_id)
        for relation_spot_sch in places_in_trip:
            place = Place.get_by_google_place_id(relation_spot_sch.place_id).first()
            if place and place.image != None:
                return place.image
        return None
        
    @jwt_required()
    def get(self, trip_id=None, lang='zh'):
        if trip_id: # get a specific schedule detail
            user_id = varify_user(get_jwt_identity())
            if user_id == None:
                return make_response({'message': 'User not found.'}, 400)
            
            if not Schedule.get_by_id(trip_id):
                return make_response({'message': 'Trip not found.'}, 400)
            
            schedule = Schedule.get_by_id(trip_id)

            places_in_trip = RelationSpotSch.get_by_schedule(trip_id)
            
            trip_detail = [[] for _ in range(self.get_trip_length(schedule))]
            places_in_trip.sort(key=lambda x: (x.date, x.order))
            for relation_spot_sch in places_in_trip:
                res_code, place_info = fetch_and_save_place(relation_spot_sch.place_id, lang)
                if res_code != 200:
                    continue
                place_info['relation_id'] = relation_spot_sch.rss_id
                place_info['comment'] = relation_spot_sch.comment
                place_info['money'] = relation_spot_sch.money
                place_info['stay_time'] = [relation_spot_sch.period_hours, relation_spot_sch.period_minutes]
                
                trip_detail[relation_spot_sch.date-1].append(place_info)

            responce = {
                "id": schedule.schedule_id,
                "name": schedule.schedule_name,
                "image": self.get_trip_photo(schedule), # random photo from places
                "start_date": date_to_array(schedule.start_date),
                "end_date": date_to_array(schedule.end_date),
                "location_id": self.get_trip_location_id(schedule),
                "location": [schedule.location_lat, schedule.location_lng],
                "trip": trip_detail,
                "public": schedule.public,
                "standard": schedule.standard,
                "exchange": schedule.exchange,
            }


        else: # get all schedules accessible by the user
            user_id = varify_user(get_jwt_identity())
            if user_id == None:
                return make_response({'message': 'User not found.'}, 400)
            
            trips = []
            relations = RelationUserSch.get_by_user(user_id)
            for relation in relations:
                if relation.access:
                    trip_info = {}
                    schedule = Schedule.get_by_id(relation.schedule_id)
                    trip_info['id'] = schedule.schedule_id
                    trip_info['name'] = schedule.schedule_name
                    trip_info['image'] = self.get_trip_photo(schedule) # random photo from places
                    trip_info['date_status'] = check_date_status(schedule.start_date, schedule.end_date)
                    trip_info['start_date'] = date_to_array(schedule.start_date)
                    trip_info['end_date'] = date_to_array(schedule.end_date)
                    trip_info['location_id'] = self.get_trip_location_id(schedule)
                    trips.append(trip_info) 

            responce = {
                'user_trip': trips,
            }
        
        return make_response(responce, 200) 
    
    @jwt_required()
    def post(self):
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        data = request.get_json()

        # create new post for the schedule
        post_params = {
            'content': None,
            'like_count': 0,
        }
        trip_post = Post.create(post_params)
        print("New Trip Post ID: ", trip_post.post_id)

        # create new schedule
        schedule_params = {
            'post_id': trip_post.post_id,
            'location_name_zh': Tags.get_by_id(data['location_id']).name_zh,
            'location_lng': data['location'][1],
            'location_lat': data['location'][0],
            'standard': data['standard'],
            'exchange': data['exchange'] if 'exchange' in data else None,
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
        print("New Trip ID: ", schedule.schedule_id)

        
        user_sch_relation = RelationUserSch.create({
            'user_id': user_id,
            'schedule_id': schedule.schedule_id,
            'access': True,
            'heart': False,
            'rate': None,
        })
        print("New Trip User Relation ID: ", user_sch_relation.rus_id)

        sch_location_relation = RelationSchTag.create({
            'schedule_id': schedule.schedule_id,
            'tag_id': data['location_id'],
        })
        print("New Trip Location Relation ID: ", sch_location_relation.rst_id)


        respose = {
            'trip_id': schedule.schedule_id,
            'message': 'Trip created successfully.',
        }
    
        return make_response(respose, 201)
    
    @jwt_required()
    def put(self, trip_id):
        data = request.get_json()
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        if not Schedule.get_by_id(trip_id):
            return make_response({'message': 'Trip has not created.'}, 400)
        
        if not user_owns_schedule(user_id, trip_id):
            return make_response({'message': 'User does not have access to this trip.'}, 403)
        
        if self.get_trip_length(Schedule.get_by_id(trip_id)) != len(data['trip']):
            return make_response({'message': 'Trip length does not match.'}, 400)

        # delete origin relations 
        RelationSpotSch.delete_by_trip(trip_id)

        for day_count, day_list in enumerate(data['trip'], start=1):
            for order_count, place_info in enumerate(day_list, start=1):
                # if spot is not in Place, create new Place
                res_code, place_detail = fetch_and_save_place(place_info['place_id'], 'zh')

                # create new relation if not exist, update if exist
                place_info['schedule_id'] = trip_id
                place_info['category'] = 'common'
                place_info['date'] = day_count
                place_info['order'] = order_count
                place_info['stay_time'] = [1,0] if 'stay_time' not in place_info else place_info['stay_time']
                place_info['period_hours'] = place_info['stay_time'][0]
                place_info['period_minutes'] = place_info['stay_time'][1]
                RelationSpotSch.create(place_info)

        return make_response({'message': 'Trip updated successfully.'}, 200)
    
    @jwt_required()
    def delete(self, trip_id):
        user_email = varify_user(get_jwt_identity())
        if user_email == None:
            return make_response({'message': 'User not found.'}, 400)
        
        if not Schedule.get_by_id(trip_id):
            return make_response({'message': 'Trip not found.'}, 400)
        
        if not user_owns_schedule(user_email, trip_id):
            return make_response({'message': 'User does not have access to this trip.'}, 403)
        
        # delete relations
        RelationUserSch.delete(user_email, trip_id)
        RelationSpotSch.delete_by_trip(trip_id)
        RelationSchTag.delete_by_trip(trip_id)

        # delete schedule, ledger, post
        schedule = Schedule.get_by_id(trip_id)
        post_id = schedule.post_id
        Schedule.delete(trip_id)
        Post.delete(post_id)
        

        return make_response({'message': 'Trip deleted successfully.'}, 200)

class AITripGeneration(Resource):
    @jwt_required()
    def post(self):
        """User input text for Gemini-powered auto schedule generation"""
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        data = request.get_json()
        text = data['text']
        country = Tags.get_name_en(data['location_id'])
        location_lat, location_lng = data['location']
        exchange = data['exchange'] if 'exchange' in data else None
        standard = data['standard'] 
        try:
            start_date = array_to_date(data['start_date'])
            end_date = array_to_date(data['end_date'])
            assert start_date <= end_date
        except:
            return make_response({'message': 'Invalid date.'}, 400)
        
        trip_name = self._generate_schedule_name(text, country, start_date, end_date)
        raw_schedule = self._generate_raw_schedule(text, country, start_date, end_date)
        schedule_info = {
            'location_id': data['location_id'],
            'location_lng': location_lng,
            'location_lat': location_lat,
            'exchange': exchange,
            'standard': standard,
            'schedule_name': trip_name,
            'places': self.search_places_id(raw_schedule, location_lat, location_lng),
            'start_date': start_date,
            'end_date': end_date,
        }
        print(schedule_info['places'])
        schedule_id = self._create_schedule(schedule_info, user_id)
        self._create_places_in_trip(schedule_info, schedule_id, user_id)
        respose = {
            'trip_id': schedule_id,
            'message': 'Trip created successfully.',
        }
    
        return make_response(respose, 201)
    
    def search_places_id(self, raw_schedule: list[dict], location_lat, location_lng, lang='en') -> list[dict]:
        """Search places in the raw schedule"""
        google_maps = GoogleMapApi(GOOGLE_MAPS_API_KEY)
        
        for place in raw_schedule:
            search_res, search_places = google_maps.get_search_info(place['place_name'], lang, location_lat, location_lng)
            place['place_id'] = search_places[0]['place_id']
        return raw_schedule
    
    def _generate_schedule_name(self, user_input: str, country: str, start_date: date, end_date: date) -> str:
        """Use Google Gemini to generate schedule name"""
        travel_days = (end_date - start_date).days + 1
        response_schema = {'trip_name': 'example trip name'}
        gpt_input = f"""
        You are a creative guy, I have a trip to {country} for {travel_days} days, 
        there is some description of my trip: {user_input}, 
        please give a name for my trip, short and precise.
        One answer only, don't use # or other symbols.
        Your responce must follow JSON schema.<JSONSchema>{json.dumps(response_schema)}</JSONSchema>
        """
        
        model_config = { 
            'candidate_count': 1,
            'response_mime_type': 'application/json',
            'response_schema': response_schema,
        }
        gemini = Gemini(configs=model_config)
        response = gemini.generate_content(gpt_input)
        trip_name = ast.literal_eval(response.candidates[0].content.parts[0].text)['trip_name']
        print(trip_name)
        return trip_name


    def _generate_raw_schedule(self, user_input: str, country: str, start_date: date, end_date: date):
        """Use Google Gemini to generate raw schedule"""
        travel_days = (end_date - start_date).days + 1
        response_schema = {
            'trip': [
                {
                    'place_name': 'example place name',
                    'date': 1,
                    'order': 1,
                },
                {
                    'place_name': 'example place name',
                    'date': 1,
                    'order': 2,
                },
                {
                    'place_name': 'example place name',
                    'date': 2,
                    'order': 1,
                },
                {
                    'place_name': 'example place name',
                    'date': 2,
                    'order': 2,
                }
            ]
        }
        gpt_input = f"""
        You are a local expert in {country}, 
        you must plan a {travel_days}-day itinerary list for the user, 
        and have some user preferences: {user_input}.
        Your responce must follow JSON schema.<JSONSchema>{json.dumps(response_schema)}</JSONSchema>
        """

        model_config = { 
            'candidate_count': 1,
            'response_mime_type': 'application/json',
        }
        gemini = Gemini(configs=model_config)
        response = gemini.generate_content(gpt_input)
        raw_schedule = ast.literal_eval(response.candidates[0].content.parts[0].text)['trip']
        return raw_schedule
    
    def _create_schedule(self, schedule_info: Dict, user_id: int) -> int:
        """Create schedule from post-processed schedule_info"""
        # create new post for the schedule
        post_params = {
            'content': None,
            'like_count': 0,
        }
        trip_post = Post.create(post_params)

        # create new schedule
        """
        符合 Tags 表的 location_id，必須是數字 #TODO: prompt 中必須限制國家和給對應表
        國家 location 的經緯度（需要查表）
        standard 預設 TWD
        exchange 使用國家的貨幣
        schedule_name 從 gemini 生成
        start_date & end_date 須在開始時由使用者輸入，這邊應取得處理過後的格式
        """
        schedule_info['post_id'] = trip_post.post_id
        schedule_info['location_name_zh'] = Tags.get_by_id(schedule_info['location_id']).name_zh    
        schedule = Schedule.create(schedule_info)

        # Update RelationUserSch
        RelationUserSch.create({
            'user_id': user_id,
            'schedule_id': schedule.schedule_id,
            'access': True,
            'heart': False,
            'rate': None,
        })

        # Update RelationSchTag
        RelationSchTag.create({
            'schedule_id': schedule.schedule_id,
            'tag_id': schedule_info['location_id'], #TODO
        })
        return schedule.schedule_id

    def _create_places_in_trip(self, schedule_info: Dict, schedule_id: int, user_id: int) -> None:
        '''Insert places into trip, move the corresponding places'''
        # Assertion
        if not Schedule.get_by_id(schedule_id):
                return make_response({'message': 'Trip not found.'}, 400)            
        if not user_owns_schedule(user_id, schedule_id):
            return make_response({'message': 'User does not have access to this trip.'}, 403)
        
        # Insert places
        for place in schedule_info['places']:
            # if order = 0 then insert at the end
            if place['order'] == 0:
                place['order'] = RelationSpotSch.get_max_order(schedule_id, place['date']) + 1

            RelationSpotSch.update_order(schedule_id, place['date'], place['order'], increase=True)
            place['schedule_id'] = schedule_id
            place['category'] = "common"
            place['period_hours'] = 1 #TODO
            place['period_minutes'] = 0 #TODO
            RelationSpotSch.create(place)

    def _get_schedule_detail(self, schedule_id: int, lang: str='zh') -> Tuple[int, Dict]:
        """Get the generated schedule"""
        if not Schedule.get_by_id(schedule_id):
            return 400, {'message': 'Trip not found.'}
        
        schedule: Schedule = Schedule.get_by_id(schedule_id)
        places_in_trip = RelationSpotSch.get_by_schedule(schedule_id)
        
        trip_detail = [[] for _ in range(TripManager.get_trip_length(schedule))]
        places_in_trip.sort(key=lambda x: (x.date, x.order))
        for relation_spot_sch in places_in_trip:
            res_code, place_info = fetch_and_save_place(relation_spot_sch.place_id, lang)
            if res_code != 200:
                continue
            place_info['relation_id'] = relation_spot_sch.rss_id
            place_info['comment'] = relation_spot_sch.comment
            place_info['money'] = relation_spot_sch.money
            place_info['stay_time'] = [relation_spot_sch.period_hours, relation_spot_sch.period_minutes]
            
            trip_detail[relation_spot_sch.date-1].append(place_info)

        response = {
            "id": schedule.schedule_id,
            "name": schedule.schedule_name,
            "image": TripManager.get_trip_photo(schedule), # random photo from places
            "start_date": date_to_array(schedule.start_date),
            "end_date": date_to_array(schedule.end_date),
            "location_id": TripManager.get_trip_location_id(schedule),
            "location": [schedule.location_lat, schedule.location_lng],
            "trip": trip_detail,
            "public": schedule.public,
            "standard": schedule.standard,
            "exchange": schedule.exchange,
        }
        return 200, response