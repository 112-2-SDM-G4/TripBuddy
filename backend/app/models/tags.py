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
    
    @staticmethod
    def get_name_en(id):
        return Tags.query.get(id).name_en
    
    @staticmethod
    def get_all(filter_types=None):
        if filter_types:            
            query = Tags.query
            query = query.filter(Tags.type_zh.in_(filter_types))
            return query.all()
        else:
            return Tags.query.all()