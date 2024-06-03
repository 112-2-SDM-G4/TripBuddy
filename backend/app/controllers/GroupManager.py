from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request, make_response
from app.controllers.utils import *
from app.models.relation_user_sch import RelationUserSch
from app.models.relation_sch_tag import RelationSchTag
from app.models.relation_spot_sch import RelationSpotSch
from app.models.user import User
from app.models.schedule import Schedule
from app.models.create_db import db
from app.controllers.utils import user_owns_schedule, varify_user

class SetGroupMember(Resource):
    @jwt_required()
    def post(self):
        user_id = varify_user(get_jwt_identity())
        data = request.get_json()
        trip_id = data.get('trip_id', None)
        invited_id = data.get('invited_id', None)

        if not user_owns_schedule(user_id, trip_id):
            return make_response({'message': 'User access forbidden'}, 403)

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
        user_id = varify_user(get_jwt_identity())
        trip_id = data.get('trip_id', None)

        if not user_owns_schedule(user_id, trip_id):
            return make_response({'message': 'User access forbidden'}, 403)

        RelationUserSch.delete(user_id, trip_id)

        remain = RelationUserSch.get_by_schedule(trip_id)

        if not remain:
            # 刪 Relation_Sch_tag
            RelationSchTag.delete_by_trip(trip_id)
            # 刪 Relation_Spot_Sch
            RelationSpotSch.delete_by_trip(trip_id)
            # 刪 Relation_user_Transaction
            all_trades = Transaction.get_by_schedule(trip_id)
            for trade in all_trades:
                RelationUserTransaction.delete_by_transaction(trade.transaction_id)
            # 刪 Transaction
            Transaction.delete_by_schedule(trip_id)
            # 刪 Schedule
            Schedule.delete(trip_id)

        success_response = {
            "message": "successful",
	        "valid": True
        }

        return make_response(success_response, 200)
    
    @jwt_required()
    def get(self):
        request_user_id = varify_user(get_jwt_identity())
        trip_id = request.args.get('trip_id')

        if not user_owns_schedule(request_user_id, trip_id):
            return make_response({'message': 'User access forbidden'}, 403)
        
        schedule = RelationUserSch.get_by_schedule(trip_id)
        
        user_ids = [user_id.user_id for user_id  in schedule]

        users = User.query.filter(User.user_id.in_(user_ids)).all()

        response_user_info = []
        for user in users:
            user_detail = {
		        "user_name": user.user_name,
		        "user_email": user.email,
		        "user_avatar": user.user_icon
            }
            response_user_info.append(user_detail)

        InfoResponse = {
            "trip_member_info": response_user_info
        }

        err_msg = {
            'valid': False,
            'message': "Error"
        }

        if schedule:
            return make_response(InfoResponse, 200)
        
        if not schedule:
            return make_response(err_msg, 401)