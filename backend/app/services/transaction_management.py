from typing import List, Dict
from app.models.transaction import Transaction
from app.models.relation_user_transaction import RelationUserTransaction
from app.models.schedule import Schedule
from app.models.user import User
from app.controllers.utils import *
from app.services.currency import change_currency


def get_all_transactions_of_schedule(schedule_id: int) -> List[Dict]:
    """Get all transaction records from a schedule"""
    records = []
    transactions = Transaction.get_by_schedule(schedule_id)
    if transactions is None:
        return [{}]
    for t in transactions:
        record = query_row_to_dict(t)
        d = datetime.strptime(record['date'], "%Y-%m-%d")
        record['date'] = d.strftime("%b %d")
        transaction_id = record['transaction_id']
        payees = []
        balances = RelationUserTransaction.get_by_transaction(transaction_id)
        for b in balances:
            b_record = query_row_to_dict(b)
            if b_record['pay'] == 'True':
                record['payer'] = User.get_by_id(b_record['user_id']).email
                record['payer_name'] = User.get_by_id(b_record['user_id']).user_name
            else:
                payee = {
                    'payee': User.get_by_id(b_record['user_id']).email,
                    'payee_name': User.get_by_id(b_record['user_id']).user_name,
                    'borrowed_amount': float(b_record['balance'])
                }
                payees.append(payee)
        record['payees'] = payees
        record['amount'] = float(record['amount'])
        record['transaction_id'] = int(record['transaction_id'])
        record.pop('schedule_id')
        records.append(record)
    return records


def sum_expenses_of_trip(schedule_id: int) -> float:
    """Get total costs of a trip"""
    standard = Schedule.get_by_id(schedule_id).standard
    total_cost = 0
    records = Transaction.get_by_schedule(schedule_id)
    for record in records:
        exchange = record.currency
        amount = float(record.amount)
        if exchange != standard:
            currency_rate = change_currency(standard)
            amount *= currency_rate
        total_cost += amount

    return total_cost


def group_balances(schedule_id: int):
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
