from app.models.create_db import db

class Schedule(db.Model):
    __tablename__ = 'Schedule' # default is the lowercase of the class name
    schedule_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    ledger_id = db.Column(db.Integer, db.ForeignKey('Ledger.ledger_id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('Post.post_id'), nullable=False)
    schedule_name = db.Column(db.String(50), nullable=False)
    start_date = db.Column(db.DateTime, nullable=False)
    end_date = db.Column(db.DateTime, nullable=False)
    public = db.Column(db.Boolean, nullable=False, default=False)
    create_time = db.Column(db.DateTime, nullable=False, default=db.func.now())
    update_time = db.Column(db.DateTime, nullable=True, onupdate=db.func.now())

    def __init__(self, led_id, post_id, schedule_name, start_date, end_date):
        self.ledger_id = led_id
        self.post_id = post_id
        self.schedule_name = schedule_name
        self.start_date = start_date
        self.end_date = end_date

    @staticmethod
    def get_all():
        return Schedule.query.all()
    
    @staticmethod
    def get_by_id(id):
        return Schedule.query.get(id)
    
    @staticmethod
    def create(data):
        schedule = Schedule(led_id=data['ledger_id'],
                            post_id=data['post_id'],
                            schedule_name=data['schedule_name'],
                            start_date=data['start_date'],
                            end_date=data['end_date'],
                            )
        db.session.add(schedule)
        db.session.commit()
        return schedule
    
    @staticmethod
    def update(id, data):
        schedule = Schedule.query.get(id)
        schedule.ledger_id = data['ledger_id']
        schedule.post_id = data['post_id']
        schedule.schedule_name = data['sch_name']
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