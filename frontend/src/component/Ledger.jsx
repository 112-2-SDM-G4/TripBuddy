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

const Ledger = ({ close, schedule_id }) => {
    const currentUser = JSON.parse(sessionStorage.getItem("user")).user_name;

    const [totalCost, setTotalCost] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [checkBalance, setCheckBalance] = useState({});
    const [balanceDetails, setBalanceDetails] = useState([]);
    const [currency, setCurrency] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

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
                setCheckBalance(data);
            }
        };

        await fetchDetailCost();
        await fetchTotalCost();
    }, [schedule_id]);

    useEffect(() => {
        refetchData();
    }, [refetchData]);

    useEffect(() => {
        const userRecord = checkBalance.result?.find(user => user.user_name === currentUser);
        setBalanceDetails(userRecord ? userRecord.detail : []);
    }, [checkBalance, currentUser]);

    const toggleAddForm = () => {
        setShowAddForm(prev => !prev);

        if (!showAddForm) {
            refetchData();
        }
        
    };

    return (
        <div className={style.container}>
            {!showAddForm ? (
                <>
                    <IoChevronBack className={style.backButton} onClick={close} />
                    <h2 className={style.title}>Transaction History</h2>
                    <span className={style.totalCost}>Total Trip Cost: {findCurrencySymbol(currency)}{totalCost}</span>
                    <ul>
                        {balanceDetails.map((balanceDetail, index) => (
                            <li key={index} className={`${style.detailItem} ${balanceDetail.status === 'owe' ? style.owe : style.owed}`}>
                                {balanceDetail.status === 'owe' ? `You owe ${balanceDetail.associate_name} ${findCurrencySymbol(currency)}${balanceDetail.amount}` :
                                    `You are owed ${findCurrencySymbol(currency)}${balanceDetail.amount} by ${balanceDetail.associate_name}`}
                            </li>
                        ))}
                    </ul>
                    <TransactionsList transactions={transactions} currentUser={currentUser} />
                    <Button txt='Add a transaction' func={toggleAddForm} />
                </>
            ) : (
                <AddTransactionForm 
                    toggleForm={toggleAddForm} 
                    trip_id={schedule_id} 
                    refetchData={refetchData} 
                />
            )}
        </div>
    );
};

export default Ledger;
