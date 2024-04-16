from app.models.create_db import db

class RelationSpotSch(db.Model):
    __tablename__ = 'Relation_Spot_Sch'
    rss_id = db.Column(db.Integer, primary_key=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('Schedule.schedule_id'), nullable=False)
    place_id = db.Column(db.String(50), db.ForeignKey('Place.place_id'), nullable=False)
    order = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.String(100), nullable=True)
    money = db.Column(db.Float, nullable=True)
    category = db.Column(db.String(50), nullable=False)
    date = db.Column(db.Integer, nullable=False)
    period_hours = db.Column(db.Integer, nullable=False)
    period_minutes = db.Column(db.Integer, nullable=False)

    @staticmethod
    def fill_nullables(data):
        nullable = ['comment', 'money']
        for key in nullable:
            if key not in data or data[key] == '':
                data[key] = None
        return data
    
    @staticmethod
    def get_by_relation_id(relation_id):
        return RelationSpotSch.query.get(relation_id)

    @staticmethod
    def get_by_schedule(schedule_id):
        return RelationSpotSch.query.filter_by(schedule_id=schedule_id).all()

    @staticmethod
    def get_by_spot_schedule(schedule_id, place_id):
        return RelationSpotSch.query.filter_by(schedule_id=schedule_id, place_id=place_id).first()
    
    @staticmethod
    def get_by_after_order(schedule_id, date,  order):
        return RelationSpotSch.query.filter_by(schedule_id=schedule_id, date=date).filter(RelationSpotSch.order >= order).all()
    
    @staticmethod
    def get_max_order(schedule_id, date):
        max_relation = RelationSpotSch.query.filter_by(schedule_id=schedule_id, date=date).order_by(RelationSpotSch.order.desc()).first()
        if max_relation:
            max_order = max_relation.order
        else:
            max_order = 0

        return max_order
    
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
    def update(relation_id, data):
        # data = RelationSpotSch.fill_nullables(data)
        relation = RelationSpotSch.query.get(relation_id)
        if 'order' in data:
            relation.order = data['order']
        if 'comment' in data:
            relation.comment = data['comment']
        if 'money' in data:
            relation.money = data['money']
        if 'category' in data:
            relation.category = data['category']
        if 'date' in data:
            relation.date = data['date']
        if 'period_hours' in data:
            relation.period_hours = data['period_hours']
        if 'period_minutes' in data:
            relation.period_minutes = data['period_minutes']
        db.session.commit()
        return relation
    
    @staticmethod
    def update_order(schedule_id, date, order, increase=True):
        relations = RelationSpotSch.query.filter_by(schedule_id=schedule_id, date=date).filter(RelationSpotSch.order >= order).all()
        for relation in relations:
            if increase:
                relation.order += 1
            else:
                relation.order -= 1
        db.session.commit()
        return relations
    
    @staticmethod
    def delete_by_relation_id(relation_id):
        relation = RelationSpotSch.query.get(relation_id)
        db.session.delete(relation)
        db.session.commit()
        return relation

    @staticmethod
    def delete(schedule_id, place_id):
        relation = RelationSpotSch.query.filter_by(schedule_id=schedule_id, place_id=place_id).all()
        db.session.delete(relation)
        db.session.commit()
        return relation
    
    @staticmethod
    def delete_by_trip(schedule_id):
        relations = RelationSpotSch.query.filter_by(schedule_id=schedule_id).all()
        for relation in relations:
            db.session.delete(relation)
        db.session.commit()