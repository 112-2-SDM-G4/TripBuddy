from flask_restful import Api
# from flask_mail import Mail
import os
from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app import create_app
from app.models.create_db import init_db
from app.routes import initialize_routes
from app.services.mail import init_mail

# app = create_app()
app = Flask(__name__)
CORS(app)

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

INSTANCE_NAME = os.getenv("INSTANCE_NAME")
PUBLIC_IP_ADDRESS = os.getenv("DB_PUBLIC_IP_ADDRESS")
USER = os.getenv("DB_USER")
DB_NAME = os.getenv("DB_NAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")


jwt = JWTManager()
jwt.init_app(app)

mail = init_mail(app)
db = init_db(app)

# bcrypt = Bcrypt(app)
# login_manager = LoginManager(app)

initialize_routes(api)

if __name__ == '__main__':
    app.run(debug = True)

# from app.main import main_blueprint
# app.register_blueprint(main_blueprint) 