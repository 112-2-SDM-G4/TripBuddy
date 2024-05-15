from app.models.create_db import db

class RelationUserTransaction(db.Model):
    __tablename__ = 'Relation_User_Transaction'
    rut_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey('User.user_id'), nullable=False)
    transaction_id = db.Column(db.Integer, db.ForeignKey('Transaction.transaction_id'), nullable=False)
    pay = db.Column(db.Boolean, nullable=False)
    balance = db.Column(db.Float, nullable=False)

    def __init__(self, user_id, transaction_id, pay, balance):
        self.user_id = user_id
        self.transaction_id = transaction_id
        self.pay = pay
        self.balance = balance

    @staticmethod
    def get_by_transaction(transaction_id):
        return RelationUserTransaction.query.filter_by(transaction_id=transaction_id).all()
    
    @staticmethod
    def create(data):
        relation = RelationUserTransaction(
            user_id = data['user_id'],
            transaction_id = data['transaction_id'],
            pay = data['pay'],
            balance = data['balance']
        )
        db.session.add(relation)
        db.session.commit()
        return relation
    
    @staticmethod
    def delete(rut_id):
        relation = RelationUserTransaction.query.get(rut_id)
        db.session.delete(relation)
        db.session.commit()
        return relation
    
    @staticmethod
    def delete_by_transaction(transaction_id):
        relation = RelationUserTransaction.get_by_transaction(transaction_id)
        for i in relation:
            db.session.delete(i)
        db.session.commit()
        return relation