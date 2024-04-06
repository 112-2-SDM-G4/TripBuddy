// rest.jsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import style from "./Forgot-password.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import { FaArrowLeft } from 'react-icons/fa';

const Reset = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false); // New state to track submission status

    const navigate = useNavigate();

    // Email validation logic
    const handleEmailValidation = () => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(email)) {
            setEmailError('Please enter a valid email address.');
            setIsSubmittedSuccessfully(false);
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError('');
        handleEmailValidation(); // Validate email on submit

        // If there's an email error, stop here
        if (emailError) {
            return;
        }
        try {
            // const response = await fetch('/api/postReset', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({ email })
            // });
            // const data = await response.json(); // Get the JSON payload
            const sample_data1 = {
                "valid": true, // 若帳號存在且已發送重設 mail
                "message": "已發送密碼重置郵件"
            }

            const sample_data2 = {
                "valid": false, // 若帳號不存在
                "message": "該帳號未註冊"
            }
            if (!sample_data1.valid) {
                throw new Error(sample_data1.message);
            }
            setEmailError(sample_data1.message);
            setIsSubmittedSuccessfully(true);

        } catch (error) {
            setEmailError(error.message); // Set error message
            setIsSubmittedSuccessfully(false);
        }
        // Your password reset submission logic here...
        // For example, you could call an API endpoint to initiate the password reset process
    };

    const goBack = () => {
        navigate('/login'); // Navigate back to the login page
    };

    // Conditional rendering based on submission status
    if (isSubmittedSuccessfully) {
        return (
            <div className={style.main}>
                <div className={style.loginContainer}>
                    <div className={style.logoContainer}>
                        <img className={style.logo} src="../../circle-check.svg" alt="cirle-check"/>
                    </div>
                    <h2>Password Reset Email Sent!</h2>
                    <div className={style.description}>
                        <p className={style.text}>We've sent an email to <strong>{email}</strong>. Follow the instructions in the email to reset your password.</p>
                    </div>
                    <Button txt="Return to Login" func={goBack} />
                </div>
            </div>
        );
    }

    return (
        <div className={style.main}>
            <div className={style.loginContainer}>
                <button onClick={goBack} className={style.backButton}>
                    <FaArrowLeft /> {/* Back icon */}
                </button>
                <form action='/reset' onSubmit={handleSubmit} className={style.form}>
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
                            onBlur={handleEmailValidation}
                        />

                    </div>
                    <Button
                        txt={"Reset My Password"}
                        func={handleSubmit} // Assuming your Button component takes an onclick function through a prop named 'func',
                        setting={{ type: "submit" }}
                    />
                </form>
            </div>
        </div>
    );
};

export default Reset;
