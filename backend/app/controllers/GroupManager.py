from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request, make_response
from app.controllers.utils import *
from app.models.relation_user_sch import RelationUserSch
from app.models.user import User
from app.models.schedule import Schedule
from app.models.create_db import db

class SetGroupMember(Resource):
    @jwt_required()
    def post(self):
        data = request.get_json()
        trip_id = data.get('trip_id', None)
        invited_id = data.get('invited_id', None)

        now_schdule = Schedule.get_by_id(trip_id)
        new_member = User.get_by_email(invited_id)

        if new_member:
            access = RelationUserSch.get_by_user_schedule(new_member.user_id, trip_id)

        sch_err_msg = {
	        "message": "Schedule is public",
	        "valid": False
        }

        user_err_msg = {
            "message": "User not exist",
	        "valid": False
        }

        access_err_msg = {
            "message": "User has been group member",
	        "valid": False
        }

        if not now_schdule:
            return make_response(sch_err_msg, 400)
        elif now_schdule.public == True:
            return make_response(sch_err_msg, 400)
        elif not new_member:
            return make_response(user_err_msg, 400)
        elif access:
            return make_response(access_err_msg, 400)
        
        if new_member:
            if not access:
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
	        "valid": True,
            # "user_id": new_member.user_id,
        }

        return make_response(success_response, 200)
    

    @jwt_required()
    def delete(self):
        data = request.get_json()
        user_email = get_jwt_identity()
        # user_email = 'r12725049@ntu.edu.tw'
        user = User.get_by_email(user_email)
        trip_id = data.get('trip_id', None)

        RelationUserSch.delete(user.user_id, trip_id)

        success_response = {
            "message": "successful",
	        "valid": True
        }

        return make_response(success_response, 200)
