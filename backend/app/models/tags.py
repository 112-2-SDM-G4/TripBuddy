from app.models.create_db import db

class Tags(db.Model):
    __tablename__ = 'Tags'
    tag_id = db.Column(db.Integer, primary_key=True)
    name_zh = db.Column(db.String(50), nullable=False)
    type_zh = db.Column(db.String(50), nullable=False)
    name_en = db.Column(db.String(30), nullable=True)
    type_en = db.Column(db.String(30), nullable=True)

    @staticmethod
    def get_by_id(id):
        return Tags.query.get(id)
    
    @staticmethod
    def get_by_name_zh(name_zh):
        return Tags.query.filter_by(name_zh=name_zh).first()