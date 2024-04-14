from flask_restful import Api
from flask_mail import Mail

from app import create_app
from app.models import init_db
from app.routes import initialize_routes

app = create_app()

mail = Mail(app)
db = init_db(app)
api = Api(app)

# bcrypt = Bcrypt(app)
# login_manager = LoginManager(app)

initialize_routes(api)

if __name__ == '__main__':
    app.run(debug = True)

# from app.main import main_blueprint
# app.register_blueprint(main_blueprint) 