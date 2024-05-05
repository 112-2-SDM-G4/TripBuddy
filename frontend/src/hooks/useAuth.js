import { createContext, useContext, useEffect, useState } from "react";
import { fetchWithJwt } from "./fetchWithJwt";
import { useNavigate, useLocation } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});
    const [userInfo, setUserInfo] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname } = location;

    const login = async (email, hashedPassword) => {
        const url = "/api/v1/user/check_password";
        const postData = {
            user_email: email,
            hashed_password: hashedPassword,
        };

        try {
            const loginResponse = await fetchWithJwt(url, "POST", postData);
            const loginData = await loginResponse.json();

            if (loginData.valid) {
                sessionStorage.setItem("jwtToken", loginData.jwt_token);
                setIsLoggedIn(true);

            } else {
                return { success: false, error: loginData.message, preference: false };
            }

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
