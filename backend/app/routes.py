# import your controller here
from app.controllers.example import ExampleController

BASE_ROUTE = '/api/v1'

# Add routes for controllers here
def initialize_routes(api):
    api.add_resource(ExampleController, f'{BASE_ROUTE}/example/<string:id>')