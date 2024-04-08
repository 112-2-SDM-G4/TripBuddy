# import your controller here
from app.controllers.example import ExampleController
from app.controllers.PlaceManager import PlaceSearch
from flask_restful import Api

BASE_ROUTE = '/api/v1'

# Add routes for controllers here
def initialize_routes(api: Api):
    api.add_resource(ExampleController, f'{BASE_ROUTE}/example/<string:id>')
    api.add_resource(PlaceSearch, f'{BASE_ROUTE}/placesearch')