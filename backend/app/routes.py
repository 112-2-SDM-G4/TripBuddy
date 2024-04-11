# import your controller here
from app.controllers.TripManager import TripManager
from tests.test import Test
from app.controllers.Base import ExampleController
from app.controllers.PlaceManager import PlaceSearch, PlaceDetail
from flask_restful import Api

BASE_ROUTE = '/api/v1'

# Add routes for controllers here
def initialize_routes(api: Api):
    api.add_resource(ExampleController, f'{BASE_ROUTE}/example/<string:id>')
    api.add_resource(TripManager, 
                     f'{BASE_ROUTE}/trip', 
                     f'{BASE_ROUTE}/trip/<string:id>')
    api.add_resource(PlaceSearch, f'{BASE_ROUTE}/placesearch')
    api.add_resource(PlaceDetail, f'{BASE_ROUTE}/placedetail')
    api.add_resource(Test, f'{BASE_ROUTE}/test')