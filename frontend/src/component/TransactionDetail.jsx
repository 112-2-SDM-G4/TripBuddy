import React, { useState } from 'react';
import style from './TransactionDetail.module.css';  // Assume you have CSS for styling

const TransactionDetail = ({ transactionId, date, currentUser, currency, item_name, payer, payees, amount }) => {
    return (
        <div className={style.transactionDetail}>
            <div>{"Transaction ID: " + transactionId}</div>
            <div>{"Date: " + date}</div>
            <div>{"Item Name: " + item_name}</div>
            <div>{"Payer: " + payer }</div>
            <div>{"Amount: " + amount + " " + currency}</div>
            <div>{"Payees: " + payees.map(p => p.payee_name + " owes " + p.borrowed_amount).join(", ")}</div>
        </div>
    );
};

export default TransactionDetail;