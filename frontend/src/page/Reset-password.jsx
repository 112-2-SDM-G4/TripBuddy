import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './Reset-password.module.css'; // Adjust path as needed
import Button from '../component/Button'; // Adjust path as needed
import InputText from '../component/InputText'; // Adjust path as needed
import SHA256 from 'crypto-js/sha256';

const PasswordResetPage = () => {
    const { token } = useParams(); // Capture the token from the URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
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

        // Reset error state if validation passes
        setError('');

        // Generate a random salt
        const new_salt = generateSalt();

        // Hash the password concatenated with the salt
        const hashedPassword = SHA256(password + new_salt).toString();

        try {
            // const response = await fetch('/api/update-password', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify({ token, hashedPassword, new_salt }),
            // });
            // const data = await response.json();
            const data = {
                "valid": true,
                "message": "設置成功"
            }
            if (data.valid) {
                alert(data.message);
                navigate('/login'); // Redirect to login on success
            } else {
                setError(data.message); // Display error from the server
            }
        } catch (error) {
            setError(error.message);
        }
    };

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
                    <Button txt="Submit New Password" setting={{ type: "submit" }} />
                </form>
            </div>
        </div>
    );
};

export default PasswordResetPage;