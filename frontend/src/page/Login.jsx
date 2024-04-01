import React, { useState } from "react";
import Menu from "../component/Menu";
import style from "./Login.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";



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
    const handleSubmit = (e) => {
        e.preventDefault();
    };

    return (
        <form action='/signup' onSubmit={handleSubmit} className={style.form}>
            <div className={style.logoContainer}>
                {/* You will replace 'logo.svg' with your actual logo */}
                <img className={style.logo} src="../../logo.svg" alt="TourBuddy" />
            </div>
            <div className={style.inputGroup}>
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
            </div>
            <Button className={style.buttonSignIn}
                txt={"Sign In"}
                onclick={() => {
                    // setStage(1);
                }}
            />

            <div className={style.links}>

                <a href="/forgot-password">Forgot Password?</a>

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
