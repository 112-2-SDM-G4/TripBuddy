import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import style from "./EmailVerification.module.css";
import Button from "./Button";
import InputCode from "./InputCode";
import { useAuth } from "../hooks/useAuth";
import { baseFetch } from "../hooks/baseFetch";

const EmailVerification = ({ email, hashed_password, salt }) => {
    const [verificationStatus, setVerificationStatus] = useState("error");
    const [contentVisible, setContentVisible] = useState(false);
    const [error, setError] = useState("");
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (verificationStatus === "processing") {
            setLoading(true);
            setError("");
            verifyEmail(code);
        }
    }, [verificationStatus, code]);

    const verifyEmail = async (verificationCode) => {
        try {
            const response = await baseFetch("/api/v1/user/verify", 'POST',
                {
                    user_email: email,
                    hashed_password: hashed_password,
                    salt: salt,
                    token: verificationCode,
                });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            

            if (data.valid) {
                const { success, error } = await login(email, hashed_password);
                if (!success) {
                    throw new Error(error);
                }
                setVerificationStatus("success");
                setTimeout(() => {
                    setContentVisible(true);
                    setLoading(false);
                }, 3000); // Wait 3 seconds before showing the success message
            } else {
                throw new Error(
                    data.message || "Verification failed, please try again."
                );
            }
        } catch (error) {
            setVerificationStatus("error");
            setError(error.message);
            setCode(""); // Reset code for re-entry
            setLoading(false);
        }
    };

    const handleCodeChange = (newCode) => {
        setCode(newCode);
        if (error) {
            setError(""); // Clear error when user starts editing code
        }
    };

    const handleComplete = (code) => {
        setVerificationStatus("processing");
    };

    return (
        <div className={style.main}>
            <div className={style.container}>
                {verificationStatus === "success" && contentVisible ? (
                    <>
                        <div className={style.logoContainer}>
                            <img src="../../circle-check.svg" alt="Success" />
                        </div>
                        <h2>Welcome to TripBuddy!</h2>
                        <div className={style.description}>
                            <p className={style.text}>
                                Your account has been successfully verified!
                            </p>
                            <p className={style.text}>
                                You can now use all the features of our website.
                            </p>
                        </div>
                        <Button
                            txt="Start"
                            func={() => navigate("/profile-setup")}
                        />
                    </>
                ) : (
                    <>
                        <div className={style.logoContainer}>
                            <img className={style.logo} src="../../logo.png" alt="TripBuddy" />
                        </div>
                        <h2>Your registration is almost done!</h2>
                        <div className={style.description}>
                            <p className={style.text}>
                                Please check your inbox at{" "}
                                <strong>{email}</strong> to find the
                                verification code we've sent.
                            </p>
                        </div>
                        {error && <p className={style.errorMessage}>{error}</p>}
                        <InputCode
                            length={6}
                            label="Verification Code"
                            loading={loading}
                            value={code}
                            onChange={handleCodeChange}
                            onComplete={handleComplete}
                        />
                    </>
                )}
                {loading && (
                    <div className={style.spinner}>
                        <div className={style.loader}></div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmailVerification;
