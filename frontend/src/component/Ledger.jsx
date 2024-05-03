import React, { useState, useEffect } from "react";
import style from "./Ledger.module.css";
import TransactionsList from './TransactionsList';
import AddTransactionForm from './AddTransactionForm';
import CountryData from "../assets/Country.json";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import Button from "../component/Button";
import { IoChevronBack } from "react-icons/io5";

const currentUser = 'a';

const findCurrencySymbol = (currency) => {
    for (const place of CountryData.places) {
        if (place.money.en === currency) {
            return place.money.symbol; // Return the symbol if found
        }
    }
    return null; // Return null if no match is found
};



const Ledger = ({ close, schedule_id }) => {


    // const [totalCost, setTotalCost] = useState(0);
    // const [transactions, setTransactions] = useState([]);
    // const [balanceDetails, setBalanceDetails] = useState({});
    // const [currency, setCurrency] = useState('')
    const [showAddForm, setShowAddForm] = useState(false);

    const transactions = [
        {
            amount: 1000.0,
            currency: "TWD",
            date: "May 02",
            item_name: "鼎泰豐晚餐",
            payees: [
                {
                    borrowed_amount: 250.0,
                    payee: "b@gmail.com",
                    payee_name: "b"
                },
                {
                    borrowed_amount: 250.0,
                    payee: "c@gmail.com",
                    payee_name: "c"
                },
                {
                    borrowed_amount: 250.0,
                    payee: "d@gmail.com",
                    payee_name: "d"
                }
            ],
            payer: "a@gmail.com",
            payer_name: "a",
            transaction_id: 1
        },
        {
            amount: 300.0,
            currency: "TWD",
            date: "May 02",
            item_name: "50嵐",
            payees: [
                {
                    borrowed_amount: 60.0,
                    payee: "b@gmail.com",
                    payee_name: "b"
                },
                {
                    borrowed_amount: 70.0,
                    payee: "c@gmail.com",
                    payee_name: "c"
                },
                {
                    borrowed_amount: 90.0,
                    payee: "d@gmail.com",
                    payee_name: "d"
                }
            ],
            payer: "a@gmail.com",
            payer_name: "a",
            transaction_id: 2
        }
    ]

    const checkBalance = {
        standard: "TWD",
        total_cost: 2557.0,
        result: [
            {
                user: "c@gmail.com",
                user_name: "c",
                detail: [
                    {
                        amount: 622.75,
                        associate: "d@gmail.com",
                        associate_name: "d",
                        status: "owed"
                    }
                ]
            },
            {
                user: "d@gmail.com",
                user_name: "d",
                detail: [
                    {
                        amount: 622.75,
                        associate: "c@gmail.com",
                        associate_name: "c",
                        status: "owe"
                    },
                    {
                        amount: 31.5,
                        associate: "a@gmail.com",
                        associate_name: "a",
                        status: "owe"
                    }
                ]
            },
            {
                user: "a@gmail.com",
                user_name: "a",
                detail: [
                    {
                        amount: 31.5,
                        associate: "d@gmail.com",
                        associate_name: "d",
                        status: "owed"
                    },
                    {
                        amount: 624.25,
                        associate: "b@gmail.com",
                        associate_name: "b",
                        status: "owe"
                    }
                ]
            },
            {
                user: "b@gmail.com",
                user_name: "b",
                detail: [
                    {
                        amount: 624.25,
                        associate: "a@gmail.com",
                        associate_name: "a",
                        status: "owe"
                    }
                ]
            }
        ]
    }

    const currency = checkBalance.standard;
    const totalCost = checkBalance.total_cost;
    const userRecord = checkBalance.result.find(user => user.user_name === currentUser);
    const balanceDetails = userRecord ? userRecord.detail : [];

    const symbol = findCurrencySymbol(currency);

    // useEffect(() => {
    //     const fetchDetailCost = async () => {
    //         const response = await fetchWithJwt(`/api/v1/ledger/manage_transaction?schedule_id=${schedule_id}`, 'GET');
    //         if(response.OK) {
    //             const data = await response.json();
    //             setTransactions(data.records);
    //         }

    //     };

    //     fetchDetailCost();

    // }, []);

    // useEffect(() => {
    //     const fetchTotalCost = async () => {
    //         const response = await fetchWithJwt(`/api/v1/ledger/check_balance?schedule_id=${schedule_id}`, 'GET');
    //         if(response.OK) {
    //             const data = await response.json();
    //             setTotalCost(data.total_cost);
    //             setCurrency(data.standard)
    //             setBalanceDetails(data.result);
    //         }

    //     };

    //     fetchTotalCost();

    // }, []);





    const toggleAddForm = () => {
        setShowAddForm(prev => !prev);
    };


    return (
        <div className={style.container}>
            {!showAddForm ? (
                <>
                    <div className={`${style.title} ${style.ledgertitle}`}>
                        <IoChevronBack
                            className={`${style.backbt}`}
                            onClick={() => close()}
                        />
                        Transaction History
                    </div>

                    <span className={style.totalCost}>Total Trip Cost: ${totalCost}</span>
                    
                        <ul>
                            {balanceDetails.map(balanceDetail => (
                                <li className={`${style.detailItem} ${balanceDetail.status === 'owe' ? style.owe : style.owed}`}>
                                    {balanceDetail.status === 'owe' ? `You owe ${balanceDetail.associate_name} ${symbol}${balanceDetail.amount}` :
                                        `You are owed ${symbol}${balanceDetail.amount} by ${balanceDetail.associate_name}`}
                                </li>
                            ))}
                        </ul>
                    <div className={style.centerBlock}>
                        <TransactionsList transactions={transactions} currentUser={currentUser} />
                        <div className={style.button}>
                            <Button
                                txt='Add a transaction'
                                func={toggleAddForm}
                                setting={{ type: "submit" }}
                            />
                        </div>
                        
                    </div>
                    

                </>
            ) : (
                <AddTransactionForm toggleForm={toggleAddForm} trip_id={schedule_id} />
            )}

        </div>
    );
};

export default Ledger;
