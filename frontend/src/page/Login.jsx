import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import style from "./Login.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import SHA256 from 'crypto-js/sha256';
import { useAuth } from '../hooks/useAuth';

const Login = () => {
    const [activeTab, setActiveTab] = useState('login');
    const [email, setEmail] = useState(''); // Lifted state for email
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setIsSignupSuccess(false); // Reset signup success when switching tabs
    };

    // This function will be called by the SignupForm on successful signup
    const handleSignupSuccess = (userEmail) => {
        setEmail(userEmail); // Set the email state to the user's email
        setIsSignupSuccess(true); // Set the flag to show the success message
    };

    return (
        <div className={style.main}>
            

            {!isSignupSuccess ? (
                <>
                    <div className={style.loginContainer}>
                        <div className={style.tabs}>
                            <button onClick={() => handleTabClick('login')} className={activeTab === 'login' ? style.active : ''}>Login</button>
                            <button onClick={() => handleTabClick('signup')} className={activeTab === 'signup' ? style.active : ''}>Signup</button>
                        </div>
                        {activeTab === 'login' && <LoginForm />}
                        {activeTab === 'signup' && <SignupForm onSignupSuccess={handleSignupSuccess} />}
                    </div>
                </>
            ) : (
                // Success message

                <div className={style.loginContainer}>
                    <div className={style.logoContainer}>
                        <img className={style.logo} src="../../circle-check.svg" alt="cirle-check" />
                    </div>
                    <h2>Registration Almost Complete!</h2>
                    <div className={style.description}>
                        <p className={style.text}>
                            Please check your inbox at <strong>{email}</strong> to find the confirmation email we've sent.
                            Click the link provided to finalize your registration and start using your account.
                        </p>
                    </div>
                </div>

            )}

        </div>
    );
};



const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [salt, setSalt] = useState('');
    const [error, setError] = useState(''); // State to store error messages
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleEmailBlur = async () => {
        setError(''); // Reset error message
        if (email) {
            try {
                // const response = await fetch('/api/getSalt', {
                //     method: 'POST',
                //     headers: {
                //         'Content-Type': 'application/json',
                //     },
                //     body: JSON.stringify({ email })
                // });
                // const data = await response.json(); // Get the JSON payload
                const data_true = {
                    "valid": true,
                    "salt": `$2b$10$IHadE3iUTRkVze.OPcKhTe`,
                    "message": ""
                }
                // const data_false =
                // {
                //     "valid": false,
                //     "salt": "",
                //     "message": "該帳號未註冊"
                // }
                if (!data_true.valid) {
                    throw new Error(data_true.message);
                }
                setSalt(data_true.salt);

            } catch (error) {
                setError(error.message); // Set error message
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password && salt) {
            // Hash the password with the salt
            const hashedPassword = SHA256(salt + password).toString();

            try {
                const { success, error } = await login(email, hashedPassword);
                if (!success) {
                    throw new Error(error);
                }
                else {
                    navigate('/explore');
                }
                
                // Redirect user or do some action after successful login here
                // e.g., navigate to a dashboard or home page

            } catch (error) {
                setError(error.message);
            }
        }
    };
    return (
        <form action='/signin' method="post" onSubmit={handleSubmit} className={style.form}>
            <div className={style.logoContainer}>
                <img className={style.logo} src="../../logo.svg" alt="TourBuddy" />
            </div>
            <div className={style.inputWithErrorMessage}>

                {error && <span className={style.errorMessage}>{error}</span>}

            </div>
            <div className={style.inputGroup}>

                <InputText
                    propmt={"E-mail"}
                    name={"email"}
                    setting={{ require: true, type: 'email' }}
                    value={email}
                    onChange={setEmail}
                    onBlur={handleEmailBlur}
                />

                <InputText
                    propmt={"Password"}
                    name={"password"}
                    setting={{ require: true, type: 'password' }}
                    value={password}
                    onChange={setPassword}
                />
            </div>
            <Button
                txt="Sign In"
                func={handleSubmit} // You might not need this if it's just submitting the form
                setting={{ type: "submit" }}
            />

            <div className={style.links}>
                <a href="/reset">Forgot Password?</a>
            </div>
            <div className={style.socialLogin}>
                <div className={style.thirdSignin}>or you can sign in with</div>
                <div className={style.icons}>
                    <a href="/auth/google" className={style.icon}>
                        <img src="../../google-icon.svg" alt="Sign in with google" />
                    </a>
                    <a href="/auth/twitter" className={style.icon}>
                        <img src="../../twitter-icon.svg" alt="Sign in with twitter" />
                    </a>
                    <a href="/auth/facebook" className={style.icon}>
                        <img src="../../facebook-icon.svg" alt="Sign in with facebook" />
                    </a>
                </div>
            </div>
        </form>
    );
};

const SignupForm = ({ onSignupSuccess }) => {
    const [localEmail, setLocalEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const generateSalt = (length = 10) => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };


    const handleSubmit = (e) => {
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
        const salt = generateSalt(); // Generate a "salt"
        const hashedPassword = SHA256(password + salt).toString();

        try {
            // Replace this with your actual API call
            console.log('Submitting:', { localEmail, hashedPassword, salt });
            // const response = await fetch('/api/signup', {
            //     method: 'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify({ email, hashedPassword, salt })
            // });
            // const data = await response.json();
            const data = {
                "valid": true,
                "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiLlsI_mmI4ifQ.f2QgkBxI2j09ks4XBnzDNOVBo-WKlbRp6f8FxfqgtKg"
            }
            // Assuming a successful response
            if (data.valid) {
                onSignupSuccess(localEmail); // Pass the email back up to the parent component
            } else {
                throw new Error('使用者已註冊過');
            }

        } catch (error) {
            setError(error.message);
        }


    };

    return (
        <form action='/signup' onSubmit={handleSubmit} className={style.form}>
            <div className={style.logoContainer}>
                {/* You will replace 'logo.svg' with your actual logo */}
                <img className={style.logo} src="../../logo.svg" alt="TourBuddy" />
            </div>
            <div className={style.inputWithErrorMessage}>

                {error && <span className={style.errorMessage}>{error}</span>}

            </div>
            <div className={style.inputGroup}>
                <InputText
                    propmt={"E-mail"}
                    name={"email"}
                    value={localEmail}
                    setting={{ require: true, type: 'email' }}
                    onChange={setLocalEmail}
                />
                <InputText
                    propmt={"Password"}
                    name={"password"}
                    setting={{ require: true, type: 'password' }}
                    onChange={setPassword}
                />
                <InputText
                    propmt={"Confirmed Password"}
                    name={"confirmedPassword"}
                    setting={{ require: true, type: 'password' }}
                    onChange={setConfirmPassword}
                />
            </div>
            <Button txt="Sign Up" setting={{ type: "submit" }} />

        </form>
    );
};

export default Login;
