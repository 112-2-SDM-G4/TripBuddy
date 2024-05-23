import os
from flask_socketio import SocketIO
    
# create your SocketIO instance
socketio = SocketIO(cors_allowed_origins='*')