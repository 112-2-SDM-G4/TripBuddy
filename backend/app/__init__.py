import os
from dotenv import load_dotenv
# from .socket import socketio
from flask_socketio import SocketIO

from flask import Flask
from flask_jwt_extended import JWTManager

socketio = SocketIO(cors_allowed_origins="*",always_connect=True, async_mode="threading")
def create_app():
    app = Flask(__name__)
    

    load_dotenv()
    app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
    app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER')
    app.config['MAIL_PORT'] = os.getenv('MAIL_PORT')
    app.config['MAIL_USE_TLS'] = os.getenv('MAIL_USE_TLS')
    app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
    app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
    app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
    app.config['JWT_TOKEN_LOCATION'] = ['headers','query_string']

    jwt = JWTManager()
    jwt.init_app(app)

    socketio.init_app(app, cors_allowed_origins="*")

    return app
