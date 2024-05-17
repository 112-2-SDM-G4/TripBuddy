import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import style from "./Ledger.module.css";
import TransactionsList from './TransactionsList';
import AddTransactionForm from './AddTransactionForm';
import CountryData from "../assets/Country.json";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import Button from "../component/Button";
import { IoChevronBack } from "react-icons/io5";
import { useLanguage } from "../hooks/useLanguage";

const findCurrencySymbol = (currency) => {
    return CountryData.places.find(place => place.money.en === currency)?.money.symbol || null;
};

const Ledger = ({ close, schedule_id, exchange, showButton }) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}").user_name || "defaultUser";
    const [totalCost, setTotalCost] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [checkBalance, setCheckBalance] = useState([]);
    const [balanceDetails, setBalanceDetails] = useState([]);
    const [currency, setCurrency] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    
    const [formAnimationClass, setFormAnimationClass] = useState('');
    const { language } = useLanguage();

    const { id } = useParams();

    const words = {
        en: {
            ledger: 'Shared Ledger',
            trip_cost: 'Total Trip Cost:',
            owe: "You owe",
            owed: "You are owed by",
            addTransaction: 'Add a transaction'
        },
        zh: {
            ledger: '共享帳本',
            trip_cost: '旅程總花費:',
            owe: "您欠",
            owed: "應還您",
            addTransaction: '新增消費'

        }
    }



    // Refetching function that can be called on demand
    const refetchData = useCallback(async () => {
        const fetchDetailCost = async () => {
            const response = await fetchWithJwt(`/api/v1/ledger/manage_transaction?schedule_id=${schedule_id}`, 'GET');
            if (response.ok) {
                const data = await response.json();
                console.log('Detail cost: ', data.records);
                setTransactions(data.records);
            }
        };

        const fetchTotalCost = async () => {
            const response = await fetchWithJwt(`/api/v1/ledger/check_balance?schedule_id=${schedule_id}`, 'GET');
            if (response.ok) {
                const data = await response.json();
                setTotalCost(data.total_cost);
                setCurrency(data.standard);
                setCheckBalance(data.result);
                console.log("Balance:", data.result);
            }
        };
        if (schedule_id) {
            await fetchDetailCost();
            await fetchTotalCost();
        }
    }, [schedule_id]);


    useEffect(() => {
        refetchData();
    }, [refetchData]);

    useEffect(() => {
        if (checkBalance) {
            const userRecord = checkBalance.find(user => user.user_name === currentUser);
            setBalanceDetails(userRecord ? userRecord.detail : []);
        }
    }, [checkBalance, currentUser]);

    const toggleAddForm = () => {

        if (!showAddForm) {
            setFormAnimationClass(style.addFormEnter);
            setShowAddForm(true);

        } else {
            setFormAnimationClass(style.addFormExit);
            setTimeout(() => {
                setShowAddForm(false);
            }, 500);
        }
    };



    const handleDeleteTransaction = async (transactionId) => {
        try {
            const response = await fetchWithJwt('/api/v1/ledger/manage_transaction', 'DELETE', {
                schedule_id: id,
                transaction_id: transactionId
            });
            if (!response.ok) {
                throw new Error('Failed to delete the transaction');
            }
            // Refetch transaction list after deletion to update the UI
            await refetchData();
            console.log('Transaction deleted successfully');
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    return (
        <div className={style.container}>
            {!showAddForm ? (
                <>

                    <div className={`${style.title} ${style.ledgertitle}`}>
                        <IoChevronBack
                            className={`${style.backbt}`}
                            onClick={close}
                        />
                        {words[language]['ledger']}
                    </div>

                    <div className={style.centerBlock}>
                        <span className={style.totalCost}>{words[language]['trip_cost']} {findCurrencySymbol(currency)}{parseFloat(totalCost).toFixed(2)}</span>
                        <ul>
                            {balanceDetails.map((balanceDetail, index) => (
                                <li key={index} className={`${style.detailItem} ${balanceDetail.status === 'owe' ? style.owe : style.owed}`}>
                                    {language === 'en' ?
                                        `${words[language][balanceDetail.status]} ${balanceDetail.associate_name} ${findCurrencySymbol(currency)}${parseFloat(balanceDetail.amount).toFixed(2)}` :
                                        (balanceDetail.status === 'owe' ?
                                            `${words[language][balanceDetail.status]} ${balanceDetail.associate_name} ${findCurrencySymbol(currency)}${parseFloat(balanceDetail.amount).toFixed(2)}` :
                                            `${balanceDetail.associate_name} ${words[language][balanceDetail.status]} ${findCurrencySymbol(currency)}${parseFloat(balanceDetail.amount).toFixed(2)}`)
                                    }
                                </li>
                            ))}

                        </ul>
                        <div className={style.transactionField}>
                            <TransactionsList
                                transactions={transactions}
                                currentUser={currentUser}
                                onDeleteTransaction={handleDeleteTransaction}
                                findCurrencySymbol={findCurrencySymbol}
                                language={language}
                            />

                        </div>
                        {showButton && (
                            <div className={style.buttonContainer}>
                                <Button txt={words[language]['addTransaction']} func={toggleAddForm} />
                            </div>
                        )}


                    </div>
                </>
            ) : (
                <div className={formAnimationClass}>
                    <AddTransactionForm
                        toggleForm={toggleAddForm}
                        trip_id={schedule_id}
                        refetchData={refetchData}
                        exchange={exchange}
                        language={language}
                    />
                </div>
            )}
        </div>
    );
};

export default Ledger;
