import { createContext, useContext, useState } from "react";
import { fetchWithJwt } from "./fetchWithJwt";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    const login = async (email, hashedPassword) => {
        const url = "/api/v1/user/check_password";
        const postData = { 
            user_email: email, 
            hashed_password: hashedPassword };

        try {
            const response = await fetchWithJwt(url, "POST", postData);

            const data = await response.json();
            
            if (data.valid) {
                sessionStorage.setItem("jwtToken", data.jwt_token);
                setUser({ ...data.user }); // Assuming data.user contains user info
                setIsLoggedIn(true);
                return { success: true, error: null };
            } else {
                return { success: false, error: data.message };
            }
        } catch (error) {
            console.error(error);
            return { success: false, error: error.message };
        }
    };

    const logout = () => {
        sessionStorage.removeItem("jwtToken");
        setUser({});
        setIsLoggedIn(false);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout, user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
