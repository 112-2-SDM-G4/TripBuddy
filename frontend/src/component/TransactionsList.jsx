import React from 'react';
import TransactionItem from './TransactionItem';
import style from './TransactionsList.module.css';  // Assume you have CSS for styling

const TransactionsList = ({ transactions }) => {
    return (
        <div className={style.transactionsList}>
            {transactions.map(transaction => (
                <TransactionItem
                    key={transaction.id}
                    date={transaction.date}
                    currentUser={transaction.currentUser}
                    currency={transaction.currency}
                    item_name={transaction.item_name}
                    payer={transaction.payer}
                    payees={transaction.payees}
                    amount={transaction.amount}
                />
            ))}
        </div>    
    );
};

export default TransactionsList;