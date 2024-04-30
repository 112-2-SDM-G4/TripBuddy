from datetime import datetime, date, timedelta

from app.models.user import User
from app.models.relation_user_sch import RelationUserSch
from app.models.place import Place
from app.models.relation_spot_sch import RelationSpotSch
from app.models.tags import Tags
from app.models.relation_sch_tag import RelationSchTag

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
    return {column.name: str(getattr(row, column.name)) for column in row.__table__.columns}

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
