from typing import List, Dict
from app.models.transaction import Transaction
from app.models.relation_user_transaction import RelationUserTransaction
from app.controllers.utils import *


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
