import os
from flask_sqlalchemy import SQLAlchemy

db = None

def init_db(app):
    PASSWORD = os.environ.get('DB_PASSWORD')
    PUBLIC_IP_ADDRESS = os.environ.get('DB_PUBLIC_IP_ADDRESS')
    DBNAME = os.environ.get('DB_NAME')
    PROJECT_ID = os.environ.get('GCP_PROJECT_ID')
    INSTANCE_NAME = os.environ.get('GCP_INSTANCE_NAME')

    app.config['SQLALCHEMY_DATABASE_URI'] = f"mysql + mysqldb://root:{PASSWORD}@{PUBLIC_IP_ADDRESS}/{DBNAME}?unix_socket =/cloudsql/{PROJECT_ID}:{INSTANCE_NAME}"
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = os.environ.get('SQLALCHEMY_TRACK_MODIFICATIONS')

    db = SQLAlchemy(app)
    print("DB_URI :", app.config['SQLALCHEMY_DATABASE_URI'])