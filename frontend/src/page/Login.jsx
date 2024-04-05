import React, { useState } from "react";
import style from "./Login.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import bcrypt from 'bcryptjs';



const Login = () => {
    const [activeTab, setActiveTab] = useState('login'); // 'login' or 'signup'

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className={style.main}>
            <div className={style.loginContainer}>
                <div className={style.tabs}>
                    <button
                        onClick={() => handleTabClick('login')}
                        className={activeTab === 'login' ? `${style.active}` : ''}
                    >
                        Login
                    </button>
                    <button
                        onClick={() => handleTabClick('signup')}
                        className={activeTab === 'signup' ? `${style.active}` : ''}
                    >
                        Signup
                    </button>
                </div>

                {activeTab === 'login' && <LoginForm />}
                {activeTab === 'signup' && <SignupForm />}
            </div>
        </div>
    );
};



const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [salt, setSalt] = useState('');
    const [error, setError] = useState(''); // State to store error messages

    const handleEmailBlur = async () => {
        setError(''); // Reset error message
        if (email) {
            try {
                const response = await fetch('/api/getSalt', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email })
                });
                if (!response.ok) {
                    throw new Error('User not exists. Please try again or register.');
                }
                const data = await response.json();
                setSalt(data.salt);
            } catch (error) {
                setError(error.message); // Set error message
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password && salt) {
            // Hash the password with the salt
            const hashedPassword = bcrypt.hashSync(password, salt);

            try {
                // Assuming your backend endpoint to receive the hashed password is `/api/login`
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, hashedPassword }),
                });
                if (!response.ok) {
                    throw new Error('E-mail or password is wrong');
                }
                const jwt_token = await response.json();
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
            <Button className={style.buttonSignIn}
                txt={"Sign In"}
                onclick={() => {
                    // setStage(1);
                }}
            />

            <div className={style.links}>
                <a href="/reset">Forgot Password?</a>
            </div>
            <div className={style.socialLogin}>
                <div className={style.text}>or you can sign in with</div>
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

const SignupForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validate and submit the password change...
    };

    return (
        <form action='/signup' onSubmit={handleSubmit} className={style.form}>
            <div className={style.logoContainer}>
                {/* You will replace 'logo.svg' with your actual logo */}
                <img className={style.logo} src="../../logo.svg" alt="TourBuddy" />
            </div>
            <div className={style.inputGroup}>
                <InputText
                    propmt={"Username"}
                    name={"username"}
                    setting={{ require: true, type: 'text' }}
                />
                <InputText
                    propmt={"E-mail"}
                    name={"email"}
                    setting={{ require: true, type: 'email' }}
                />
                <InputText
                    propmt={"Password"}
                    name={"password"}
                    setting={{ require: true, type: 'password' }}
                />
                <InputText
                    propmt={"Confirmed Password"}
                    name={"password"}
                    setting={{ require: true, type: 'password' }}
                />
            </div>
            <Button className={style.buttonSignup}
                txt={"Sign Up"}
                onclick={() => {
                    // setStage(1);
                }}
            />


        </form>
    );
};

export default Login;
