// rest.jsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import style from "./Forgot-password.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import { FaArrowLeft } from 'react-icons/fa';
import { baseFetch } from "../hooks/baseFetch";

const Reset = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false); // New state to track submission status
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    // Email validation logic
    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            setEmailError('Email is required.');
            setIsSubmittedSuccessfully(false);
            return; // Stop the function if the email is empty
        } else if (!emailPattern.test(email)) {
            setEmailError('Please enter a valid email address.');
            setIsSubmittedSuccessfully(false);
            return; // Stop the function if the email is invalid
        } else {
            setEmailError('');
        }

        setIsLoading(true);

        try {
            const response = await baseFetch('/api/v1/user/forget_password', "POST",
                { email: email }
            );
            const data = await response.json(); // Get the JSON payload
            // const data = {
            //     "valid": true, // 若帳號存在且已發送重設 mail
            //     "message": "已發送密碼重置郵件"
            // }

            // const sample_data2 = {
            //     "valid": false, // 若帳號不存在
            //     "message": "該帳號未註冊"
            // }
            if (!data.valid) {
                throw new Error(data.message);
            }
            setEmailError(data.message);
            setIsSubmittedSuccessfully(true);

        } catch (error) {
            setEmailError(error.message); // Set error message
            setIsSubmittedSuccessfully(false);
        } finally {
            setIsLoading(false); // Stop loading regardless of outcome
        }

    };

    const goBack = () => {
        navigate('/login'); // Navigate back to the login page
    };

    // Conditional rendering based on submission status
    if (isSubmittedSuccessfully) {
        navigate('/reset');
    }

    return (
        <div className={style.main}>
            <div className={style.loginContainer}>
                <button onClick={goBack} className={style.backButton}>
                    <FaArrowLeft /> {/* Back icon */}
                </button>
                <form className={style.form}>
                    <div className={style.logoContainer}>
                        <img className={style.logo} src="../../logo.svg" alt="TourBuddy" />
                    </div>
                    <div className={style.alert}>
                        <p className={style.text}>
                            Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.
                        </p>
                    </div>
                    <div className={style.inputGroup}>
                        {emailError && <div className={style.errorMessage}>{emailError}</div>}
                        <InputText
                            propmt={"E-mail"}
                            name={"email"}
                            setting={{ require: true, type: 'email' }}
                            value={email}
                            onChange={setEmail}
                        />

                    </div>
                    <Button
                        txt={!isLoading ? "Submit" : <span className={style.loadingEffect}>Sending an email...</span>}
                        func={handleSubmit}
                        setting={{ type: "submit", disabled: isLoading }}
                    // Add additional props if needed to pass className
                    />


                </form>
            </div>
        </div>
    );
};

export default Reset;
