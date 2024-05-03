from app.models.create_db import db

class RelationUserSch(db.Model):
    __tablename__ = 'Relation_User_Sch'
    rus_id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)
    schedule_id = db.Column(db.Integer, db.ForeignKey('Schedule.schedule_id'), nullable=False)
    access = db.Column(db.Boolean, nullable=False, default=False)
    heart = db.Column(db.Boolean, nullable=False, default=False)
    rate = db.Column(db.Integer, nullable=True)

    def __init__(self, user_id, schedule_id, access=False, heart=False, rate=None):
        self.user_id = user_id
        self.schedule_id = schedule_id
        self.access = access
        self.heart = heart
        self.rate = rate

    @staticmethod
    def create(data):
        relation = RelationUserSch(user_id=data['user_id'],
                                   schedule_id=data['schedule_id'],
                                   access=data['access'],
                                   heart=data['heart'],
                                   rate=data['rate'],
                                   )
        db.session.add(relation)
        db.session.commit()
        return relation
    
    @staticmethod
    def get_by_user(user_id):
        return RelationUserSch.query.filter_by(user_id=user_id).all()
    
    @staticmethod
    def get_by_user_schedule(user_id, schedule_id):
        return RelationUserSch.query.filter_by(user_id=user_id, schedule_id=schedule_id).first()
    
    @staticmethod
    def get_by_schedule(schedule_id):
        return RelationUserSch.query.filter_by(schedule_id=schedule_id, access = 1).all()



    @staticmethod
    def update(rus_id, data):
        relation = RelationUserSch.query.get(rus_id)
        if 'access' in data:
            relation.access = data['access']
        if 'heart' in data:
            relation.heart = data['heart']
        if 'rate' in data:
            relation.rate = data['rate']
        db.session.commit()
        return relation
    
    
    @staticmethod
    def delete(user_id, schedule_id):
        relation = RelationUserSch.query.filter_by(user_id=user_id, schedule_id=schedule_id).first()
        db.session.delete(relation)
        db.session.commit()
        return relation