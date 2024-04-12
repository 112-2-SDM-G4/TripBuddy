import os
import random
from datetime import datetime, timedelta
from flask_restful import Resource
from flask import request, make_response, jsonify
from flask_mail import Message
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app.models.user import User, UserVerify
import app

class SendVerifyEmail(Resource):
    def post(self):
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
                app.db.session.add(verification)
                app.db.session.commit()

            msg = Message(
                subject="[Email Verification]",
                sender=os.getenv('MAIL_DEFAULT_SENDER'),
                recipients=[user_email],
                html=f"<p>Hi, {user_email},</p><p>Your verification code is: <b>{v_code}</b>. This code will expire at <b>{expired_time}</b>.</p>"
                # html=render_template("email.html")
            )
            try:
                app.mail.send(msg)
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
                        email=user_email,
                        hashed_password=hashed_password,
                        salt=salt,
                        language="zh",
                        questionnaire=False
                    )
                    app.db.session.add(new_user)
                    app.db.session.commit()

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
        
        if user_name:
            user.user_name = user_name
        
        if language:
            user.language = language

        ### tags 跟 relation_user_tag 的部分尚未實作

        app.db.session.commit()

        responce = {
            'valid': True,
            'user_name': user.user_name, 
            'language': user.language, 
            'message': "User information updated successfully."
        }
        
        return make_response(responce, 200)
    
class LoginCheckUser(Resource):
    def post(self):
        data = request.get_json()
        user_email = data.get('email')
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