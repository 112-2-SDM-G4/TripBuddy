import os
from flask_sqlalchemy import SQLAlchemy
from google.cloud.sql.connector import Connector

# Environment variables
INSTANCE_NAME = os.getenv("INSTANCE_NAME")
PUBLIC_IP_ADDRESS = os.getenv("DB_PUBLIC_IP_ADDRESS")
USER = os.getenv("DB_USER")
DB_NAME = os.getenv("DB_NAME")
DB_PASSWORD = os.getenv("DB_PASSWORD")

# initialize Python Connector object
connector = Connector()

# Python Connector database connection function
def getconn():
    conn = connector.connect(
        INSTANCE_NAME, # Cloud SQL Instance Connection Name
        "pymysql",
        user=USER,
        password=DB_PASSWORD,
        db=DB_NAME,
        ip_type="public"  # "private" for private IP
    )
    return conn



# initialize the app with the extension
db = SQLAlchemy()

def init_db(app):
    # configure Flask-SQLAlchemy to use Python Connector
    app.config['SQLALCHEMY_DATABASE_URI'] = "mysql+pymysql://"
    app.config['SQLALCHEMY_ENGINE_OPTIONS'] = {
        "creator": getconn
    }
    db.init_app(app)
    return db