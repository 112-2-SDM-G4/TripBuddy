import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Reset-password.module.css'; // Adjust path as needed
import Button from '../component/Button'; // Adjust path as needed
import InputText from '../component/InputText'; // Adjust path as needed
import InputCode from '../component/InputCode'; // Adjust path as needed
import SHA256 from 'crypto-js/sha256';
import { baseFetch } from "../hooks/baseFetch";
import { useLanguage } from "../hooks/useLanguage";

const PasswordResetPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [code, setCode] = useState('');
    const [error, setError] = useState('');
    const [isResetSuccessful, setIsResetSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { language } = useLanguage();

    const words = {
        en: {
            text : "You can now login with your new password.",
            successfully: 'Password reset successfully!',
            login: "Go to Login",
            resetInfo: 'Reset Your Password',
            email: 'E-mail',
            password: 'New Password',
            confirmPassword: 'Confirmed New Password',
            resetCode: 'Reset Code',
            submit: "Submit New Password",
            updating: "Updating your info..."
          
        },
        zh: {
            text: "現在你可以使用你的新密碼來登入",
            successfully: '密碼重設成功!',
            login: '前往登入頁面',
            resetInfo: '重置你的新密碼',
            email: '電子信箱',
            password: '新密碼',
            confirmPassword: '確認新密碼',
            resetCode: '重置驗證碼',
            submit: "提交新密碼",
            updating: "更新您的新資訊..."
        }
      }

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
                    <h2>{words[language]['successfully']}</h2>
                    <div className={style.description}>
                        <p className={style.text}>
                            {words[language]['text']}
                        </p>
                    </div>
                    <Button txt={words[language]['login']} func={() => navigate("/login")} />
                </div>
            </div>
        );
    }

    return (
        <div className={style.main}>
            <div className={style.resetContainer}>
                <h2>{words[language]['resetInfo']}</h2>
                <form onSubmit={handleSubmit} className={style.resetForm}>
                    <div className={style.logoContainer}>
                        <img className={style.logo} src="../../logo.png" alt="TourBuddy" />
                    </div>
                    {error && <div className={style.errorMessage}>{error}</div>}
                    <InputText
                        propmt={words[language]['email']}
                        name={"email"}
                        setting={{ require: true, type: 'email' }}
                        value={email}
                        onChange={setEmail}
                    />
                    <InputText
                        propmt={words[language]['password']}
                        name={"password"}
                        setting={{ require: true, type: 'password' }}
                        value={password}
                        onChange={setPassword}
                    />
                    <InputText
                        propmt={words[language]['confirmPassword']}
                        name={"confirmPassword"}
                        setting={{ require: true, type: 'password' }}
                        value={confirmPassword}
                        onChange={setConfirmPassword}
                    />
                    <div className={style.inputCode}>
                        <InputCode
                            length={6}
                            label={words[language]['resetCode']}
                            // loading={loading}
                            value={code}
                            onChange={handleCodeChange}
                            onComplete={handleComplete}
                        />
                    </div>
                    <Button
                        txt={!isLoading ? words[language]['submit'] : <span className={style.loadingEffect}>{words[language]['updating']}</span>}
                        setting={{ type: "submit", disabled: isLoading }}
                    // Add additional props if needed to pass className
                    />
                </form>
            </div>
        </div>
    );
};

export default PasswordResetPage;