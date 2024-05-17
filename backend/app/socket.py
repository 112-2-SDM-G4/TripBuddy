import os
from flask_socketio import SocketIO

# set cors
if os.environ.get("FLASK_ENV") == "production":
    origins = [
        "http://tripbuddy-frontend-repx5qxhzq-de.a.run.app",
        "https://tripbuddy-frontend-repx5qxhzq-de.a.run.app"
    ]
else:
    origins = "*" # allow localhost
    
# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins=origins)