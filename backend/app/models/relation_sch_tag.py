from app.models.create_db import db

class RelationSchTag(db.Model):
    __tablename__ = 'Relation_Sch_Tag'
    rst_id = db.Column(db.Integer, primary_key=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('Schedule.schedule_id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('Tags.tag_id'), nullable=False)

    @staticmethod
    def create(data):
        relation_sch_tag = RelationSchTag(
            schedule_id = data['schedule_id'],
            tag_id = data['tag_id']
        )
        db.session.add(relation_sch_tag)
        db.session.commit()
        return relation_sch_tag
    
    @staticmethod
    def get_by_schedule_id(schedule_id):
        return RelationSchTag.query.filter_by(schedule_id=schedule_id).all()
    
    @staticmethod
    def delete_by_trip(schedule_id):
        relation_sch_tag = RelationSchTag.query.filter_by(schedule_id=schedule_id).all()
        for i in relation_sch_tag:
            db.session.delete(i)
        db.session.commit()
        return relation_sch_tag