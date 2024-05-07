import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import TransactionItem from './TransactionItem';
import TransactionDetail from './TransactionDetail';
import { fetchWithJwt } from '../hooks/fetchWithJwt';
import style from './TransactionsList.module.css';

const TransactionsList = ({ transactions, currentUser, onDeleteTransaction, findCurrencySymbol }) => {
    const [showDetail, setShowDetail] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);  // Store the selected transaction
    const [groupMembers, setGroupMembers] = useState([]);

    const { id } = useParams();

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetchWithJwt(`/api/v1/group/set_group_member?trip_id=${id}`, 'GET');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.trip_member_info && data.trip_member_info.length > 0) {
                    setGroupMembers(data.trip_member_info);
                }
            } catch (error) {
                console.error('Failed to fetch group members:', error);
            }
        };

        fetchGroupMembers();
    }, [id]);


    const handleTransactionClick = (transaction) => {
        console.log(transaction);
        setSelectedTransaction(transaction);
        setShowDetail(true);
    };

    const handleCloseDetail = () => {

        setSelectedTransaction(null);
        setShowDetail(false);
    };

    const handleDelete = (transactionId) => {
        // Call the passed delete handler from Ledger
        onDeleteTransaction(transactionId);
        setShowDetail(false);  // Optionally close the detail view
    };


    return (
        <div className={style.transactionsList}>
            {showDetail && selectedTransaction && (
                <>
                    <div className={style.overlay} onClick={handleCloseDetail}></div>
                    <TransactionDetail
                        schedule_id={id}
                        transactionId={selectedTransaction.transaction_id}
                        date={selectedTransaction.date}
                        currentUser={currentUser}
                        currency={selectedTransaction.currency}
                        symbol={findCurrencySymbol(selectedTransaction.currency)}
                        item_name={selectedTransaction.item_name}
                        payer={selectedTransaction.payer_name}
                        payees={selectedTransaction.payees}
                        amount={selectedTransaction.amount}
                        onClose={handleCloseDetail}
                        onDelete={() => handleDelete(selectedTransaction.transaction_id)}
                        groupMembers={groupMembers}
                    />
                </>

            )}
            {transactions.map(transaction => (
                <div className={style.transactionItem}>
                    <TransactionItem
                        key={transaction.transaction_id}
                        transaction_id={transaction.transaction_id}
                        date={transaction.date}
                        currentUser={currentUser}
                        currency={transaction.currency}
                        item_name={transaction.item_name}
                        payer={transaction.payer_name}
                        payees={transaction.payees}
                        amount={transaction.amount}
                        onClick={() => handleTransactionClick(transaction)}
                    />
                </div>
            ))}
        </div>
    );
};

export default TransactionsList;
