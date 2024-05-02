from flask_restful import Resource
from flask import request, make_response
from typing import Dict
from datetime import datetime
from app.controllers.utils import *
from app.services.currency import change_currency
from app.services.transaction_management import get_all_transactions_of_schedule, sum_expenses_of_trip, group_balances
from app.models.transaction import Transaction
from app.models.relation_user_transaction import RelationUserTransaction
from app.models.user import User
from app.models.schedule import Schedule

class Currency(Resource):
    def get(self) -> Dict:
        standard = request.args.get('standard')
        exchange = request.args.get('exchange')
        exchange_rate = change_currency(standard, exchange)
        if exchange_rate:
            return make_response({'exchange_rate': exchange_rate}, 200)
        else:
            return make_response({'exchange_rate': exchange_rate}, 400)

class ManageTransaction(Resource):
    # @jwt_required()
    def post(self) -> Dict:
        """Add new transaction record"""
        transaction = request.get_json()
        transaction['date'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # save to Transaction table
        Transaction.create(transaction)
        transaction_id = Transaction.query.filter_by(
                schedule_id=transaction['schedule_id'],
                item_name=transaction['item_name'],
            ).all()[-1].transaction_id

        # save to Relation_User_Transaction
        # for payees
        payment_details = transaction['payees']
        receivables = 0
        for payment in payment_details:
            receivables += payment['amount']
            user_id = User.get_by_email(payment['payee']).user_id
            RelationUserTransaction.create({
                    'user_id': user_id,
                    'transaction_id': transaction_id,
                    'pay': False,
                    'balance': payment['amount'],
                }
            )
        # for payer
        RelationUserTransaction.create({
                'user_id': User.get_by_email(transaction['payer']).user_id,
                'transaction_id': transaction_id,
                'pay': True,
                'balance': receivables,
            }
        )
        return make_response({'message': "success!"}, 200)
    
    # @jwt_required()
    def delete(self):
        """Delete transaction records"""
        transaction_id = request.get_json()['transaction_id']
        # delete from Relation_User_Transaction
        records = RelationUserTransaction.query.filter_by(transaction_id=transaction_id).all()
        for record in records:
            RelationUserTransaction.delete(record.rut_id)
        
        # delete from Transaction
        Transaction.delete(transaction_id)

        return make_response({'message': "success!"}, 200)

    # @jwt_required()
    def get(self):
        """Get transaction records and details"""
        schedule_id = request.args.get('schedule_id')

        records = get_all_transactions_of_schedule(int(schedule_id))
        response = {
            'schedule_id': int(schedule_id),
            'records': records
        }
        return make_response(response, 200)

class CheckBalance(Resource):
    # @jwt_required()
    def get(self):
        schedule_id = request.args.get('schedule_id')
        results = group_balances(schedule_id)
        total_cost = sum_expenses_of_trip(schedule_id)
        standard = Schedule.get_by_id(schedule_id).standard
        response = {
            'standard': standard,
            'total_cost': total_cost,
            'result': results,
        }
        return make_response(response, 200)
