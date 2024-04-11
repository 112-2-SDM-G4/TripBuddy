from . import db

class Ledger(db.Model):
    __tablename__ = 'Ledger'
    ledger_id = db.Column(db.Integer, primary_key=True)
    # name = db.Column(db.String(50), nullable=False)
    # time = db.Column(db.DateTime, nullable=False)
    # total_price = db.Column(db.Float, nullable=False)

    # def __init__(self, name, time, total_price):
        # self.name = name
        # self.time = time
        # self.total_price = total_price

    @staticmethod
    def get_by_id(id):
        return Ledger.query.get(id)
    
    @staticmethod
    def create(data):
        ledger = Ledger()
        db.session.add(ledger)
        db.session.commit()
        return ledger
    
    @staticmethod
    def update(id, data):
        ledger = Ledger.query.get(id)
        # ledger.name = data['name']
        # ledger.time = data['time']
        # ledger.total_price = data['total_price']
        db.session.commit()
        return ledger
    
    @staticmethod
    def delete(id):
        ledger = Ledger.query.get(id)
        db.session.delete(ledger)
        db.session.commit()
        return ledger