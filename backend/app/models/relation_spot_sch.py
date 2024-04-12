from . import db

class RelationSpotSch(db.Model):
    __tablename__ = 'Relation_Spot_Sch'
    rss_id = db.Column(db.Integer, primary_key=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('Schedule.schedule_id'), nullable=False)
    place_id = db.Column(db.String(50), db.ForeignKey('Place.place_id'), nullable=False)
    order = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(100), nullable=True)
    money = db.Column(db.Integer, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Integer, nullable=False)
    period_hours = db.Column(db.Integer, nullable=False)
    period_minutes = db.Column(db.Integer, nullable=False)

    @staticmethod
    def fill_nullables(data):
        nullable = ['comment', 'money']
        for key in nullable:
            if key not in data:
                data[key] = None
        return data

    @staticmethod
    def get_by_spot_schedule(schedule_id, place_id):
        return RelationSpotSch.query.filter_by(schedule_id=schedule_id, place_id=place_id).first()
    
    @staticmethod
    def create(data):
        data = RelationSpotSch.fill_nullables(data)
        relation = RelationSpotSch(schedule_id=data['schedule_id'],
                                   place_id=data['place_id'],
                                   order=data['order'],
                                   comment=data['comment'],
                                   money=data['money'],
                                   category=data['category'],
                                   date=data['date'],
                                   period_hours=data['period_hours'],
                                   period_minutes=data['period_minutes'],
                                   )
        db.session.add(relation)
        db.session.commit()
        return relation

    @staticmethod
    def update(schedule_id, place_id, data):
        data = RelationSpotSch.fill_nullables(data)
        relation = RelationSpotSch.query.filter_by(schedule_id=schedule_id, place_id=place_id).first()
        relation.order = data['order']
        relation.comment = data['comment']
        relation.money = data['money']
        relation.category = data['category']
        relation.date = data['date']
        relation.period_hours = data['period_hours']
        relation.period_minutes = data['period_minutes']
        db.session.commit()
        return relation