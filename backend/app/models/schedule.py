from app.models.create_db import db

class Schedule(db.Model):
    __tablename__ = 'Schedule' # default is the lowercase of the class name
    schedule_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    post_id = db.Column(db.Integer, db.ForeignKey('Post.post_id'), nullable=False)
    schedule_name = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    public = db.Column(db.Boolean, nullable=False, default=False)
    create_time = db.Column(db.DateTime, nullable=False, default=db.func.now())
    update_time = db.Column(db.DateTime, nullable=True, onupdate=db.func.now())
    location = db.Column(db.String(50), nullable=False)
    location_lng = db.Column(db.Float, nullable=False)
    location_lat = db.Column(db.Float, nullable=False)
    standard = db.Column(db.String(50), nullable=False)
    exchange = db.Column(db.String(50), nullable=True)

    def __init__(self, post_id, schedule_name, start_date, end_date, public, location, location_lng, location_lat, standard, exchange=None):
        self.post_id = post_id
        self.schedule_name = schedule_name
        self.start_date = start_date
        self.end_date = end_date
        self.public = public
        self.location = location
        self.location_lng = location_lng
        self.location_lat = location_lat
        self.standard = standard
        self.exchange = exchange

    @staticmethod
    def get_all():
        return Schedule.query.all()
    
    @staticmethod
    def get_all_public():
        return Schedule.query.filter_by(public=True).all()
    
    @staticmethod
    def get_by_id(id):
        return Schedule.query.get(id)
    
    @staticmethod
    def search_by_name(name):
        return Schedule.query.filter(Schedule.schedule_name.like('%'+name+'%'), Schedule.public==True).all()
        
    @staticmethod
    def create(data):
        schedule = Schedule(
                            post_id=data['post_id'],
                            schedule_name=data['schedule_name'],
                            start_date=data['start_date'],
                            end_date=data['end_date'],
                            location=data['location_name_zh'],
                            location_lng=data['location_lng'],
                            location_lat=data['location_lat'],
                            standard=data['standard'],
                            exchange=data['exchange']
                            )
        db.session.add(schedule)
        db.session.commit()
        return schedule
    
    @staticmethod
    def update(id, data):
        schedule = Schedule.query.get(id)
        schedule.public = data['public']
        db.session.commit()
        return schedule
    
    @staticmethod
    def delete(id):
        schedule = Schedule.query.get(id)
        db.session.delete(schedule)
        db.session.commit()
        return schedule