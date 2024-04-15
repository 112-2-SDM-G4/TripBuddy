from flask_jwt_extended import jwt_required, create_access_token
from flask_restful import Resource
from flask import request, make_response, jsonify
from app.models.user import User

class Test(Resource):
    def get(self):
        '''Create a test user and return a token for the user.'''

        self.create_testuser()
        return jsonify({"token": create_access_token(identity='test@gmail.com')})
        # return jsonify(token=123), 200
    
    def create_testuser(self):
        # check if testuser exists
        testuser = User.get_by_email('test@gmail.com')
        if testuser:
            return


        testuser = User.create({
            'user_name': 'testuser',
            'email': 'test@gmail.com',
            'hashed_password': 'test',
            'salt': 'test',
            'language': 'ZH_tw',
            'questionnaire': True
        })
        
        return