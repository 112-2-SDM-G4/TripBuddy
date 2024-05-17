import React, { useState, useEffect, useRef } from 'react';
import style from "./AddTransactionForm.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import SplitDetailsForm from './SplitDetailsForm';
import GroupMemberInfo from "./GroupMemberInfo";
import { FaArrowLeft } from 'react-icons/fa';
import CountryData from "../assets/Country.json";
import { fetchWithJwt } from '../hooks/fetchWithJwt';

const AddTransactionForm = ({ toggleForm, trip_id, refetchData, exchange, language }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');
    const [currency, setCurrency] = useState(exchange);
    const selectedCurrency = CountryData.places.find(place => place.money.en === exchange);
    const [countryid, setCountryid] = useState(selectedCurrency.country_id);
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


    const words = {
        en: {
            fetch_group_member_err: 'Failed to fetch group members:',
            description_err: "Description is required.",
            amount_err: "Amount must be greater than 0.",
            payer_err: "Payer must be selected.",
            payee_err: "Please select at least one payee.",
            description: "Enter a description",
            amount: 'Amount',
            payer: 'Payer',
            splitType: 'Splitting Method',
            equally: 'Equal Split',
            unequally: 'Customized Split',
            save: 'Add'
        },
        zh: {
            fetch_group_member_err: '讀取成員名單失敗:',
            description_err: '請描述該筆消費',
            amount_err: '輸入金額請大於0',
            payer_err: '請選擇付款人',
            payee_err: "請選擇至少一位的分帳對象",
            description: '請描述該筆消費',
            amount: '金額',
            payer: '付款人',
            splitType: '分款方式',
            equally: '平分',
            unequally: '自訂',
            save: '新增'
        }
    }

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
                setError(words[language]['fetch_group_member_err']);
            }
        };

        fetchGroupMembers();
    }, [trip_id]);

    const handleTypeChange = (event, newType) => {
        event.preventDefault();
        setCurrentType(newType);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!description.trim()) {
            setError(words[language]['description_err']);
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError(words[language]['amount_err']);
            return;
        }
        if (!payer || !payer.user_email) {
            setError(words[language]['payer_err']);
            return;
        }


        if (payees.length === 0) {
            setError(words[language]['payee_err']);
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


    const handleCurrencyChange = (value) => {

        const selectedCurrency = CountryData.places.find(place => place.money.en === value);
        setCurrency(selectedCurrency.money.en);
        setSymbol(selectedCurrency.money.symbol);
        setCountryid(selectedCurrency.country_id);
        setShowDropdown(false);
    };

    const handleItemClick = (e, value) => {
        e.preventDefault();
        handleCurrencyChange(value);
        setShowDropdown(false);
        
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const handlePayerSelection = (member) => {
        setPayer(member);
        setShowMemberSelector(false); // Close the selector after selection
    };

    const toggleSplitType = (event) => {
        event.preventDefault();
        if (!description.trim()) {
            setError(words[language]['description_err']);
            return;
        }
        if (parseFloat(amount) <= 0) {
            setError(words[language]['amount_err']);
            return;
        }
        setShowMemberSelector(false);
        setShowCustomSplit(!showCustomSplit);
        setShowCustomSplit(true);
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
                            propmt={words[language]['description']}
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
                                <ul
                                    ref={dropdownRef}
                                    value={currency}
                                    className={style.currencySelect}
                                    onBlur={() => setShowDropdown(false)}
                                    size={CountryData.places.length}  // This makes it act like a dropdown
                                >
                                    {CountryData.places.map((place, index) => (
                                        <li key={index} 
                                            value={place.money.en} 
                                            onClick={(e) => handleItemClick(e, place.money.en)}
                                            onKeyDown={(e) => e.key === 'Enter' && handleItemClick(place.money.en)}
                                            className={`${style.currencyItem} ${countryid === place.country_id ? style.selected : ''}`}
                                        >
                                            {place.country[language]} ({place.money.symbol})
                                        </li>
                                    ))}
                                </ul>
                            )}
                            <div className={style.amountWrapper}>
                                <InputText
                                    propmt={words[language]['amount']}
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
                                        <div className={style.row}>
                                            <p>{words[language]['payer']}: </p>
                                            <button
                                                className={style.select}
                                                onClick={() => {
                                                    setShowMemberSelector(true);
                                                }}>
                                                <img src={`../../${payer.user_avatar}.png`} alt="Avatar" className={style.avatar} />
                                                {payer.user_name || "Select payer"}
                                            </button>
                                        </div>
                                        <div className={style.row}>
                                            <p>{words[language]['splitType']}: </p>
                                            <button
                                                className={style.select}
                                                onClick={(event) => {toggleSplitType(event)}}>
                                                {currentType === 'equally' ? words[language]['equally'] : words[language]['unequally']}
                                            </button>
                                        </div>
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
                                txt={words[language]['save']}
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
