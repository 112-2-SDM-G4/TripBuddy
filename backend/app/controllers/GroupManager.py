from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request, make_response
from app.controllers.utils import *
from app.models.relation_user_sch import RelationUserSch
from app.models.user import User
from app.models.schedule import Schedule
from app.models.create_db import db

class SetGroupMember(Resource):
    # @jwt_required()
    def post(self):
        data = request.get_json()
        trip_id = data.get('trip_id', None)
        invited_id = data.get('invited_id', None)

        now_schdule = Schedule.get_by_id(trip_id)
        new_member = User.get_by_email(invited_id)

        sch_err_msg = {
	        "message": "schedule error",
	        "valid": False
        }

        user_err_msg = {
            "message": "user not exist",
	        "valid": False
        }

        if not now_schdule:
            return make_response(sch_err_msg, 404)
        
        if now_schdule.public == True:
            return make_response(sch_err_msg, 404)
        
        if not new_member:
            return make_response(user_err_msg, 404)
        
        if new_member:
            new_relation_user_sch = RelationUserSch(
                user_id = new_member.user_id,
                schedule_id = trip_id,
                access = 1,
                heart = 0
            )
            db.session.add(new_relation_user_sch)
            db.session.commit()

        success_response = {
            "message": "successful",
	        "valid": True
        }

        return make_response(success_response, 200)
    

    # @jwt_required()
    def delete(self):
        data = request.get_json()
        # user_email = get_jwt_identity()
        user_email = 'r12725049@ntu.edu.tw'
        user = User.get_by_email(user_email)
        trip_id = data.get('trip_id', None)

        RelationUserSch.delete(user.user_id, trip_id)

        success_response = {
            "message": "successful",
	        "valid": True
        }

        return make_response(success_response, 200)
