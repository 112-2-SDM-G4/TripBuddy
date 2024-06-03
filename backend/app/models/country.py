from app.models.create_db import db

class Country(db.Model):
    __tablename__ = 'Country'
    country_id = db.Column(db.Integer, primary_key=True)
    country_zh = db.Column(db.String(20), nullable=False)
    country_en = db.Column(db.String(20), nullable=False)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(10), nullable=False)

    @staticmethod
    def get_by_id(id):
        return Country.query.get(id)

    @staticmethod
    def get_name_zh(id):
        return Country.query.get(id).country_zh

    @staticmethod
    def get_currency(id):
        return Country.query.get(id).currency

    @staticmethod
    def get_lat_lng(id):
        data = Country.query.get(id)
        return data.lat, data.lng
