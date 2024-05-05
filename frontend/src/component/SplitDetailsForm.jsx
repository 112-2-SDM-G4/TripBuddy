import React, { useState, useEffect } from 'react';
import Button from '../component/Button';
import style from './SplitDetailsForm.module.css';
import GroupMemberInfo from "./GroupMemberInfo";

const SplitDetailsForm = ({ payeesData, totalAmount, onDetailsSubmit, splitType, currencySymbol, onTypeChange }) => {
    const [payees, setPayees] = useState([]);
    const [type, setType] = useState(splitType);
    const [error, setError] = useState('');

    useEffect(() => {
        const isSelected = splitType === 'equally';  // 根据 splitType 判断是否全选
        const initializedPayees = payeesData.map(p => ({
            ...p,
            amount: '',
            isSelected: isSelected
        }));
        setPayees(initializedPayees);
        if (splitType === 'equally') {
            calculateEqually(initializedPayees);
        }
    }, [payeesData, splitType]);  // 当 payeesData 或 splitType 变化时重新初始化

    const togglePayeeSelection = (index) => {
        setPayees(prevPayees => {
            const updatedPayees = prevPayees.map((payee, idx) => ({
                ...payee,
                isSelected: idx === index ? !payee.isSelected : payee.isSelected
            }));

            if (type === 'equally') {
                calculateEqually(updatedPayees);
            }

            return updatedPayees;
        });
    };

    const handlePayeeChange = (index, field, value) => {
        if (value.includes('.')) {
            const parts = value.split('.');
            if (parts[1].length > 2) {
                return;
            }
        }
        if (type === 'unequally') {
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

    const handleTabClick = (newType) => {

        setType(newType);
        onTypeChange(newType);
        
        if (newType === 'equally') {
            calculateEqually(payees);
        }
        
        setError('');
    };

    useEffect(() => {
        if (type === 'equally') {
            calculateEqually(payees);
        }
    }, [type, payees]);  // 确保在 payees 或 type 更新后重新计算

    const onDetailsSubmitModified = () => {
        if (type === 'unequally') {
            const totalCalculated = payees.filter(p => p.isSelected).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
            if (totalCalculated !== parseFloat(totalAmount)) {
                setError(`The total amount distributed (${totalCalculated}) does not match the required total (${totalAmount}). Please adjust.`);
                return;
            }
        }
        const selectedPayees = payees.filter(p => p.isSelected);
        console.log(selectedPayees, type);  // Log for debugging
        onDetailsSubmit(selectedPayees, type);  // Call the passed callback function with selected payees
    };

    return (
        <div className={style.splitContainer}>
            <div className={style.tabs}>
                <button onClick={() => handleTabClick('equally')} className={type === "equally" ? style.active : ""}>
                    Equally
                </button>
                <button onClick={() => handleTabClick('unequally')} className={type === "unequally" ? style.active : ""}>
                    Unequally
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
            <Button txt="Submit Details" func={onDetailsSubmitModified} />
        </div>
    );
};

export default SplitDetailsForm;
