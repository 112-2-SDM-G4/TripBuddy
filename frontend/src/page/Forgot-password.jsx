// rest.jsx
import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import style from "./Forgot-password.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import { FaArrowLeft } from 'react-icons/fa';
import { baseFetch } from "../hooks/baseFetch";
import { useLanguage } from "../hooks/useLanguage";

const Reset = () => {
    const [email, setEmail] = useState('');
    const [emailError, setEmailError] = useState('');
    const [isSubmittedSuccessfully, setIsSubmittedSuccessfully] = useState(false); // New state to track submission status
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();
    const { language } = useLanguage();

    const words = {
        en: {
            text : "Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.",
            email: 'E-mail',
            submit: 'Submit',
            submitInfo: 'Sending an email...'
          
        },
        zh: {
            text: "忘記密碼啦? 請輸入你的電子郵件，我們會寄送一封信到您的信箱讓你重置密碼",
            email: '電子信箱',
            submit: '送出',
            submitInfo: '發送驗證信中...'
        }
      }

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
                        <img className={style.logo} src="../../logo.png" alt="TourBuddy" />
                    </div>
                    <div className={style.alert}>
                        <p className={style.text}>
                            {words[language]['text']}
                        </p>
                    </div>
                    <div className={style.inputGroup}>
                        {emailError && <div className={style.errorMessage}>{emailError}</div>}
                        <InputText
                            propmt={words[language]['email']}
                            name={"email"}
                            setting={{ require: true, type: 'email' }}
                            value={email}
                            onChange={setEmail}
                        />

                    </div>
                    <Button
                        txt={!isLoading ? words[language]['submit'] : <span className={style.loadingEffect}>{words[language]['submitInfo']}</span>}
                        func={handleSubmit}
                        setting={{ type: "submit", disabled: isLoading }}
                    />


                </form>
            </div>
        </div>
    );
};

export default Reset;
