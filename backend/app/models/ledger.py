from app.models.create_db import db

class Ledger(db.Model):
    __tablename__ = 'Ledger'
    ledger_id = db.Column(db.Integer, primary_key=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('Schedule.schedule_id'), nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(50), nullable=False)

    # def __init__(self, name, time, total_price):
        # self.name = name
        # self.time = time
        # self.total_price = total_price

    @staticmethod
    def get_by_id(id):
        return Ledger.query.get(id)
    
    @staticmethod
    def create(data):
        ledger = Ledger(
            schedule_id = data['schedule_id'],
            item_name = data['item_name'],
            amount = data['amount'],
            currency = data['currency']
        )
        db.session.add(ledger)
        db.session.commit()
        return ledger
    
    @staticmethod
    def update(id, data):
        ledger = Ledger.query.get(id)
        ledger.schedule_id = data['schedule_id']
        ledger.item_name = data['item_name']
        ledger.amount = data['amount']
        ledger.currency = data['currency']
        db.session.commit()
        return ledger
    
    @staticmethod
    def delete(id):
        ledger = Ledger.query.get(id)
        db.session.delete(ledger)
        db.session.commit()
        return ledger