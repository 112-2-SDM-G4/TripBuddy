import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Reset-password.module.css'; // Adjust path as needed
import Button from '../component/Button'; // Adjust path as needed
import InputText from '../component/InputText'; // Adjust path as needed
import InputCode from '../component/InputCode'; // Adjust path as needed
import SHA256 from 'crypto-js/sha256';
import { baseFetch } from "../hooks/baseFetch";

const PasswordResetPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const generateSalt = (length = 10) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        if (error) {
            setError(""); // Clear error when user starts editing code
        }
    };

    // const handleComplete = (code) => {
    //     setVerificationStatus("processing");
    // };
    const handleComplete = async (e) => {

    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        
        setError('');
        setIsLoading(true);
        
        const new_salt = generateSalt();
        const hashedPassword = SHA256(password + new_salt).toString();

        try {

            const response = await baseFetch('/api/v1/user/reset_password', 'POST', {

                email: email,
                reset_token: code,
                new_password: hashedPassword,
                new_salt: new_salt

            });
            const data = await response.json();
            // const data = {
            //     "valid": true,
            //     "message": "設置成功"
            // }
            if (data.valid) {
                setIsResetSuccessful(true);
            } else {
                setError(data.message); // Display error from the server
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false); // Stop loading regardless of outcome
        }

    };

    if (isResetSuccessful) {
        return (
            <div className={style.main}>
                <div className={style.resetContainer}>
                    <div className={style.logoContainer}>
                        <img src="../../circle-check.svg" alt="Success" />
                    </div>
                    <h2>Password reset successfully!</h2>
                    <div className={style.description}>
                        <p className={style.text}>
                            You can now login with your new password.
                        </p>
                    </div>
                    <Button txt="Go to Login" func={() => navigate("/login")} />
                </div>
            </div>
        );
    }

    return (
        <div className={style.main}>
            <div className={style.resetContainer}>
                <h2>Reset Your Password</h2>
                <form onSubmit={handleSubmit} className={style.resetForm}>
                    <div className={style.logoContainer}>
                        <img className={style.logo} src="../../logo.svg" alt="TourBuddy" />
                    </div>
                    {error && <div className={style.errorMessage}>{error}</div>}
                    <InputText
                        propmt={"Email"}
                        name={"email"}
                        setting={{ require: true, type: 'email' }}
                        value={email}
                        onChange={setEmail}
                    />
                    <InputText
                        propmt={"New Password"}
                        name={"password"}
                        setting={{ require: true, type: 'password' }}
                        value={password}
                        onChange={setPassword}
                    />
                    <InputText
                        propmt={"Confirm New Password"}
                        name={"confirmPassword"}
                        setting={{ require: true, type: 'password' }}
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                    />
                    <div className={style.inputCode}>
                        <InputCode
                            length={6}
                            label="Reset Code"
                            // loading={loading}
                            value={code}
                            onChange={handleCodeChange}
                            onComplete={handleComplete}
                        />
                    </div>
                    <Button
                        txt={!isLoading ? "Submit New Password" : <span className={style.loadingEffect}>Updating Your Info...</span>}
                        setting={{ type: "submit", disabled: isLoading }}
                    // Add additional props if needed to pass className
                    />
                </form>
            </div>
        </div>
    );
};

export default PasswordResetPage;