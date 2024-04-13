import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './EmailVerification.module.css'; // Assuming you have a CSS file for styling
import { Loading } from '@geist-ui/core'
import Button from "../component/Button";

const EmailVerification = () => {
    // State to manage the verification status: 'verifying', 'success', or 'error'
    const [verificationStatus, setVerificationStatus] = useState('verifying');
    const navigate = useNavigate();

    // Simulated verification process
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                // Simulate an email verification request
                await new Promise((resolve) => setTimeout(resolve, 2000)); // 2 seconds delay
                setVerificationStatus('success'); // Simulate successful verification
            } catch (error) {
                setVerificationStatus('error'); // Simulate an error in verification
            }
        };

        verifyEmail();
    }, []);

    return (
        <div className={style.main}>
        <div className={style.container}>
            {verificationStatus === 'verifying' && (
                <>
                    <div className={style.spinner}>
                        <div className={style.logoContainer}>
                            <img className={style.logo} src="../../logo.svg" alt="TourBuddy" />
                        </div>
                        <Loading>Verifying your email</Loading>
                    </div> {/* Correctly accessing spinner class */}
                </>
            )}
            {verificationStatus === 'success' && (
                <>
                    <div className={style.logoContainer}><img src="../../circle-check.svg" alt="Success" /></div>
                    <h2>Welcome to Trip Buddy!</h2>
                    <div className={style.description}>
                        <p className={style.text}>Your email has been successfully verified!</p>
                        <p className={style.text}>You can now use all the features of our website.</p>
                    </div>
                    <Button txt="Start" func={(e) => navigate('/profile-setup')}/>
                </>
            )}
            {verificationStatus === 'error' && (
                <>
                    <div className={style.logoContainer}><img src="/error-icon.svg" alt="Error" /></div>
                    <h2>Somting Went Wrong!!</h2>
                    <div className={style.description}>
                        <p className={style.text}>There was a problem verifying your email.</p>
                        <p className={style.text}>Please try again later or contact support.</p>
                    </div>
                </>
            )}
        </div>
        </div>
    );
};

export default EmailVerification;
