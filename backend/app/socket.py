# import os
# from flask_socketio import SocketIO

# # set cors
# if os.environ.get("FLASK_ENV") == "production":
#     origins = "*"
#     # [
#     #     "http://planar-effect-420508.de.r.appspot.com",
#     #     "https://planar-effect-420508.de.r.appspot.com",
#     # ]
# else:
#     origins = "*" # allow localhost
    
# # create your SocketIO instance
# socketio = SocketIO(cors_allowed_origins=origins)
#                     # always_connect=True, async_mode="threading")