import React, { useState } from 'react';
import style from './TransactionItem.module.css';  // Assume you have CSS for styling
import CountryData from "../assets/Country.json";
import TransactionDetail from './TransactionDetail';

const CashIcon = () => {
    return (
        <svg className={style.cashIcon} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">

            <g id="SVGRepo_bgCarrier" strokeWidth="0" />

            <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round" />

            <g id="SVGRepo_iconCarrier"> <g> <g> <path d="M60,47L60,47V1c0-0.6-0.4-1-1-1H15c-0.6,0-1,0.4-1,1v33h2V2h42v44H47c-0.6,0-1,0.4-1,1v11H16v-8h-2v9c0,0.6,0.4,1,1,1h32 c0.3,0,0.5-0.1,0.7-0.3l12-12c0.1-0.1,0.1-0.2,0.2-0.3v-0.1C60,47.2,60,47.1,60,47z M56.6,48l-4.3,4.3L48,56.6V48H56.6z" /> <rect x="19" y="5" width="8" height="2" /> <rect x="19" y="9" width="16" height="2" /> <rect x="19" y="18" width="21" height="2" /> <rect x="19" y="23" width="36" height="2" /> <rect x="19" y="28" width="36" height="2" /> <rect x="19" y="33" width="36" height="2" /> <rect x="19" y="49" width="18" height="2" /> <rect x="19" y="53" width="4" height="2" /> <path d="M30.3,45.9l6-2c0.4-0.1,0.7-0.5,0.7-0.9s-0.3-0.8-0.7-0.9l-6-2C30.2,40,30.1,40,30,40H4v-1h15v-2H3c-0.6,0-1,0.4-1,1v2H1 c-0.6,0-1,0.4-1,1v4c0,0.6,0.4,1,1,1h29C30.1,46,30.2,46,30.3,45.9z M2,42h6v2H2V42z M10,44v-2h19.8l3,1l-3,1H10z" /> <rect x="42" y="18" width="9" height="2" /> </g> </g> </g>

        </svg>
    )
};

const findCurrencySymbol = (currency) => {
    for (const place of CountryData.places) {
        if (place.money.en === currency) {
            return place.money.symbol; // Return the symbol if found
        }
    }
    return null; // Return null if no match is found
};




const TransactionItem = ({ transaction_id, date, currentUser, currency, item_name, payer, payees, amount }) => {
    let amountText, amountValue, amountColor = style.amountGray;
    const [showDetail, setShowDetail] = useState(false);
    const symbol = findCurrencySymbol(currency);
    if (payer === currentUser) {
        const totalLent = payees.reduce((acc, payee) => acc + (payee.payee_name === currentUser ? 0 : payee.borrowed_amount), 0);
        amountColor = style.amountGreen; // Green if current user paid
        amountText = "You lent";
        
        amountValue = `${symbol}${totalLent}`;
    } else {
        const currentUserPayee = payees.find(payee => payee.payee_name === currentUser);
        if (currentUserPayee) {
            amountColor = style.amountRed; // Red if current user needs to pay
            amountText = "You borrowed";
            amountValue = `${symbol}${currentUserPayee.borrowed_amount}`;
        } else {
            amountText = "Not involved";
            amountValue = ""; // No amount displayed
        }
    }

    const toggleDetail = () => {
        setShowDetail(!showDetail);
    };

    return (
        <>
            {showDetail &&
                <TransactionDetail 
                    transactionId={transaction_id}  // Assume transactionId is passed instead of key
                    date={date}
                    currentUser={currentUser}
                    currency={currency}
                    item_name={item_name}
                    payer={payer}
                    payees={payees}
                    amount={amount}
                />}
            {!showDetail &&
            <div className={`${style.transactionItem} ${showDetail ? style.activeItem : ''}`} onClick={toggleDetail}>
                <div className={style.date}>{date}</div>
                <CashIcon />
                <div className={style.details}>
                    <div className={style.textContent}>
                        <div className={style.title}>{item_name}</div>
                        <div className={style.paidBy}>{payer} paid {symbol}{amount}</div>
                    </div>
                    <div className={`${style.amount} ${amountColor}`}>
                        <div className={style.amountDescription}>{amountText}</div>
                        <div className={style.amountValue}>{amountValue}</div>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default TransactionItem;