from flask_restful import Resource
from flask import request, make_response
from typing import Dict
from app.controllers.utils import *
from app.services.currency import change_currency
from app.models.transaction import Transaction
from app.models.relation_user_transaction import RelationUserTransaction
from app.models.user import User

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
        transaction = request.get_json()
        print('yayaya')

        # save to Transaction table
        Transaction.create(transaction)
        transaction_id = query_row_to_dict(
            Transaction.query.filter_by(
                schedule_id=transaction['schedule_id'],
                item_name=transaction['item_name'],
            ).all()[-1]
        )['transaction_id']

        # save to Relation_User_Transaction
        # for payees
        payment_details = transaction['payees']
        receivables = 0
        for payment in payment_details:
            receivables += payment['amount']
            user_id = query_row_to_dict(User.get_by_email(payment['payee']))['user_id']
            RelationUserTransaction.create({
                    'user_id': user_id,
                    'transaction_id': transaction_id,
                    'pay': False,
                    'balance': payment['amount'],
                }
            )
        # for payer
        RelationUserTransaction.create({
                'user_id': query_row_to_dict(User.get_by_email(transaction['payer']))['user_id'],
                'transaction_id': transaction_id,
                'pay': True,
                'balance': receivables,
            }
        )
        return make_response({'message': "success!"}, 200)
