import os
import random
from datetime import datetime, timedelta
from flask_restful import Resource, reqparse
from flask import request, make_response, jsonify
from flask_mail import Message
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
# from google.oauth2 import id_token
# from google.auth.transport import requests
# import google.auth.oauthlib.flow
# from googleapiclient.discovery import build

from app.models.user import User, UserVerify
from app.models.relation_user_tag import RelationUserTag
from app.models.tags import Tags
# import app
from app.models.create_db import db
from app.services.mail import get_mail
from app.services.googlelogin import GoogleLogin


class SendVerifyEmail(Resource):
    def post(self):
        mail = get_mail()
        user_email = str(request.get_json()['user_email']).strip(' ')
        user = User.get_by_email(user_email)
        if user:
            return make_response({'valid': False, 'message': "This email had been taken."}, 200)
        else: # new user
            v_code = str(random.randint(100000, 999999)).zfill(6)
            expired_time = (datetime.now() + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")
            if UserVerify.get_by_email(user_email):
                verification = UserVerify.update(user_email, {"v_code": v_code, "expired_time": expired_time})
            else: # first time
                verification = UserVerify(email=user_email, v_code=v_code, expired_time=expired_time)
                db.session.add(verification)
                db.session.commit()

            msg = Message(
                subject="[Email Verification]",
                sender=os.getenv('MAIL_DEFAULT_SENDER'),
                recipients=[user_email],
                html=f"<p>Hi, {user_email},</p><p>Your verification code is: <b>{v_code}</b>. This code will expire at <b>{expired_time}</b>.</p>"
                # html=render_template("email.html")
            )
            try:
                mail.send(msg)
                return make_response({'valid': True, 'message': f"Verification Code has been sent to {user_email}."}, 200)
            except Exception as e:
                return make_response({'valid': False, "message": str(e)}, 500)

class UserVerification(Resource):    
    def post(self):
        data = request.get_json()
        user_email = data['user_email']
        hashed_password = data['hashed_password']
        salt = data['salt']
        verify_token = data['token']

        res_json = {
            "valid": False,
            "jwt_token": "",
            "message": ""
        }

        if User.get_by_email(user_email):
            res_json['message'] = "This email had been taken."
            return make_response(res_json, 200)
        
        user = UserVerify.get_by_email(user_email)
        if user is None:
            res_json['message'] = "Email doesn't match. Please check your email address."
            return make_response(res_json, 200)
        else:
            current_time = datetime.now()
            print(current_time, user.expired_time)
            if current_time > user.expired_time:
                res_json['message'] = "Verification code had been expired."
                return make_response(res_json, 200)
            else:
                if verify_token != user.verification_code:
                    res_json['message'] = "Wrong verification code!!!"
                    return make_response(res_json, 200)
                else: # Success
                    new_user = User(
                        user_name="User", 
                        google_token=None,
                        email=user_email,
                        hashed_password=hashed_password,
                        salt=salt,
                        language="zh",
                        questionnaire=False,
                        user_icon = 0
                    )
                    db.session.add(new_user)
                    db.session.commit()

                    jwt_token = create_access_token(identity=user_email)
                    res_json['valid'] = True
                    res_json['jwt_token'] = jwt_token
                    res_json['message'] = "Register Successfully!!!"
                    return make_response(res_json, 200)

class SetUserInfo(Resource):
    @jwt_required()
    def post(self):

        user_email = get_jwt_identity()
        user = User.get_by_email(user_email)
        
        err_msg = {
            'valid': False,
            'message': "User not found."
        }

        if not user:
            return make_response(err_msg, 404)

        data = request.get_json()
        user_name = data.get('user_name', None)
        language = data.get('language', None)
        tags = data.get('tags', None)
        user_icon = data.get('avatar', None)
        
        if user_name:
            user.user_name = user_name
            user.language = language
            user.user_icon = user_icon
            user.questionnaire = True

        if tags:
            RelationUserTag.delete_by_user(user.user_id)
            for t_id in tags:
                new_relation_user_tag = RelationUserTag(
                    user_id = user.user_id,
                    tag_id = t_id
                )
                db.session.add(new_relation_user_tag)

        db.session.commit()

        responce = {
            'valid': True,
            'user_name': user.user_name, 
            'language': user.language, 
            'message': "User information updated successfully."
        }
        
        return make_response(responce, 200)
    
class LoginCheckUser(Resource):
    def get(self):
        user_email = request.args.get('user_email')
        # data = request.get_json()
        # user_email = data.get('email')、
        user = User.get_by_email(user_email)

        if user is not None:
            res_json = {
                'valid': True,
                'salt': user.salt
            }
            return make_response(res_json, 200)
        else:
            res_json = {
                'valid': False, 
                'salt': '', 
                'message': 'User do not exist, Please try to regist'
            }
            return make_response(res_json, 401)


class LoginCheckPassword(Resource):
    def post(self):
        data = request.get_json()
        user_email = data.get('user_email')
        password_input = data.get('hashed_password')
        user = User.get_by_email(user_email)

        if user and password_input == user.hashed_password :
            jwt_token = create_access_token(identity=user_email)
            res_json = {
                'valid': True,
                'jwt_token': jwt_token,
                'user_name': user.user_name,
                'language': user.language,
                'message': 'Login Successful',
                'preference': user.questionnaire
            }
            return make_response(res_json, 200)
        else:
            res_json = {
                'valid': False,
                'jwt_token': '',
                'user_name': '',
                'language': '',
                'message': 'Wrong Password',
                'preference': None
            }
            return make_response(res_json, 401)
        
class ForgetPassword(Resource):
    def post(self):
        mail = get_mail()
        user_email = str(request.get_json()['email']).strip(' ')
        user = User.get_by_email(user_email)
        if not user:
            return make_response({'valid': False, 'message': "This email is not registered."}, 200)
        v_code = str(random.randint(100000, 999999)).zfill(6)
        expired_time = (datetime.now() + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")
        if UserVerify.get_by_email(user_email):
            verification = UserVerify.update(user_email, {"v_code": v_code, "expired_time": expired_time})
        else:
            verification = UserVerify(email=user_email, v_code=v_code, expired_time=expired_time)
            db.session.add(verification)
            db.session.commit()
        # 寄信
        msg = Message(
            subject="[Reset Your Password]",
            sender=os.getenv('MAIL_DEFAULT_SENDER'),
            recipients=[user_email],
            html=f"<p>Hi, {user_email},</p><p>Your verification code is: <b>{v_code}</b>. This code will expire at <b>{expired_time}</b>.</p>"
            # html=render_template("email.html")
        )
        try:
            mail.send(msg)
            return make_response({"valid": True, "message": "Password reset email was sent."}, 200)
        except Exception as e:
            return make_response({'valid': False, "message": str(e)}, 500)
class ResetPassword(Resource):
    def post(self):
        data = request.get_json()
        email = data['email']
        reset_token = data['reset_token']

        res_json ={
            "valid" :False,
            "message":""
        }
        # 因為經過 ForgetPassword 驗證後，不須再驗證 User table 只須驗證 UserVerify 的 code 正確/過期
        user = UserVerify.get_by_email(email)
        if not user:
            res_json['message'] = "email is not valid"
            return make_response(res_json, 200)
        current_time = datetime.now()
        if current_time > user.expired_time:
            res_json['message'] = "Verification code had been expired."
            return make_response(res_json, 200)
        print(reset_token, user.verification_code)
        if reset_token != user.verification_code:
            res_json['message'] = "Wrong verification code!!!"
            return make_response(res_json, 200)

        # success
        User.update(email, {"new_password": data['new_password'], "new_salt": data['new_salt']})
        res_json['valid'] = True
        res_json['message'] = "Password reset successful!"
        return make_response(res_json, 200)         
    

class GetUserInfo(Resource):
    @jwt_required()
    def get(self):
        user_email = get_jwt_identity()
        # user_email = 'r12725049@ntu.edu.tw'
        user = User.get_by_email(user_email)
        user_tags = RelationUserTag.get_by_user_id(user.user_id)
        tag_ids = [user_tag.tag_id for user_tag in user_tags]

        tags = Tags.query.filter(Tags.tag_id.in_(tag_ids)).all()

        response_tags = []
        for tag in tags:
            tag_detail = {
                "type_name_zh": tag.type_zh,
                "type_name_en": tag.type_en,
                "tag_name_zh": tag.name_zh,  # 假設這些資訊在 Tag 模型中
                "tag_name_en": tag.name_en,
                "tag_id": tag.tag_id
            }
            response_tags.append(tag_detail)


        InfoResponse = {
	        "user_name": user.user_name,
	        "user_email": user_email,
	        "language": user.language,
	        "avatar": user.user_icon,
            "tags": response_tags
        }

        err_msg = {
            'valid': False,
            'message': "User not found."
        }

        if user:
            return make_response(InfoResponse, 200)
        
        if not user:
            return make_response(err_msg, 401)

class HandleGoogleLogin(Resource):
    ''' TODO: Implement Google OAuth2 login flow
    1. Receive authorization code from google oauth server
    2. Exchange code for tokens and potentially user information
    3. Verify/Create user, generate JWT
    4. Return user data and JWT
    '''
    def post(self):
        parser = reqparse.RequestParser()
        parser.add_argument('code', type=str, required=True)  # Assuming authorization code is in request body
        args = parser.parse_args()

        # Create GoogleLogin instance (if needed)
        google_login = GoogleLogin()

        # Exchange code for tokens and potentially user information
        try:
            credentials = google_login.callback(args['code'])
        except Exception as e:
            return {'error': str(e)}, 400  # Handle errors

        # Verify/Create user, generate JWT (implementation specific)
        user_data, jwt_token = handle_user_with_google_data(credentials)

        return {'user': user_data, 'jwt_token': jwt_token}, 200
    
    def handle_user_with_google_data(credentials):
        # ... (user verification/creation, JWT generation)
        pass
    
# class ValidateEmail(Resource):
#     def post(self):
#         user_email = str(request.get_json()['user_email']).strip(' ')
#         user = User.get_by_email(user_email)

#         res_json = {
#             "valid": False, 
#             "jwt_token": "",
#             "message": ""
#         }

#         if not user:
#             res_json['message'] = "User not found."
#             return make_response(res_json, 200)
        
#         if not user.google_token:
#             res_json['message'] = "User had been registered from original system."
#             return make_response(res_json, 200)
        
#         jwt_token = create_access_token(identity=user_email)
#         res_json['valid'] = True
#         res_json['jwt_token'] = jwt_token
#         res_json['message'] = "Email from google token is valid."
        
#         return make_response(res_json, 200)

# class CreateUser(Resource):
#     def post(self):
#         data = request.get_json()
#         user_email = str(request.get_json()['user_email']).strip(' ')

#         if User.get_by_email(user_email):
#             return make_response({'valid': False, 'message': "This email had been taken."}, 200)
        
#         user_data = {
#             'user_name': data['user_name'],
#             'email': user_email,
#             'hashed_password': 'google',
#             'salt': 'google',
#             'language': 'zh',
#             'questionnaire': False,
#             'user_icon': 0,
#             'google_token': data['google_id']
#         }

#         User.create(user_data)
#         return make_response({'valid': True, 'message': "Register Successfully!!!"}, 200)
    