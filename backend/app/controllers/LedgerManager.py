from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_restful import Resource
from flask import request, make_response
from typing import Dict
from datetime import datetime
from app.controllers.utils import *
from app.services.currency import change_currency
from app.models.transaction import Transaction
from app.models.relation_user_transaction import RelationUserTransaction
from app.models.user import User
from app.models.schedule import Schedule
from app.controllers.utils import user_owns_schedule

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
    @jwt_required()
    def post(self) -> Dict:
        user_id = varify_user(get_jwt_identity())

        """Add new transaction record"""
        transaction = request.get_json()
        transaction['date'] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        schedule_id = transaction['schedule_id']

        if not Schedule.get_by_id(schedule_id):
            return make_response({"message": "Schedule not found"}, 400)
        
        if not user_owns_schedule(user_id, schedule_id):
            return make_response({"message": "User access forbidden"}, 403)

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
    
    @jwt_required()
    def delete(self):
        user_id = varify_user(get_jwt_identity())

        schedule_id = request.get_json()['schedule_id']

        if not Schedule.get_by_id(schedule_id):
            return make_response({"message": "Schedule not found"}, 400)
        
        if not user_owns_schedule(user_id, schedule_id):
            return make_response({"message": "User access forbidden"}, 403)

        """Delete transaction records"""
        transaction_id = request.get_json()['transaction_id']

        if not Transaction.get_by_id_schedule(transaction_id, schedule_id):
            return make_response({"message": "This transaction record does not belong to this schedule"}, 400)

        # delete from Relation_User_Transaction
        records = RelationUserTransaction.query.filter_by(transaction_id=transaction_id).all()
        for record in records:
            RelationUserTransaction.delete(record.rut_id)
        
        # delete from Transaction
        Transaction.delete(transaction_id)

        return make_response({'message': "success!"}, 200)

    @jwt_required()
    def get(self):
        user_id = varify_user(get_jwt_identity())

        """Get transaction records and details"""
        schedule_id = request.args.get('schedule_id')

        if not Schedule.get_by_id(schedule_id):
            return make_response({"message": "Schedule not found"}, 400)
        
        if not user_owns_schedule(user_id, schedule_id):
            return make_response({"message": "User access forbidden"}, 403)

        records = get_all_transactions_of_schedule(int(schedule_id))
        response = {
            'schedule_id': int(schedule_id),
            'records': records
        }

        return make_response(response, 200)

class CheckBalance(Resource):
    @jwt_required()
    def get(self):
        user_id = varify_user(get_jwt_identity())

        schedule_id = request.args.get('schedule_id')

        if not Schedule.get_by_id(schedule_id):
            return make_response({"message": "Schedule not found"}, 400)
        
        if not user_owns_schedule(user_id, schedule_id):
            return make_response({"message": "User access forbidden"}, 403)

        results = self.group_balances(schedule_id)
        total_cost = self.sum_expenses_of_trip(schedule_id)
        standard = Schedule.get_by_id(schedule_id).standard
        response = {
            'standard': standard,
            'total_cost': total_cost,
            'result': results,
        }
        
        return make_response(response, 200)

    def sum_expenses_of_trip(self, schedule_id: int) -> float:
        """Get total costs of a trip"""
        standard = Schedule.get_by_id(schedule_id).standard
        total_cost = 0
        records = Transaction.get_by_schedule(schedule_id)
        for record in records:
            exchange = record.currency
            amount = float(record.amount)
            if exchange != standard:
                currency_rate = change_currency(standard, exchange)
                amount *= currency_rate
            total_cost += amount

        return total_cost

    def group_balances(self, schedule_id: int):
        """Calculate shortest paths to settle up money"""
        # 1. 先把所有的帳目詳細資料撈出來，紀錄所有關係人的借款、欠款額
        # 2. 各自抵銷，結算出每個人是需要付錢 or 需要還錢
        # 3. 把需要付錢的和需要還錢的人分成兩半，配對還錢

        standard = Schedule.get_by_id(schedule_id).standard
        records = get_all_transactions_of_schedule(schedule_id)
        accounts = {}
        for record in records:
            exchange = record['currency']
            currency_rate = change_currency(standard, exchange) if exchange != standard else 1
            lent_amount = 0
            # people who borrowed money
            for payment in record['payees']:
                if payment['payee'] not in accounts.keys():
                    accounts[payment['payee']] = {
                        'lent': 0,
                        'borrowed': -payment['borrowed_amount'] * currency_rate,
                    }
                else:
                    accounts[payment['payee']]['borrowed'] -= payment['borrowed_amount'] * currency_rate
                lent_amount += payment['borrowed_amount'] * currency_rate
            # person who lent money
            if record['payer'] not in accounts.keys():
                accounts[record['payer']] = {
                    'lent': lent_amount,
                    'borrowed': 0
                }
            else:
                accounts[record['payer']]['lent'] += lent_amount
        

        to_receive = {}
        to_payback = {}
        for user, balance in accounts.items():
            accounts[user]['balance'] = balance['lent'] + balance['borrowed']
            if accounts[user]['balance'] > 0:
                to_receive[user] = accounts[user]['balance']
            elif accounts[user]['balance'] < 0:
                to_payback[user] = accounts[user]['balance']
        to_receive = dict(sorted(to_receive.items(), key=lambda x: -x[1]))
        to_payback = dict(sorted(to_payback.items(), key=lambda x: -x[1]))


        details = {}
        def update_record(details: dict, lender: str, borrower: str, amount: float) -> Dict:
            new_associate_for_lender = {
                'associate': borrower,
                'associate_name': User.get_by_email(borrower).user_name,
                'status': 'owed',
                'amount': amount,
            }
            new_associate_for_borrower = {
                'associate': lender,
                'associate_name': User.get_by_email(lender).user_name,
                'status': 'owe',
                'amount': amount,
            }
            if lender not in details.keys():
                details[lender] = []
            details[lender].append(new_associate_for_lender)

            if borrower not in details.keys():
                details[borrower] = []
            details[borrower].append(new_associate_for_borrower)
            return details
        
        while to_payback:
            borrower, debt = to_payback.popitem()
            while round(debt) != 0.0:
                lender, receivables = to_receive.popitem()
                if abs(debt) >= receivables:
                    debt += receivables # 把這個人的錢還完，還有欠（-）
                    details = update_record(details, lender, borrower, receivables)
                else:
                    receivables += debt # 在這個人身上還清了，但這人還有剩
                    to_receive.update({lender: receivables})
                    details = update_record(details, lender, borrower, abs(debt))
                    debt = 0.0
        
        results = []
        for user, detail in details.items():
            result = {
                "user": user,
                "user_name": User.get_by_email(user).user_name,
                "detail": detail,
            }
            results.append(result)

        return results
