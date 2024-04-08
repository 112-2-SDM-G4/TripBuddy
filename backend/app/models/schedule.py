from . import db

class Schedule(db.Model):
    __tablename__ = 'Schedule' # default is the lowercase of the class name
    sch_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    led_id = db.Column(db.Integer, db.ForeignKey('ledger.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    sch_name = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    public = db.Column(db.Boolean, nullable=False)

    def __init__(self, led_id, post_id, sch_name, start_date, end_date, public):
        self.led_id = led_id
        self.post_id = post_id
        self.sch_name = sch_name
        self.start_date = start_date
        self.end_date = end_date
        self.public = public

    @staticmethod
    def get_all():
        return Schedule.query.all()
    
    @staticmethod
    def get_by_id(id):
        return Schedule.query.get(id)
    
    @staticmethod
    def create(data):
        schedule = Schedule(led_id=data['led_id'],
                            post_id=data['post_id'],
                            sch_name=data['sch_name'],
                            start_date=data['start_date'],
                            end_date=data['end_date'],
                            public=data['public'])
        db.session.add(schedule)
        db.session.commit()
        return schedule
    
    @staticmethod
    def update(id, data):
        schedule = Schedule.query.get(id)
        schedule.ledger_id = data['led_id']
        schedule.post_id = data['post_id']
        schedule.sch_name = data['sch_name']
        schedule.start_date = data['start_date']
        schedule.end_date = data['end_date']
        schedule.public = data['public']
        db.session.commit()
        return schedule
    
    @staticmethod
    def delete(id):
        schedule = Schedule.query.get(id)
        db.session.delete(schedule)
        db.session.commit()
        return schedule