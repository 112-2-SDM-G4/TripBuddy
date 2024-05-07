import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./Login.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";
import EmailVerification from "../component/EmailVerification";
import SHA256 from "crypto-js/sha256";
import { useAuth } from "../hooks/useAuth";
import { baseFetch } from "../hooks/baseFetch";

const Login = () => {
    const [activeTab, setActiveTab] = useState("login");
    const [email, setEmail] = useState(""); // Lifted state for email
    const [password, setPassword] = useState("");
    const [salt, setSalt] = useState("");
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);

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
            {!isSignupSuccess ? (
                <>
                    <div className={style.loginContainer}>
                        <div className={style.tabs}>
                            <button
                                onClick={() => handleTabClick("login")}
                                className={
                                    activeTab === "login" ? style.active : ""
                                }
                            >
                                Login
                            </button>
                            <button
                                onClick={() => handleTabClick("signup")}
                                className={
                                    activeTab === "signup" ? style.active : ""
                                }
                            >
                                Signup
                            </button>
                        </div>
                        {activeTab === "login" && <LoginForm />}
                        {activeTab === "signup" && (
                            <SignupForm onSignupSuccess={handleSignupSuccess} />
                        )}
                    </div>
                </>
            ) : (
                // Success message

                <EmailVerification
                    email={email}
                    hashed_password={password}
                    salt={salt}
                />
            )}
        </div>
    );
};

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [salt, setSalt] = useState("");
    const [error, setError] = useState(""); // State to store error messages
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleEmailBlur = async () => {
        setError(""); // Reset error message
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
        if (password && salt) {
            // Hash the password with the salt
            const hashedPassword = SHA256(password + salt).toString();

            try {
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
            }
        }
    };
    return (
        <form method="post" onSubmit={handleSubmit} className={style.form}>
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
                    propmt={"E-mail"}
                    name={"email"}
                    setting={{ require: true, type: "email" }}
                    value={email}
                    onChange={setEmail}
                    onBlur={handleEmailBlur}
                />

                <InputText
                    propmt={"Password"}
                    name={"password"}
                    setting={{ require: true, type: "password" }}
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
                <a href="/forget-password">Forgot Password?</a>
            </div>
            <div className={style.socialLogin}>
                <div className={style.thirdSignin}>or you can sign in with</div>
                <div className={style.icons}>
                    <a href="/auth/google" className={style.icon}>
                        <img
                            src="../../google-icon.svg"
                            alt="Sign in with google"
                        />
                    </a>
                    <a href="/auth/twitter" className={style.icon}>
                        <img
                            src="../../twitter-icon.svg"
                            alt="Sign in with twitter"
                        />
                    </a>
                    <a href="/auth/facebook" className={style.icon}>
                        <img
                            src="../../facebook-icon.svg"
                            alt="Sign in with facebook"
                        />
                    </a>
                </div>
            </div>
        </form>
    );
};

const SignupForm = ({ onSignupSuccess }) => {
    const [localEmail, setLocalEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

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

            // if (!response.OK) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

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
                {/* You will replace 'logo.png' with your actual logo */}
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
                    propmt={"E-mail"}
                    name={"email"}
                    value={localEmail}
                    setting={{ require: true, type: "email" }}
                    onChange={setLocalEmail}
                />
                <InputText
                    propmt={"Password"}
                    name={"password"}
                    setting={{ require: true, type: "password" }}
                    onChange={setPassword}
                />
                <InputText
                    propmt={"Confirmed Password"}
                    name={"confirmedPassword"}
                    setting={{ require: true, type: "password" }}
                    onChange={setConfirmPassword}
                />
            </div>
            <Button
                txt={!isLoading ? "Sign Up" : <span className={style.loadingEffect}>Signing Up...</span>}
                func={handleSubmit}
                setting={{ type: "submit", disabled: isLoading }}
            // Add additional props if needed to pass className
            />

        </form>
    );
};

export default Login;
