import React from 'react';
import TransactionItem from './TransactionItem';
import style from './TransactionsList.module.css';  // Assume you have CSS for styling

const TransactionsList = ({ transactions, currentUser }) => {
    return (
        <div className={style.transactionsList}>
            {transactions.map(transaction => (
                <TransactionItem
                    key={transaction.transaction_id}
                    date={transaction.date}
                    currentUser={currentUser}
                    currency={transaction.currency}
                    item_name={transaction.item_name}
                    payer={transaction.payer_name}
                    payees={transaction.payees}
                    amount={transaction.amount}
                />
            ))}
        </div>    
    );
};

export default TransactionsList;