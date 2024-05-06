from app.models.create_db import db

class RelationUserTag(db.Model):
    __tablename__ = 'Relation_User_Tag'
    rut_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('Tags.tag_id'), nullable=False)

    @staticmethod
    def create(data):
        relation_user_tag = RelationUserTag(
            user_id = data['user_id'],
            tag_id = data['tag_id']
        )
        db.session.add(relation_user_tag)
        db.session.commit()
        return relation_user_tag
    
    @staticmethod
    def get_by_user_id(user_id):
        return RelationUserTag.query.filter_by(user_id=user_id).all()
    
    @staticmethod
    def delete_by_user(user_id):
        relation_user_tag = RelationUserTag.query.filter_by(user_id=user_id).all()
        for i in relation_user_tag:
            db.session.delete(i)
        db.session.commit()
        return relation_user_tag