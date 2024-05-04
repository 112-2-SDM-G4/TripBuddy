import React, { useState, useEffect } from 'react';
import Button from '../component/Button';
import style from './SplitDetailsForm.module.css';
import GroupMemberInfo from "./GroupMemberInfo";

const SplitDetailsForm = ({ payeesData, totalAmount, onDetailsSubmit, splitType }) => {
    const [payees, setPayees] = useState([]);
    const [type, setType] = useState(splitType);
    const [error, setError] = useState('');


    useEffect(() => {
        initializePayees();
    }, [payeesData, type]);

    const initializePayees = () => {
        const isSelectedDefault = type === 'equally';
        const initializedPayees = payeesData.map(p => ({
            ...p,
            amount: '',
            isSelected: isSelectedDefault
        }));
        setPayees(initializedPayees);
        calculateEqually(initializedPayees);
    };

    const togglePayeeSelection = (index) => {
        setPayees(prevPayees => {
            const updatedPayees = prevPayees.map((payee, idx) => {
                if (idx === index) {
                    return { ...payee, isSelected: !payee.isSelected };
                }
                return payee;
            });
            calculateEqually(updatedPayees); // Calculate equally whenever a payee is toggled
            return updatedPayees;
        });
    };

    const handlePayeeChange = (index, field, value) => {
        if (type === 'unequally') {
            setPayees(prevPayees => prevPayees.map((payee, idx) =>
                idx === index ? { ...payee, [field]: value } : payee
            ));
            setError(''); // Clear any previous error when changing values
        }
    };

    const calculateEqually = (payees) => {
        if (type === 'equally') {
            const selectedPayees = payees.filter(p => p.isSelected);
            const total = totalAmount;
            const equalAmount = selectedPayees.length > 0 ? (total / selectedPayees.length).toFixed(2) : '0';
            setPayees(payees.map(p => ({ ...p, amount: p.isSelected ? equalAmount : '' })));
        }
    };

    const handleTabClick = (newType) => {
        setType(newType);
        const isSelectedDefault = newType === 'equally';
        const updatedPayees = payeesData.map(p => ({
            ...p,
            amount: '',
            isSelected: isSelectedDefault
        }));
        setPayees(updatedPayees);
        calculateEqually(updatedPayees);
    };

    const onDetailsSubmitModified = () => {

        if (type === 'unequally') {
            const totalCalculated = payees.filter(p => p.isSelected).reduce((acc, curr) => acc + parseFloat(curr.amount || 0), 0);
            if (totalCalculated.toFixed(2) !== totalAmount.toFixed(2)) {
                setError(`The total amount distributed (${totalCalculated}) does not match the required total (${totalAmount}). Please adjust.`);
                return;
            }
        }
        const selectedPayees = payees.filter(p => p.isSelected);
        console.log(selectedPayees);
        onDetailsSubmit(selectedPayees);
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
                        <input
                            type="number"
                            name="amount"
                            value={payee.amount}
                            readOnly={type === 'equally'}
                            onChange={e => handlePayeeChange(index, 'amount', e.target.value)}
                            className={style.input}
                        />
                    )}
                </div>
            ))}
            <Button txt="Submit Details" func={onDetailsSubmitModified} />
        </div>
    );
};

export default SplitDetailsForm;
