import React, { useState, useEffect } from 'react';
import Button from '../component/Button';
import style from './SplitDetailsForm.module.css';
import GroupMemberInfo from "./GroupMemberInfo";
import { useLanguage } from "../hooks/useLanguage";

const SplitDetailsForm = ({ payeesData, totalAmount, onDetailsSubmit, splitType, currencySymbol }) => {
    const [payees, setPayees] = useState([]);
    const [type, setType] = useState(splitType);
    const [error, setError] = useState('');
    const { language } = useLanguage();

    const words = {
        en: {
            payee_err: "Please select at least one payee.",
            selected_payee_err: "Please enter an amount for all selected payees.",
            equally: 'Equally',
            unequally: 'Unequally',
            save: 'Save'
        },
        zh: {
            payee_err: "請選擇至少一位的分帳對象",
            selected_payee_err: '請對被選取到的成員輸入分帳金額',
            equally: '平分',
            unequally: '自訂',
            save: '儲存'

        }
    }

    useEffect(() => {
        setPayees(payeesData);
        if (splitType === 'equally') {
            calculateEqually(payeesData);
        }
    }, [payeesData, splitType]);  // 当 payeesData 或 splitType 变化时重新初始化

    const togglePayeeSelection = (index) => {
        setPayees(prevPayees => {
            const updatedPayees = prevPayees.map((payee, idx) => ({
                ...payee,
                isSelected: idx === index ? !payee.isSelected : payee.isSelected
            }));

            if (type === 'equally') {
                setTimeout(() => calculateEqually(updatedPayees), 0);
            }

            return updatedPayees;
        });
    };

    const handlePayeeChange = (index, field, value) => {


        if (type === 'unequally') {
            if (value.includes('.')) {
                const parts = value.split('.');
                if (parts[1].length > 2) {
                    return;
                }
            }
            setPayees(prevPayees => prevPayees.map((payee, idx) =>
                idx === index ? { ...payee, [field]: parseFloat(value) } : payee
            ));
            setError('');
        }
    };

    const calculateEqually = (payees) => {
        const total = parseFloat(totalAmount);
        const selectedPayees = payees.filter(p => p.isSelected);
        const equalAmount = selectedPayees.length > 0 ? (total / selectedPayees.length).toFixed(2) : '0';
        const updatedPayees = payees.map(payee => ({
            ...payee,
            amount: payee.isSelected ? equalAmount : ''
        }));

        setPayees(updatedPayees);
    };

    const handleTabClick = (event, newType) => {
        event.preventDefault();
        setType(newType);

        if (newType === 'equally') {
            calculateEqually(payees);
        }

        setError('');
    };



    const onDetailsSubmitModified = (event) => {
        event.preventDefault();

        // Ensure all selected payees have a valid amount
        const incompletePayees = payees.filter(p => p.isSelected && (!p.amount || parseFloat(p.amount) === 0));
        if (incompletePayees.length > 0) {
            setError(words[language]['selected_payee_err']);
            return;
        }

        const selectedPayees = payees.filter(p => p.isSelected);
        if (selectedPayees.length === 0) {
            setError(words[language]['payee_err']);
            return;
        }


        if (type === 'unequally') {
            const totalCalculated = payees.filter(p => p.isSelected).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
            if (totalCalculated !== parseFloat(totalAmount)) {
                let errorMsg = ''; // 初始化 errorMsg 為空字符串

                if (language === 'en') {
                    errorMsg = `The total amount distributed (${totalCalculated}) does not match the required total (${totalAmount}). Please adjust.`;
                } else {
                    errorMsg = `分配的總金額（${totalCalculated}）與所需的總金額（${totalAmount}）不匹配。請調整。`;
                }
                setError(errorMsg);
                return;
            }
        }

        setError("");
        onDetailsSubmit(payees, type);
    };

    return (
        <div className={style.splitContainer}>
            <div className={style.tabs}>
                <button onClick={(event) => handleTabClick(event, 'equally')} className={type === "equally" ? style.active : ""}>
                    {words[language]['equally']}
                </button>
                <button onClick={(event) => handleTabClick(event, 'unequally')} className={type === "unequally" ? style.active : ""}>
                    {words[language]['unequally']}
                </button>
            </div>
            {error && <div className={style.errorMessage}>{error}</div>}
            {payees.map((payee, index) => (
                <div className={style.selectOption} key={payee.user_email}>
                    <GroupMemberInfo
                        trip_member_info={[payee]}
                        isButton={true}
                        selectedStatus={[payee.isSelected]}
                        onSelect={() => togglePayeeSelection(index)}
                    />
                    {payee.isSelected && (
                        <div className={style.inputGroup}>
                            <span className={style.currencySymbol}>{currencySymbol}</span>
                            <input
                                type="number"
                                name="amount"
                                value={payee.amount}
                                readOnly={type === 'equally'}
                                onChange={e => handlePayeeChange(index, 'amount', e.target.value)}
                                className={style.input}
                            />
                        </div>
                    )}
                </div>
            ))}
            <Button txt={words[language]['save']} func={onDetailsSubmitModified} />
        </div>
    );
};

export default SplitDetailsForm;
