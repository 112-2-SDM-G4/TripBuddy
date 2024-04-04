import React from "react";
import { useNavigate } from 'react-router-dom';
import style from "./Reset.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import { FaArrowLeft } from 'react-icons/fa';

const Reset = () => {
    const navigate = useNavigate(); // use useNavigate here

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate and submit the password change...
    };

    const goBack = () => {
        navigate('/login'); // Use navigate for navigation
    };

    return (
        <div className={style.main}>
            <div className={style.loginContainer}>
                <button onClick={goBack} className={style.backButton}>
                    <FaArrowLeft /> {/* This is your back icon */}
                </button>
                <form action='/reset' onSubmit={handleSubmit} className={style.form}>
                    <div className={style.logoContainer}>
                        {/* You will replace 'logo.svg' with your actual logo */}
                        <img className={style.logo} src="../../logo.svg" alt="TourBuddy" />
                    </div>
                    <div className={style.alert}><p className={style.text}>
                        Forgotten your password? Enter your e-mail address below, and we'll send you an e-mail allowing you to reset it.
                    </p></div>
                    <div className={style.inputGroup}>
                        <InputText
                            propmt={"E-mail"}
                            name={"email"}
                            setting={{ require: true, type: 'email' }}
                        />
                    </div>
                    <Button className={style.buttonSignup}
                        txt={"Reset My Password"}
                        onclick={() => {
                            // setStage(1);
                        }}
                    />


                </form>
            </div>
        </div>
    )
};


export default Reset;