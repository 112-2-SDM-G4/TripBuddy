import React, { useState, useEffect } from "react";
import style from "./Ledger.module.css";
import TransactionsList from './TransactionsList';
import AddTransactionForm from './AddTransactionForm';
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import { IoChevronBack } from "react-icons/io5";

const members = ['小名', '小英', '阿扁']
const currentUser = '小名';


const Ledger = ({ close }) => {
    const [transactions, setTransactions] = useState([
        { id: 1, currentUser: '小名', date: 'Sep 09', currency: "TWD", item_name: "629沙發區", payer: '小名', amount: 2666, payees: [{ payee: '小名', amount: 666 }, { payee: '小英', amount: 2000 }] },
        { id: 2, currentUser: '小名', date: 'Sep 09', currency: "TWD", item_name: "晚餐", payer: '阿扁', amount: 5050, payees: [{ payee: '阿扁', amount: 5000 }, { payee: '小英', amount: 50 }] },
        { id: 3, currentUser: '小名', date: 'Aug 10', currency: "JPY", item_name: "coffee", payer: '小英', amount: 2318, payees: [{ payee: '小名', amount: 300 }, { payee: '阿扁', amount: 18 }, { payee: '小英', amount: 2000 }] },
        { id: 4, currentUser: '小名', date: 'Jul 04', currency: "JPY", item_name: "遊樂園門票", payer: '阿扁', amount: 18200, payees: [{ payee: '小名', amount: 8000 }, { payee: '阿扁', amount: 200 }] },
        { id: 5, currentUser: '小名', date: 'Jul 04', currency: "TWD", item_name: "飲料", payer: '阿扁', amount: 4226, payees: [{ payee: '小名', amount: 1200 }, { payee: '阿扁', amount: 26 }, { payee: '小英', amount: 3000 }] }
    ]);

    // const [totalCost, setTotalCost] = useState(0);
    // const [userDetails, setUserDetails] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);

    const totalCost = 85648;
    const userDetails = [
        { // 代表 abc@gmail.com 欠 trip@gmail.com $100.50
            associate: "小英",
            status: "owe",
            amount: 100.50,
        },
        { // 代表 abc@gmail.com 要跟 m3@gmail.com 收 $500.31
            associate: "阿扁",
            status: "owed",
            amount: 500.31,
        },
    ];


    // useEffect(() => {
    //     const fetchTotalCost = async () => {
    //         const response = await fetchWithJwt('/api/v1/ledger/total_cost', 'GET');
    //         if(response.OK) {
    //             const data = await response.json();
    //             setTotalCost(data.totalCost);
    //             setUserDetails(data.results);
    //         }

    //     };

    //     fetchTotalCost();

    // }, [currentUser]);

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
                        {userDetails.map(detail => (
                            <li key={detail.id} className={`${style.detailItem} ${detail.status === 'owe' ? style.owe : style.owed}`}>
                                {detail.status === 'owe' ? `You owe ${detail.associate} ${detail.amount}` :
                                    `You are owed ${detail.amount} by ${detail.associate}`}
                            </li>
                        ))}
                    </ul>
                    <TransactionsList transactions={transactions} />
                    <button className={style.fab} onClick={toggleAddForm}>
                        <svg className={style.addIcon} viewBox="0 0 24 24">
                            <path fill="currentColor" d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,5A7,7 0 0,0 5,12A7,7 0 0,0 12,19A7,7 0 0,0 19,12A7,7 0 0,0 12,5M12,8L12,12H8V14H12V18H14V14H18V12H14V8H12Z" />
                        </svg>
                    </button>
                </>
            ) : (
                <AddTransactionForm toggleForm={toggleAddForm} />
            )}

        </div>
    );
};

export default Ledger;
