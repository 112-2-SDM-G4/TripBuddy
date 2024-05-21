# app/controllers/SocketTripManager.py
from flask_socketio import join_room, leave_room, emit
from flask_jwt_extended import jwt_required, get_jwt_identity
from app import socketio
from app.models.schedule import Schedule
from app.models.relation_user_sch import RelationUserSch
from app.models.relation_spot_sch import RelationSpotSch
from app.controllers.TripManager import TripManager
from app.controllers.utils import *


class SocketTripManager:
    @socketio.on('join_trip')
    @jwt_required()
    def on_join_trip(data):
        user_id = varify_user(get_jwt_identity())
        trip_id = data.get('trip_id')
        if user_id is None or trip_id is None:
            emit('error', {'message': 'User or trip not found.'})
            return

        # 檢查用戶是否已經有權限參與該行程
        relation = RelationUserSch.get_by_user_schedule(user_id, trip_id)
        if not relation or not relation.access:
            emit('error', {'message': 'User does not have access to this trip.'})
            return

        join_room(trip_id)
        emit('message', {'msg': f'User {user_id} joined room for trip {trip_id}'}, room=trip_id)

    @socketio.on('leave_trip')
    @jwt_required()
    def on_leave_trip(data):
        user_id = varify_user(get_jwt_identity())
        trip_id = data.get('trip_id')
        if user_id is None or trip_id is None:
            emit('error', {'message': 'User or trip not found.'})
            return

        # 檢查用戶是否在該行程中
        relation = RelationUserSch.get_by_user_schedule(user_id, trip_id)
        if not relation or not relation.access:
            emit('error', {'message': 'User not in trip.'})
            return
        
        leave_room(trip_id)
        emit('message', {'msg': f'User {user_id} left trip {trip_id}'}, room=trip_id)

    @socketio.on('insert_place') #加景點進行程
    @jwt_required()
    def on_insert_place(place_info):
        user_id = varify_user(get_jwt_identity())
        trip_id = place_info.get('trip_id')
        language = place_info.get('language')

        if user_id is None:
            emit('error', {'message': 'User not found.'})
            return
        
        if not Schedule.get_by_id(trip_id):
            emit('error', {'message': 'Trip not found.'})
            return
            
        if not user_owns_schedule(user_id, trip_id):
            emit('error', {'message': 'User does not have access to this trip.'})
            return

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
        
        SocketTripManager.emit_trip_update(trip_id, language, broadcast=True)
        

    @socketio.on('update_trip') #儲存更新行程
    # @jwt_required()
    def on_update_trip(data):
        trip_id = data.get('trip_id')
        language = data.get('language')
        user_id = varify_user(get_jwt_identity())
        if user_id is None:
            emit('error', {'message': 'User not found.'})
            return

        if not Schedule.get_by_id(trip_id):
            emit('error', {'message': 'Trip not created.'})
            return

        if not user_owns_schedule(user_id, trip_id):
            emit('error', {'message': 'User does not have access to this trip.'})
            return

        if (Schedule.get_by_id(trip_id).end_date - Schedule.get_by_id(trip_id).start_date).days + 1 != len(data['trip']):
            emit('error', {'message': 'Trip length does not match.'})
            return

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
                place_info['stay_time'] = [1, 0] if 'stay_time' not in place_info else place_info['stay_time']
                place_info['period_hours'] = place_info['stay_time'][0]
                place_info['period_minutes'] = place_info['stay_time'][1]
                RelationSpotSch.create(place_info)

        SocketTripManager.emit_trip_update(trip_id, language,broadcast=True)

    def emit_trip_update(trip_id, language='zh', broadcast=True):
        schedule = Schedule.get_by_id(trip_id)
        if not schedule:
            emit('error', {'message': 'Trip not found.'})
            return

        places_in_trip = RelationSpotSch.get_by_schedule(trip_id)
        trip_detail = [[] for _ in range((schedule.end_date - schedule.start_date).days + 1)]
        places_in_trip.sort(key=lambda x: (x.date, x.order))
        for relation_spot_sch in places_in_trip:
            res_code, place_info = fetch_and_save_place(relation_spot_sch.place_id, language)
            if res_code != 200:
                continue
            place_info['relation_id'] = relation_spot_sch.rss_id
            place_info['comment'] = relation_spot_sch.comment
            place_info['money'] = relation_spot_sch.money
            place_info['stay_time'] = [relation_spot_sch.period_hours, relation_spot_sch.period_minutes]
            trip_detail[relation_spot_sch.date - 1].append(place_info)

        response = {
            "id": schedule.schedule_id,
            "name": schedule.schedule_name,
            "image": TripManager.get_trip_photo(schedule),  
            "start_date": date_to_array(schedule.start_date),
            "end_date": date_to_array(schedule.end_date),
            "location_id": TripManager.get_trip_location_id(schedule),
            "location": [schedule.location_lat, schedule.location_lng],
            "trip": trip_detail,
            "public": schedule.public,
            "standard": schedule.standard,
            "exchange": schedule.exchange,
        }

        emit('render_trip', response, room=trip_id, broadcast=broadcast)