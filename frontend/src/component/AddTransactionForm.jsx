import React, { useState, useEffect } from 'react';
import style from "./AddTransactionForm.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import { FaArrowLeft } from 'react-icons/fa';
import { useLanguage } from "../hooks/useLanguage";
import CountryData from "../assets/Country.json";
import { fetchWithJwt } from '../hooks/fetchWithJwt';

const AddTransactionForm = ({ toggleForm, trip_id, refetchData }) => {
    const { language } = useLanguage();
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');
    const [currency, setCurrency] = useState(CountryData.places[0].money.en);
    const [symbol, setSymbol] = useState(CountryData.places[0].money.symbol);
    const [payer, setPayer] = useState('you');  
    const [groupMembers, setGroupMembers] = useState([]);
    const [splitType, setSplitType] = useState('equally');  
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            // try {
            //     const response = await fetchWithJwt(`/api/v1/group/set_group_member?trip_id=${trip_id}`, 'GET');
            //     if(!response.OK) {
            //         throw new Error(`HTTP error! Status: ${response.status}`);
            //     }
            //     const data = await response.json();
            //     setGroupMembers(data.trip_member_info);
            //     if (data.trip_member_info.length > 0) {
            //         setPayer(data.trip_member_info[0].user_name); // Set default payer
            //     }
            // } catch (error) {
            //     console.error('Failed to fetch group members:', error);
            //     setError('Failed to load group members');
            // }
        };

        fetchGroupMembers();
    }, [trip_id]);
    
    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log('Description:', description);
        console.log('Amount:', amount);
        console.log('Currency:', currency);
        
        try {
            // const response = await fetchWithJwt("/api/v1/ledger/manage_transaction", "POST", {
            //     schedule_id: trip_id,
            //     item_name: description,
            //     amount: parseFloat(amount),
            //     currency: currency,
            //     payer: payer,
            //     payees: []
            // });
            // if(!response.OK) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }
            // const data = await response.json();
            // console.log('Transaction saved:', data);
            // toggleForm(); 
            // refetchData();

        }
        catch(error) {
            setError('Failed to save the transaction: ' + error.message);
            console.error('Transaction submission error:', error);
        }
    };

    const handleCurrencyChange = (event) => {
        const selectedCurrency = CountryData.places.find(place => place.money.en === event.target.value);
        setCurrency(selectedCurrency.money.en);
        setSymbol(selectedCurrency.money.symbol);
        setShowDropdown(false);
    };

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };




    return (
        <>

            <button onClick={toggleForm} className={style.backButton} aria-label="Go back">
                <FaArrowLeft />
            </button>
            <div className={style.centerBlock}>
                <form className={style.form} onSubmit={handleSubmit}>
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
                                    value={currency}
                                    onChange={handleCurrencyChange}
                                    className={style.currencySelect}
                                    onBlur={() => setShowDropdown(false)}
                                    size={CountryData.places.length}  // This makes it act like a dropdown
                                >
                                    {CountryData.places.map((place, index) => (
                                        <option key={index} value={place.money.en}>
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
                        <p>Paid by</p>
                        <select value={payer} onChange={e => setPayer(e.target.value)} className={style.select}>
                            {groupMembers.map(member => (
                                <option key={member.user_email} value={member.user_name}>
                                    {member.user_name}
                                </option>
                            ))}
                        </select>
                        <p>and split</p>
                        <select value={splitType} onChange={e => setSplitType(e.target.value)} className={style.select}>
                            <option value="equally">Equally</option>
                            <option value="unequally">Unequally</option>
                        </select>
                    </div>
                    <div className={style.saveButton}>
                        <Button
                            txt='Save'
                            func={handleSubmit}
                            setting={{ type: "submit" }}
                        />
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddTransactionForm;
