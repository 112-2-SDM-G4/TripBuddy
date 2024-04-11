import os
from dotenv import load_dotenv

from flask import Flask
from flask_mail import Mail
from flask_restful import Api, Resource
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api
from flask_jwt_extended import JWTManager

from app.models import init_db
from app.routes import initialize_routes

app = Flask(__name__)
api = Api(app)

load_dotenv()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

jwt = JWTManager()
jwt.init_app(app)


mail = Mail(app)
db = init_db(app)

# bcrypt = Bcrypt(app)
# login_manager = LoginManager(app)

initialize_routes(api)


# from app.main import main_blueprint
# app.register_blueprint(main_blueprint) 