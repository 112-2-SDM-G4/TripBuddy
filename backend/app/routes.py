# import your controller here
from app.controllers.TripManager import TripManager
from tests.test import Test
from app.controllers.Base import ExampleController
from app.controllers.PlaceManager import PlaceSearch, PlaceDetail
from app.controllers.UserManager import SendVerifyEmail, UserVerification
from flask_restful import Api

BASE_ROUTE = '/api/v1'

# Add routes for controllers here
def initialize_routes(api: Api):
    api.add_resource(ExampleController, f'{BASE_ROUTE}/example/<string:id>')
    api.add_resource(TripManager, 
                     f'{BASE_ROUTE}/trip',
                     f'{BASE_ROUTE}/trip/<string:trip_id>')
    api.add_resource(PlaceSearch, f'{BASE_ROUTE}/place/search')
    api.add_resource(PlaceDetail, f'{BASE_ROUTE}/place/detail')
    api.add_resource(SendVerifyEmail, f'{BASE_ROUTE}/user/send_email')
    api.add_resource(UserVerification, f'{BASE_ROUTE}/user/verify')
    api.add_resource(Test, f'{BASE_ROUTE}/test')
