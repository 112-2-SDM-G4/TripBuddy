from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request, make_response, jsonify
from datetime import date


from app.models.schedule import Schedule
from app.models.ledger import Ledger
from app.models.post import Post
from app.models.relation_user_sch import RelationUserSch
from app.models.user import User

class TripManager(Resource):

    def get(self, id=None):
        if id:
            schedule = Schedule.get_by_id(id)
            return schedule
        else:
            schedules = Schedule.get_all()
            return schedules
    
    @jwt_required()
    def post(self):
        data = request.get_json()
        user_email = get_jwt_identity()

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
            schedule_params['start_date'] = date(data['start_date'][0], data['start_date'][1], data['start_date'][2])
            schedule_params['end_date'] = date(data['end_date'][0], data['end_date'][1], data['end_date'][2])
            assert schedule_params['start_date'] <= schedule_params['end_date']
        except:
            return make_response({'message': 'Invalid date.'}, 400)
        
        schedule = Schedule.create(schedule_params)

        # create relation between user and schedule
        user = User.get_by_email(user_email)
        if not user:
            return make_response({'message': 'User not found.'}, 400)
        
        relation = RelationUserSch.create({
            'user_id': user.user_id,
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
    
    def put(self, id):
        data = request.get_json()
        schedule = Schedule.update(id, data)
        return schedule
    
    def delete(self, id):
        schedule = Schedule.delete(id)
        return schedule