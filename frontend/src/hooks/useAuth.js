import { createContext, useContext, useEffect, useState } from "react";
import { fetchWithJwt } from "./fetchWithJwt";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "./useLanguage";
import { baseFetch } from "./baseFetch";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;
    const { setLanguage } = useLanguage();

    const login = async (email, hashedPassword, isGoogleLogin = false) => {
        try {
            let loginData;
            let loginResponse;
            if (isGoogleLogin) {
                // loginResponse = await baseFetch("/api/v1/user/google_login", "GET");
                // const auth_url = await loginResponse.json();
                // window.location.href = auth_url.auth_url;
                const searchParams = new URLSearchParams(location.search);
                const errorMessage = searchParams.get('error');
                const jwt_token = searchParams.get('jwt_token');
                const preference = searchParams.get('preference') === 'true';
                if(errorMessage) {
                    return { success: false, error: errorMessage, preference: false };
                }
                if (jwt_token) {
                    // 保存 JWT Token 到本地存儲
                    sessionStorage.setItem("jwtToken", jwt_token);
                    setIsLoggedIn(true);
                } else {
                    
                    return { success: false, error: 'JWT token is missing in URL', preference: false };
                
                }
            } else {
                const url = "/api/v1/user/check_password";
                const postData = {
                    user_email: email,
                    hashed_password: hashedPassword,
                };
                loginResponse = await fetchWithJwt(url, "POST", postData);
                loginData = await loginResponse.json();

                if (loginData.valid) {
                    sessionStorage.setItem("jwtToken", loginData.jwt_token);
                    setIsLoggedIn(true);
                } else {
                    return { success: false, error: loginData.message, preference: false };
                }

            }


            const response = await fetchWithJwt(`/api/v1/user/get_info`, 'GET');
            if (response.status !== 200) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const infoData = await response.json();
            console.log("user info:", infoData);
            setUserInfo(infoData);
            setLanguage(infoData["language"]);
            localStorage.setItem("language", infoData["language"]);

            sessionStorage.setItem("avatar", infoData["avatar"]);

            const tripResponse = await fetchWithJwt("/api/v1/trip", "GET");
            const tripData = await tripResponse.json();

            if (tripResponse.ok) {
                const userData = { user_name: loginData.user_name, trips: tripData.user_trip };
                setUser(userData);
                sessionStorage.setItem("user", JSON.stringify(userData)); // Optional: Store user data in sessionStorage
                console.log(userData);
                return { success: true, error: null, preference: loginData.preference };
            } else {
                throw new Error("Failed to fetch trips");
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message, preference: false };
        }
    };


    const logout = () => {
        sessionStorage.removeItem("jwtToken");
        sessionStorage.removeItem("user"); // Remove user data from sessionStorage
        sessionStorage.removeItem("avatar"); // Remove user data from sessionStorage
        setUser({});
        setIsLoggedIn(false);
    };

    useEffect(() => {
        const jwt_token = sessionStorage.getItem("jwtToken");
        const userData = sessionStorage.getItem("user");
        if (jwt_token && userData) {
            setUser(JSON.parse(userData));
            setIsLoggedIn(true);
        } else if (
            pathname.includes("login") ||
            pathname.includes("forget-password") ||
            pathname.includes("reset")
        ) {
            return;
        } else {
            navigate("/login");
        }
        return () => { };
    }, [navigate, pathname]);

    const updateUserData = async () => {
        try {
            const tripResponse = await fetchWithJwt("/api/v1/trip", "GET");
            const tripData = await tripResponse.json();
            if (tripResponse.ok) {
                const storedUserData = JSON.parse(sessionStorage.getItem("user"));
                const userData = {
                    user_name: storedUserData.user_name,
                    trips: tripData.user_trip
                };
                setUser(userData);
                sessionStorage.setItem("user", JSON.stringify(userData)); // Optional: Store user data in sessionStorage
                console.log(userData);
                return { success: true, error: null };
            } else {
                throw new Error("Failed to fetch trips");
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    };

    return (
        <AuthContext.Provider
            value={{ isLoggedIn, login, logout, user, updateUserData, userInfo }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
