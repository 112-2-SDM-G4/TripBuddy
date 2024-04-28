from app.models.create_db import db

class Place(db.Model):
    __tablename__ = 'Place'
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    place_id = db.Column(db.String(255), nullable=False)
    name = db.Column(db.String(50), nullable=False)
    formatted_address = db.Column(db.String(500), nullable=False)
    google_map_uri = db.Column(db.String(500), nullable=False)
    place_summary = db.Column(db.String(500), nullable=True)
    regular_opening_hours = db.Column(db.String(500), nullable=True)
    rating  = db.Column(db.Float, nullable=True)
    user_rating_count = db.Column(db.Integer, nullable=True)
    image = db.Column(db.String(511), nullable=True)
    language = db.Column(db.String(50), nullable=False)

    def __init__(self, place_id, name, formatted_address, google_map_uri, place_summary, regular_opening_hours, rating, user_rating_count, image, language):
        self.place_id = place_id
        self.name = name
        self.formatted_address = formatted_address
        self.google_map_uri = google_map_uri
        self.place_summary = place_summary
        self.regular_opening_hours = regular_opening_hours
        self.rating = rating
        self.user_rating_count = user_rating_count
        self.image = image
        self.language = language

    #TODO: Warning! If query with google_place_id, it might return two results
    @staticmethod
    def get_by_id(id):
        return Place.query.get(id)
    
    @staticmethod
    def create(data):
        nullable = ['place_summary', 'regular_opening_hours', 'rating', 'user_rating_count', 'image']
        for key in nullable:
            if key not in data:
                data[key] = None
                
        place = Place(place_id=data['place_id'],
                      name=data['name'],
                      formatted_address=data['formatted_address'],
                      google_map_uri=data['google_map_uri'],
                      place_summary=data['place_summary'],
                      regular_opening_hours=data['regular_opening_hours'],
                      rating=data['rating'],
                      user_rating_count=data['user_rating_count'],
                      image=data['image'],
                      language=data['language'],
                      )
        db.session.add(place)
        db.session.commit()
        return place

