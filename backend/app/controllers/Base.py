from flask_restful import Resource
from flask import request

class ExampleController(Resource):
    def get(self, id=None):
        return {'data': 'Hello, World!'}
    
    def post(self, id):
        other_data = request.get_json().get('other_data')
        return {'message': f'Hello, {id}!',
                'other_data': other_data}
    
    def put(self, id):
        other_data = request.get_json().get('other_data')
        return {'message': f'Hello, {id}!',
                'other_data': other_data}
    
    def delete(self, id):
        return {'message': f'Goodbye, {id}!'}