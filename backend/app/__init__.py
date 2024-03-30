import os

from flask import Flask
from flask_restful import Api, Resource
from app.routes import initialize_routes

app = Flask(__name__)
api = Api(app)

app.config['SECRET_KEY'] = "secretkey"
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# db = SQLAlchemy(app)
# bcrypt = Bcrypt(app)
# login_manager = LoginManager(app)

initialize_routes(api)


# from app.main import main_blueprint
# app.register_blueprint(main_blueprint) 