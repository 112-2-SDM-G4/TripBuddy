from app.models.create_db import db

class Transaction(db.Model):
    __tablename__ = 'Transaction'
    transaction_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    schedule_id = db.Column(db.Integer, db.ForeignKey('Schedule.schedule_id'), nullable=False)
    item_name = db.Column(db.String(255), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    currency = db.Column(db.String(50), nullable=False)
    date = db.Column(db.DateTime, nullable=False)

    # def __init__(self, name, time, total_price):
        # self.name = name
        # self.time = time
        # self.total_price = total_price

    @staticmethod
    def get_by_id(id):
        return Transaction.query.get(id)
    
    @staticmethod
    def get_by_schedule(schedule_id):
        return Transaction.query.filter_by(schedule_id=schedule_id).all()
    
    @staticmethod
    def create(data):
        transaction = Transaction(
            schedule_id = data['schedule_id'],
            item_name = data['item_name'],
            amount = data['amount'],
            currency = data['currency'],
            date = data['date']
        )
        db.session.add(transaction)
        db.session.commit()
        return transaction
    
    @staticmethod
    def update(id, data):
        transaction = Transaction.query.get(id)
        transaction.schedule_id = data['schedule_id']
        transaction.item_name = data['item_name']
        transaction.amount = data['amount']
        transaction.currency = data['currency']
        transaction.date = data['date']
        db.session.commit()
        return transaction
    
    @staticmethod
    def delete(id):
        transaction = Transaction.query.get(id)
        db.session.delete(transaction)
        db.session.commit()
        return transaction