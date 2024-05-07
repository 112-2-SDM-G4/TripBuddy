import React, { useState, useEffect, useRef } from 'react';
import style from "./AddTransactionForm.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import SplitDetailsForm from './SplitDetailsForm';
import GroupMemberInfo from "./GroupMemberInfo";
import { FaArrowLeft } from 'react-icons/fa';
import { useLanguage } from "../hooks/useLanguage";
import CountryData from "../assets/Country.json";
import { fetchWithJwt } from '../hooks/fetchWithJwt';

const AddTransactionForm = ({ toggleForm, trip_id, refetchData, standard }) => {
    const { language } = useLanguage();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');
    const [currency, setCurrency] = useState(standard);
    const selectedCurrency = CountryData.places.find(place => place.money.en === standard);
    const [symbol, setSymbol] = useState(selectedCurrency.money.symbol);
    const [payer, setPayer] = useState('you');
    const [payees, setPayees] = useState([]);
    const [groupMembers, setGroupMembers] = useState([]);
    const [currentType, setCurrentType] = useState('equally');
    const [showDropdown, setShowDropdown] = useState(false);
    const [showMemberSelector, setShowMemberSelector] = useState(false);
    const [showCustomSplit, setShowCustomSplit] = useState(false);
    const [currentPayees, setCurrentPayees] = useState([]);
    const dropdownRef = useRef(null);


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetchWithJwt(`/api/v1/group/set_group_member?trip_id=${trip_id}`, 'GET');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.trip_member_info && data.trip_member_info.length > 0) {
                    setGroupMembers(data.trip_member_info);
                    console.log(data.trip_member_info);
                    setCurrentPayees(data.trip_member_info.map(p => ({
                        ...p,
                        amount: '',
                        isSelected: false
                    })));
                    setPayer(data.trip_member_info[0]); // Set default payer
                } else {
                    setError('No group members found');
                }
            } catch (error) {
                console.error('Failed to fetch group members:', error);
                setError('Failed to load group members');
            }
        };

        fetchGroupMembers();
    }, [trip_id]);

    const handleTypeChange = (newType) => {
        setCurrentType(newType);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!description.trim()) {
            setError("Description is required.");
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError("Amount must be greater than 0.");
            return;
        }
        if (!payer || !payer.user_email) {
            setError("Payer must be selected.");
            return;
        }

        
        if (payees.length === 0) {
            setError("Please select at least one payee.");
            return;
        }

        try {
            const payload = {
                schedule_id: trip_id,
                item_name: description,
                amount: parseFloat(amount),
                currency: currency,
                payer: payer.user_email,
                payees: payees
            };
            console.log('Submitting:', payload);
            const response = await fetchWithJwt("/api/v1/ledger/manage_transaction", "POST", payload);

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Transaction saved:', data);
            toggleForm();
            refetchData();
        }
        catch (error) {
            setError('Failed to save the transaction: ' + error.message);
            console.error('Transaction submission error:', error);
        }
    };


    const handleCurrencyChange = (event) => {
        event.preventDefault();
        const selectedCurrency = CountryData.places.find(place => place.money.en === event.target.value);
        setCurrency(selectedCurrency.money.en);
        setSymbol(selectedCurrency.money.symbol);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handlePayerSelection = (member) => {
        setPayer(member);
        setShowMemberSelector(false); // Close the selector after selection
    };

    const toggleSplitType = () => {

        if (!description) {
            setError("Please describe the transaction");
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError("Amount must be greater than 0 to choose a split type.");
            return;
        }
        setShowMemberSelector(false);
        setShowCustomSplit(!showCustomSplit);
        // setCurrentType(currentType === 'equally' ? 'unequally' : 'equally');  // 切换类型
        setShowCustomSplit(true);  // 根据新类型设置是否显示自定义分账
        setError("");

    };

    const handleSplitDetailsSubmit = (submittedPayees, submittedType) => {
        console.log('Submitted Payees:', submittedPayees);

        setCurrentType(submittedType);
        setShowCustomSplit(false);
        setCurrentPayees(submittedPayees);
        const selectedPayees = submittedPayees.filter(p => p.isSelected);
        setPayees(selectedPayees.map(payee => ({
            payee: payee.user_email,
            amount: parseFloat(payee.amount)
        })));
        console.log('Payees:', payees);

    };



    return (
        <div className={style.main}>

            <button onClick={toggleForm} className={style.backButton} aria-label="Go back">
                <FaArrowLeft />
            </button>
            <div className={`${style.centerBlock} ${showMemberSelector ? style.dimmed : ''}`}>
                <form onSubmit={handleSubmit} className={style.form}>
                    <div className={style.inputGroup}>
                        {error && <div className={style.errorMessage}>{error}</div>}
                        <InputText
                            propmt="Enter a description"
                            name="description"
                            setting={{ require: true, type: 'text' }}
                            value={description}
                            onChange={setDescription}
                        />
                        <div className={style.currencyInput}>
                            <button onClick={toggleDropdown} className={style.currencyButton}>
                                {symbol} ▼
                            </button>
                            {showDropdown && (
                                <select
                                    ref={dropdownRef}
                                    value={currency}
                                    onChange={handleCurrencyChange}
                                    className={style.currencySelect}
                                    onBlur={() => setShowDropdown(false)}
                                    size={CountryData.places.length}  // This makes it act like a dropdown
                                >
                                    {CountryData.places.map((place, index) => (
                                        <option key={index} value={place.money.en} >
                                            {place.country[language]} ({place.money.symbol})
                                        </option>
                                    ))}
                                </select>
                            )}
                            <div className={style.amountWrapper}>
                                <InputText
                                    propmt="Amount"
                                    name="amount"
                                    setting={{ require: true, type: 'number' }}
                                    value={amount}
                                    onChange={setAmount}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={style.flexRow}>
                        {!showCustomSplit && (
                            <>
                                {/* Payer Selection */}
                                {!showMemberSelector && (
                                    <>
                                        <p>Paid by</p>
                                        <button
                                            className={style.select}
                                            onClick={() => {
                                                setShowMemberSelector(true);
                                            }}>
                                            {payer.user_name || "Select payer"}
                                        </button>
                                        <p>and split</p>
                                        <button
                                            className={style.select}
                                            onClick={toggleSplitType}>
                                            {currentType === 'equally' ? 'equally' : 'unequally'}
                                        </button>
                                    </>
                                )}
                                {showMemberSelector && (
                                    <div className={style.select}>
                                        <GroupMemberInfo
                                            trip_member_info={groupMembers}
                                            isButton={true}
                                            onSelect={handlePayerSelection}
                                        />
                                    </div>
                                )}




                            </>
                        )}
                        {showCustomSplit && (
                            <SplitDetailsForm
                                payeesData={currentPayees}
                                totalAmount={amount}
                                onDetailsSubmit={handleSplitDetailsSubmit}
                                splitType={currentType}
                                currencySymbol={symbol}
                                onTypeChange={handleTypeChange}
                            />
                        )}



                    </div>
                    {!showCustomSplit && (
                        <div className={style.saveButton}>
                            <Button
                                txt='Save'
                                // func={handleSubmit}
                                setting={{ type: "submit" }}
                            />
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
};



export default AddTransactionForm;
