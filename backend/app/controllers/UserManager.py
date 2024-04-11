import os
import random
from datetime import datetime, timedelta
from flask_restful import Resource
from flask import request, make_response
from flask_mail import Mail, Message
from app.models.user import User, UserVerify
import app

class SendVerifyEmail(Resource):
    def post(self):
        user_email = str(request.get_json()['user_email']).strip(' ')
        user = User.query.filter_by(email=user_email).first()
        if user:
            return {'valid': False, 'message': "This email had been taken."}
        else: # new user
            v_code = str(random.randint(100000, 999999)).zfill(6)
            expired_time = (datetime.now() + timedelta(hours=1)).strftime("%Y-%m-%d %H:%M:%S")
            if UserVerify.query.filter_by(email=user_email).first():
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
    