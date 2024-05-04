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
    // const currentUser = JSON.parse(sessionStorage.getItem("user")).user_name;
    const currentUser = 'a';
    const [totalCost, setTotalCost] = useState(0);
    const [transactions, setTransactions] = useState([]);
    const [checkBalance, setCheckBalance] = useState([]);
    const [balanceDetails, setBalanceDetails] = useState([]);
    const [currency, setCurrency] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);
    const [formAnimationClass, setFormAnimationClass] = useState('');

    // Refetching function that can be called on demand
    const refetchData = useCallback(async () => {
        // const fetchDetailCost = async () => {
        //     const response = await fetchWithJwt(`/api/v1/ledger/manage_transaction?schedule_id=${schedule_id}`, 'GET');
        //     if (response.ok) {
        //         const data = await response.json();
        //         setTransactions(data.records);
        //     }
        // };

        // const fetchTotalCost = async () => {
        //     const response = await fetchWithJwt(`/api/v1/ledger/check_balance?schedule_id=${schedule_id}`, 'GET');
        //     if (response.ok) {
        //         const data = await response.json();
        //         setTotalCost(data.total_cost);
        //         setCurrency(data.standard);
        //         setCheckBalance(data.result);
        //     }
        // };

        // await fetchDetailCost();
        // await fetchTotalCost();
        const data0 = {
            records: [
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
            ],
            schedule_id: 556
        };
        setTransactions(data0.records);

        const data = {
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
                            status: "owed"
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
        };


        setTotalCost(data.total_cost);
        setCurrency(data.standard);
        setCheckBalance(data.result);

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
                    </div>
                </>
            ) : (
                <div className={formAnimationClass}>
                    <AddTransactionForm
                        toggleForm={toggleAddForm}
                        trip_id={schedule_id}
                        refetchData={refetchData}
                    />
                </div>
            )}
        </div>
    );
};

export default Ledger;
