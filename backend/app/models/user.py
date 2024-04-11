# from models import db
# from google.cloud.sql.connector import Connector, IPTypes
# import sqlalchemy
from . import db

class User(db.Model):
    __tablename__ = 'User'
    user_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False, unique=True)
    hashed_password = db.Column(db.String(255), nullable=False)
    salt = db.Column(db.String(50), nullable=False)
    language = db.Column(db.String(50), nullable=False)
    questionnaire = db.Column(db.Boolean, nullable=False, default=False)

    def __init__(self, user_name, email, hashed_password, salt, language, questionnaire):
        self.user_name = user_name
        self.email = email
        self.hashed_password = hashed_password
        self.salt = salt
        self.language = language
        self.questionnaire = questionnaire

    @staticmethod
    def get_all():
        return User.query.all()
    
    @staticmethod
    def get_by_id(id):
        return User.query.get(id)
    
    @staticmethod
    def get_by_email(email):
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def create(data):
        user = User(user_name=data['user_name'],
                    email=data['email'],
                    hashed_password=data['hashed_password'],
                    salt=data['salt'],
                    language=data['language'],
                    questionnaire=data['questionnaire'],
                    )
        db.session.add(user)
        db.session.commit()
        return user


class UserVerify(db.Model):
    __tablename__ = "User_Verify_Code"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    verification_code = db.Column(db.String(50), nullable=False)
    expired_time = db.Column(db.DateTime, nullable=False)

    def __init__(self, email, v_code, expired_time):
        self.email = email
        self.verification_code = v_code
        self.expired_time = expired_time
    
    @staticmethod
    def update(email, data):
        user = UserVerify.query.filter_by(email=email).first()
        user.verification_code = data['v_code']
        user.expired_time = data['expired_time']
        db.session.commit()
