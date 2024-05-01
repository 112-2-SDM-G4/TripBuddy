import os
from typing import Tuple, Dict
from datetime import datetime, date, timedelta

from app.models.user import User
from app.models.relation_user_sch import RelationUserSch
from app.models.place import Place
from app.models.relation_spot_sch import RelationSpotSch
from app.models.tags import Tags
from app.models.relation_sch_tag import RelationSchTag
from app.services.google import GoogleMapApi

GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY')

def array_to_date(array):
    return date(array[0], array[1], array[2])

def date_to_array(date):
    return [date.year, date.month, date.day]

def check_date_status(start_date, end_date):
    # -1: past, 0: else, 1: current, 2: in 7 days
    today = datetime.now().date()
    if end_date < today:
        return -1
    elif start_date <= today and end_date >= today:
        return 1
    elif start_date < today + timedelta(days=7):
        return 2
    else:
        return 0
    
def str_to_array(string, t=','):
    if string == None:
        return []
    return string.split(t)

def array_to_str(array, t=','):
    return t.join(array)

def varify_user(user_email):
        user = User.get_by_email(user_email)
        if not user:
            return None
        return user.user_id
    
def user_owns_schedule(user_id, schedule_id):
    relation = RelationUserSch.get_by_user_schedule(user_id, schedule_id)
    if not relation or not relation.access:
        return False
    return True

def query_row_to_dict(row):
    if row:
        return {column.name: str(getattr(row, column.name)) for column in row.__table__.columns}
    else:
        return None

def get_trip_photo(trip):
        places_in_trip = RelationSpotSch.get_by_schedule(trip.schedule_id)
        for relation_spot_sch in places_in_trip:
            place = Place.get_by_google_place_id(relation_spot_sch.place_id).first()
            if place and place.image != None:
                return place.image
        return None

def get_trip_tags_id(trip):
    tags = []
    for tag_relation in RelationSchTag.get_by_schedule_id(trip.schedule_id):
        tag = Tags.get_by_id(tag_relation.tag_id)
        tags.append(tag.tag_id)
    return tags

def fetch_and_save_place(place_id: str, language: str) -> Tuple[int, Dict] :
    """Check place database, fetch it from google if not exists"""
    place = Place.get_by_google_place_id_and_language(place_id, language)
    if place:
        place_detail = query_row_to_dict(place)
        place_detail['address'] = place_detail['formatted_address']
        place_detail['regular_opening_hours'] = str_to_array(place_detail['regular_opening_hours'])
        place_detail.pop('id')
        place_detail.pop('language')
        place_detail.pop('place_summary')
        place_detail.pop('formatted_address')
        res_code = 200
    else:
        google_maps = GoogleMapApi(GOOGLE_MAPS_API_KEY)
        res_code, place_detail = google_maps.get_place_detail(place_id, language)

        # save to database
        new_place = place_detail.copy()
        new_place['formatted_address'] = new_place['address']
        new_place['place_summary'] = None
        new_place['language'] = language
        new_place.pop('address')
        if 'regular_opening_hours' in new_place:
            new_place['regular_opening_hours'] = array_to_str(new_place['regular_opening_hours'])
        Place.create(new_place)

    return res_code, place_detail
