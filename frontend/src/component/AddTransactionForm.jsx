import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from "./AddTransactionForm.module.css"
import Button from "../component/Button";
import InputText from "../component/InputText";
import { FaArrowLeft } from 'react-icons/fa';

const AddTransactionForm = ({ toggleForm }) => {
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        // Here you can handle the submission to the server or state management
        console.log('Description:', description);
        console.log('Amount:', amount);
        // Redirect or show confirmation here
    };


    return (
        <>
            <button onClick={toggleForm} className={style.backButton}>
                <FaArrowLeft /> {/* Back icon */}
            </button>
            <form className={style.form} onSubmit={handleSubmit}>
                <div className={style.inputGroup}>
                    {error && <div className={style.errorMessage}>{error}</div>}
                    <InputText
                        propmt={"Enter a description"}
                        name={"description"}
                        setting={{ require: true, type: 'text' }}
                        value={description}
                        onChange={setDescription}
                    />
                    <InputText
                        propmt={"Amount"}
                        name={"amount"}
                        setting={{ require: true, type: 'float' }}
                        value={amount}
                        onChange={setAmount}
                    />

                </div>

                <div>
                    <p>Paid by you and split equally</p>
                </div>
                <Button
                    txt={'Save'}
                    func={handleSubmit}
                    setting={{ type: "submit" }}
                />
            </form>
        </>
    );
};

export default AddTransactionForm;
