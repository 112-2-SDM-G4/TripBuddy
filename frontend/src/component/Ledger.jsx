import React, { useState, useEffect, useCallback } from "react";
import style from "./Ledger.module.css";
import TransactionsList from './TransactionsList';
import AddTransactionForm from './AddTransactionForm';
import CountryData from "../assets/Country.json";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import Button from "../component/Button";
import { IoChevronBack } from "react-icons/io5";

const findCurrencySymbol = (currency) => {
    return CountryData.places.find(place => place.money.en === currency)?.money.symbol || null;
};

const Ledger = ({ close, schedule_id, standard }) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user") || "{}").user_name || "defaultUser";
    const [totalCost, setTotalCost] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [checkBalance, setCheckBalance] = useState([]);
    const [balanceDetails, setBalanceDetails] = useState([]);
    const [currency, setCurrency] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [formAnimationClass, setFormAnimationClass] = useState('');


    // Refetching function that can be called on demand
    const refetchData = useCallback(async () => {
        const fetchDetailCost = async () => {
            const response = await fetchWithJwt(`/api/v1/ledger/manage_transaction?schedule_id=${schedule_id}`, 'GET');
            if (response.ok) {
                const data = await response.json();
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
                console.log(checkBalance);
            }
        };
        if (schedule_id) {
            await fetchDetailCost();
            await fetchTotalCost();
        }
    }, [schedule_id, fetchWithJwt]);


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
            setTimeout(() => setShowAddForm(false), 500);  // Match the animation duration
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
                        Transaction History
                    </div>

                    <div className={style.centerBlock}>
                        <span className={style.totalCost}>Total Trip Cost: {findCurrencySymbol(currency)}{parseFloat(totalCost).toFixed(2)}</span>
                        <ul>
                            {balanceDetails.map((balanceDetail, index) => (
                                <li key={index} className={`${style.detailItem} ${balanceDetail.status === 'owe' ? style.owe : style.owed}`}>
                                    {balanceDetail.status === 'owe' ?
                                        `You owe ${balanceDetail.associate_name} ${findCurrencySymbol(currency)}${parseFloat(balanceDetail.amount).toFixed(2)}` :
                                        `You are owed ${findCurrencySymbol(currency)}${parseFloat(balanceDetail.amount).toFixed(2)} by ${balanceDetail.associate_name}`}
                                </li>
                            ))}

                        </ul>
                        <TransactionsList transactions={transactions} currentUser={currentUser} />
                        <Button txt='Add a transaction' func={toggleAddForm} />
                    </div>
                </>
            ) : (
                <div className={formAnimationClass}>
                    <AddTransactionForm
                        toggleForm={toggleAddForm}
                        trip_id={schedule_id}
                        refetchData={refetchData}
                        standard={standard}
                    />
                </div>
            )}
        </div>
    );
};

export default Ledger;
