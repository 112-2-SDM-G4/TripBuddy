import os
from dotenv import load_dotenv

from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager

from app.models import init_db
from app.routes import initialize_routes

app = Flask(__name__)
api = Api(app)

load_dotenv()
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')

jwt = JWTManager()
jwt.init_app(app)


init_db(app)

# bcrypt = Bcrypt(app)
# login_manager = LoginManager(app)

initialize_routes(api)


# from app.main import main_blueprint
# app.register_blueprint(main_blueprint) 