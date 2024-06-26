import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguage } from "../hooks/useLanguage";
import style from "./Login.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import EmailVerification from "../component/EmailVerification";
import Loader from "../component/Loader";
import SHA256 from "crypto-js/sha256";
import { useAuth } from "../hooks/useAuth";
import { baseFetch } from "../hooks/baseFetch";

const Login = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [email, setEmail] = useState(""); // Lifted state for email
    const [password, setPassword] = useState("");
    const [salt, setSalt] = useState("");
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);
    const { language } = useLanguage();
    const { isLoading } = useAuth();

    const words = {
        en: {
            login: 'Login',
            signup: 'Signup'
        },
        zh: {
            login: '登入',
            signup: '註冊'
        }
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setIsSignupSuccess(false); // Reset signup success when switching tabs
    };

    // This function will be called by the SignupForm on successful signup
    const handleSignupSuccess = (userEmail, salt, hashedPassword) => {
        setEmail(userEmail); // Set the email state to the user's email
        setPassword(hashedPassword);
        setSalt(salt);
        setIsSignupSuccess(true); // Set the flag to show the success message
    };

    return (
        <div className={style.main}>
            {isLoading ? (
                <Loader isLoading={isLoading} />
            ) : (
                !isSignupSuccess ? (
                    <>
                        <div className={style.loginContainer}>
                            <div className={style.tabs}>
                                <button
                                    onClick={() => handleTabClick("login")}
                                    className={
                                        activeTab === "login" ? style.active : ""
                                    }
                                >
                                    {words[language]['login']}
                                </button>
                                <button
                                    onClick={() => handleTabClick("signup")}
                                    className={
                                        activeTab === "signup" ? style.active : ""
                                    }
                                >
                                    {words[language]['signup']}
                                </button>
                            </div>
                            {activeTab === "login" && <LoginForm language={language} />}
                            {activeTab === "signup" && (
                                <SignupForm onSignupSuccess={handleSignupSuccess} language={language} />
                            )}
                        </div>
                    </>
                ) : (
                    // Success message
                    <EmailVerification
                        email={email}
                        hashed_password={password}
                        salt={salt}
                        language={language}
                    />
                )
            )}
        </div>
    );
};

