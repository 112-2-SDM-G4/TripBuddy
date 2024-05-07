import React from 'react';
import style from './TransactionDetail.module.css';
import { FaTrash } from 'react-icons/fa';

const TransactionDetail = ({
    transactionId,
    date,
    currentUser,
    currency,
    symbol,
    item_name,
    payer,
    payees,
    amount,
    onClose,
    onDelete,
    groupMembers  // Ensure groupMembers is passed to the component
}) => {


    const getAvatar = (username) => groupMembers.find(member => member.user_name === username)?.user_avatar || 0;

    const handleDelete = async () => {
        onDelete(transactionId);  // Call the passed delete function from parent component
        onClose();
    };

    return (
        <div className={style.transactionDetail}>

            <button onClick={handleDelete} className={style.deleteButton}>
                <FaTrash />
            </button>
            <div className={style.detailHeader}>
                <img src={`../../${getAvatar(payer)}.png`} alt={payer + " avatar"} className={style.avatar} />
                <div className={style.detailText}>
                    <div><strong>{item_name}</strong></div>
                    <div>{payer}</div>

                </div>
                <div className={style.amountText}>{symbol + amount}</div>
            </div>
            <ul className={style.payeesList}>
                {payees.map(payee => (
                    <li key={payee.payee_email} className={style.payeeDetail}>
                        <img src={`../../${getAvatar(payee.payee_name)}.png`} alt={payee.payee_name + " avatar"} className={style.avatar} />
                        <span className={style.payeeName}>{payee.payee_name}</span>
                        <span className={style.payeeAmount}>{symbol + payee.borrowed_amount}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionDetail;
