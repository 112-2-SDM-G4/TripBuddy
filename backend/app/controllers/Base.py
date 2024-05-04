from flask_restful import Resource
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import request, make_response, jsonify

from app.controllers.utils import *
from app.models.tags import Tags

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
    
class GetTags(Resource):
    @jwt_required()
    def get(self):
        source = request.args.get('source')
        if source == 'UserProfile':
            filter_types = ['出遊風格', '出遊目的']
        else:
            filter_types = None

        tags = Tags.get_all(filter_types=filter_types)
        response_data = []

        type_groups = {}
        for tag in tags:
            type_name_zh = tag.type_zh
            if type_name_zh not in type_groups:
                type_groups[type_name_zh] = {
                    "type_name_en" : tag.type_en,
                    "options" : []
                }
            type_groups[type_name_zh]["options"].append({
                "tag_id" : tag.tag_id,
                "tag_name_zh" : tag.name_zh,
                "tag_name_en" : tag.name_en
            })

        for type_name_zh, type_data in type_groups.items():
            response_data.append({
                "type_name_zh" : type_name_zh,
                "type_name_en" : type_data["type_name_en"],
                "options" : type_data["options"]
            })
        return make_response(jsonify(response_data), 200)