const LoginForm = ({ language }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [salt, setSalt] = useState("");
    const [error, setError] = useState(""); // State to store error messages
    const navigate = useNavigate();
    const { login, handleGoogleLoginCallback } = useAuth();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(false);

    const words = {
        en: {
            email: 'E-mail',
            password: 'Password',
            signin: 'Sign In',
            forget_password: 'Forget Password?',
            third_party_login: 'or you can login with',
            emailRequired: 'Email is required.',
            passwordRequired: 'Please enter your password.',
            validEmail: 'Please enter a valid email address.',
            googleError: "This email is already registered. Use the original login method."
        },
        zh: {
            email: '電子信箱',
            password: '密碼',
            signin: '登入',
            forget_password: '忘記密碼了?',
            third_party_login: '或是用以下方式登入',
            emailRequired: '請輸入信箱',
            validEmail: '請輸入有效的信箱格式',
            passwordRequired: '請輸入密碼',
            googleError: "此電子郵件已經註冊，請使用原本的登入方式"
        }
    };

    const handleEmailBlur = async () => {
        setError(""); // Reset error message
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError(words[language]['emailRequired']);
            return; // Stop the function if the email is empty
        }
        if (!emailPattern.test(email)) {
            setError(words[language]['validEmail']);
            return;
        }

        if (email) {
            try {
                const response = await baseFetch(`/api/v1/user/check_user?user_email=${email}`, 'GET');
                const data = await response.json();

                if (!data.valid) {
                    throw new Error(data.message);
                }
                setSalt(data.salt);
            } catch (error) {
                setError(error.message); // Set error message
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email) {
            setError(words[language]['emailRequired']);
            return; // Stop the function if the email is empty
        }
        if (!emailPattern.test(email)) {
            setError(words[language]['validEmail']);
            return;
        }
        if (!password) {
            setError(words[language]['passwordRequired']);
            return;
        }
        if (password && salt) {
            // Hash the password with the salt
            const hashedPassword = SHA256(password + salt).toString();

            try {
                setIsLoading(true);
                const { success, error, preference } = await login(email, hashedPassword);
                if (!success) {
                    throw new Error(error);
                }
                else if (!preference) {
                    navigate("/profile-setup");
                }
                else {
                    navigate("/explore");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const checkGoogleLoginCallback = async () => {
            const searchParams = new URLSearchParams(location.search);
            const jwt_token = searchParams.get('jwt_token');
            const errorMessage = searchParams.get('error');
            if (errorMessage) {
                setError(words[language]['googleError']);
            }
            if (jwt_token) {
                const result = await handleGoogleLoginCallback();
                console.log("GoogleLoginCallback result", result);
                
                if (result.success) {
                    if (!result.preference) {
                        navigate('/profile-setup'); // 假设有用户偏好页面
                    } else {
                        navigate('/explore');
                    }
                } else {
                    console.error(result.error);
                    setError(result.error);
                }
            }
        };

        checkGoogleLoginCallback();
    }, [handleGoogleLoginCallback, location.search, navigate]);

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        try {
            const loginResponse = await baseFetch("/api/v1/user/google_login", "GET");
            const auth_url = await loginResponse.json();
            window.location.href = auth_url.auth_url;
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form method="post" onSubmit={handleSubmit} className={style.form}>
            {isLoading && <Loader isLoading={isLoading} />}

            <div className={style.logoContainer}>
                <img
                    className={style.logo}
                    src="../../logo.png"
                    alt="TourBuddy"
                />
            </div>

            <div className={style.inputWithErrorMessage}>
                {error && <span className={style.errorMessage}>{error}</span>}
            </div>
            <div className={style.inputGroup}>
                <InputText
                    propmt={words[language]["email"]}
                    name={"email"}
                    setting={{ require: true, type: "email" }}
                    value={email}
                    onChange={setEmail}
                    onBlur={handleEmailBlur}
                />

                <InputText
                    propmt={words[language]["password"]}
                    name={"password"}
                    setting={{ require: true, type: "password" }}
                    value={password}
                    onChange={setPassword}
                />
            </div>
            <Button
                txt={words[language]["signin"]}
                func={handleSubmit} // You might not need this if it's just submitting the form
                setting={{ type: "submit" }}
            />

            <div className={style.links}>
                <a href="/forget-password">{words[language]["forget_password"]}</a>
            </div>
            <div className={style.socialLogin}>
                <div className={style.thirdSignin}>------{words[language]["third_party_login"]}------</div>
                <div className={style.icons}>
                    <div className={style.icon} onClick={handleGoogleLogin}>
                        <img
                            src="../../google-icon.svg"
                            alt="Sign in with Google"
                        />
                    </div>
                </div>
            </div>
        </form>
    );
};

const SignupForm = ({ onSignupSuccess, language }) => {
    const [localEmail, setLocalEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const words = {
        en: {
            email: 'E-mail',
            password: 'Password',
            confirmedPassword: 'Confirmed Password',
            signup: 'Sign Up',
            signingUp: 'Signing Up...'
        },
        zh: {
            email: '電子信箱',
            password: '密碼',
            confirmedPassword: '確認密碼',
            signup: '註冊',
            signingUp: '註冊中...'
        }
    };

    const generateSalt = (length = 10) => {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let result = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters[randomIndex];
        }
        return result;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!localEmail) {
            setError('Email is required.');
            return; // Stop the function if the email is empty
        }
        if (!emailPattern.test(localEmail)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        const salt = generateSalt(); // Generate a "salt"
        const hashedPassword = SHA256(password + salt).toString();

        try {
            const response = await baseFetch(
                "/api/v1/user/send_email", "POST",
                { user_email: localEmail }
            );

            const data = await response.json();

            if (data.valid) {
                onSignupSuccess(localEmail, salt, hashedPassword); // Pass the email back up to the parent component
            } else {
                throw new Error(data.message);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false); // Stop loading regardless of outcome
        }

    };

    return (
        <form onSubmit={handleSubmit} className={style.form}>
            <div className={style.logoContainer}>
                <img
                    className={style.logo}
                    src="../../logo.png"
                    alt="TourBuddy"
                />
            </div>
            <div className={style.inputWithErrorMessage}>
                {error && <span className={style.errorMessage}>{error}</span>}
            </div>
            <div className={style.inputGroup}>
                <InputText
                    propmt={words[language]["email"]}
                    name={"email"}
                    value={localEmail}
                    setting={{ require: true, type: "email" }}
                    onChange={setLocalEmail}
                />
                <InputText
                    propmt={words[language]["password"]}
                    name={"password"}
                    setting={{ require: true, type: "password" }}
                    onChange={setPassword}
                />
                <InputText
                    propmt={words[language]["confirmedPassword"]}
                    name={"confirmedPassword"}
                    setting={{ require: true, type: "password" }}
                    onChange={setConfirmPassword}
                />
            </div>
            <Button
                txt={!isLoading ? words[language]["signup"] : <span className={style.loadingEffect}>{words[language]["signingUp"]}</span>}
                func={handleSubmit}
                setting={{ type: "submit", disabled: isLoading }}
            // Add additional props if needed to pass className
            />
        </form>
    );
};

export default Login;
