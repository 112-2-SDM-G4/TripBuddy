from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request, make_response

from app.controllers.utils import *
from app.models.post import Post
from app.models.relation_sch_tag import RelationSchTag
from app.models.relation_user_sch import RelationUserSch
from app.models.schedule import Schedule
from app.models.tags import Tags

class HeartManager(Resource):
    @jwt_required()
    def post(self, trip_id):
        data = request.get_json()
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        if not Schedule.get_by_id(trip_id):
            return make_response({'message': 'Trip has not created.'}, 400)
        
        relation = RelationUserSch.get_by_user_schedule(user_id, trip_id)
        if not relation:
            RelationUserSch.create({
                'user_id': user_id,
                'schedule_id': trip_id,
                'heart': data['heart'],
                'access': False,
                'rate': None
            })
            return make_response({'message': 'Trip hearted successfully.'}, 200)
        else:
            RelationUserSch.update(relation.rus_id, {
                'heart': data['heart']
            })
            return make_response({'message': 'Trip hearted status updated.'}, 200)
        

class PostManager(Resource):
    @jwt_required()
    def get(self, trip_id=None):
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        if trip_id:
            if not Schedule.get_by_id(trip_id):
                return make_response({'message': 'Trip has not created.'}, 400)
            
            schedule = Schedule.get_by_id(trip_id)
            post = Post.get_by_id(schedule.post_id)
            tags = get_trip_tags_id(schedule)
            return make_response({
                'content': post.content,
                'public': schedule.public,
                'tags': tags
            }, 200)
        else:
            # get all hearted trips and public trips
            hearted_trips = []
            public_trips = []

            for relation in RelationUserSch.get_by_user(user_id):
                if relation.heart:
                    schedule = Schedule.get_by_id(relation.schedule_id)
                    hearted_trips.append({
                        'id': relation.schedule_id,
                        'name': schedule.schedule_name,
                        'image': get_trip_photo(schedule),
                        'tags_id': get_trip_tags_id(schedule)
                    })

            for schedule in Schedule.get_all_public():
                public_trips.append({
                    'id': schedule.schedule_id,
                    'name': schedule.schedule_name,
                    'image': get_trip_photo(schedule),
                    'tags_id': get_trip_tags_id(schedule)
                })

            return make_response({
                'hearted_trips': hearted_trips,
                'public_trips': public_trips
            }, 200)

    @jwt_required()
    def post(self):
        # search post by tags and keyword
        data = request.get_json()
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        tags = data['tags_id']
        keyword = data['keyword']
        search_result = []

        matched_keyword_schedules = Schedule.search_by_name(keyword)

        for schedule in matched_keyword_schedules:
            tags_in_schedule = get_trip_tags_id(schedule)
            if all(tag in tags_in_schedule for tag in tags) :
                search_result.append({
                    'id': schedule.schedule_id,
                    'name': schedule.schedule_name,
                    'image': get_trip_photo(schedule),
                    'tags_id': tags_in_schedule
                })

        return make_response({
            'search_result': search_result
        }, 200)



    @jwt_required()
    def put(self, trip_id):
        data = request.get_json()
        user_id = varify_user(get_jwt_identity())
        if user_id == None:
            return make_response({'message': 'User not found.'}, 400)
        
        if not Schedule.get_by_id(trip_id):
            return make_response({'message': 'Trip has not created.'}, 400)
        
        if not user_owns_schedule(user_id, trip_id):
            return make_response({'message': 'User does not have access to this trip.'}, 403)
        
        schedule = Schedule.get_by_id(trip_id)
        post = Post.get_by_id(schedule.post_id)

        Schedule.update(trip_id, {
            'public': data['public']
        })
        print(f"Trip public set to {data['public']}")

        Post.update(post.post_id, {
            'content': data['content']
        })
        print(f'Post content updated')

        # delete all tag relation except the nation tag
        # insert new tag relation
        all_tag_relations = RelationSchTag.get_by_schedule_id(trip_id)
        for tag_relation in all_tag_relations:
            tag = Tags.get_by_id(tag_relation.tag_id)
            if tag.type_zh != '國家':
                RelationSchTag.delete(tag_relation.rst_id)
        print(f'Old tag relations deleted')

        ## delete all old tag relation
        RelationSchTag.delete_by_trip(trip_id)

        for tag in data['tags_id']:
            RelationSchTag.create({
                'schedule_id': trip_id,
                'tag_id': tag
            })
        print(f'New tag relations created')

        return make_response({'message': 'Post updated successfully.'}, 200)
