import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './Reset-password.module.css'; // Adjust path as needed
import Button from '../component/Button'; // Adjust path as needed
import InputText from '../component/InputText'; // Adjust path as needed

const PasswordResetPage = () => {
    const { token } = useParams(); // Capture the token from the URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

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

        try {
            // Here you would make an API call to your backend
            // const response = await fetch('/api/reset-password', { 
            //   method: 'POST', 
            //   headers: {'Content-Type': 'application/json'}, 
            //   body: JSON.stringify({ token, password }) 
            // });
            // const data = await response.json();

            // Assuming a successful response
            // if (data.valid) {
            navigate('/login'); // Redirect user to login page upon success
            // } else {
            //   setError(data.message);
            // }
        } catch (error) {
            setError("An error occurred. Please try again.");
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