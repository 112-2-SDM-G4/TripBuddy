import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    const login = async (email, hashedPassword) => {
        const url = "/api/v1/login";
        const postData = { email, hashedPassword };

        try {
            // const response = await fetchWithJwt(url, "POST", postData);

            // // Check if response.ok to catch HTTP errors
            // if (!response.ok) {
            //     throw new Error(`HTTP error! status: ${response.status}`);
            // }

            // const data = await response.json();
            const data = {
                "valid": true,
                "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiLlsI_mmI4ifQ.f2QgkBxI2j09ks4XBnzDNOVBo-WKlbRp6f8FxfqgtKg",
                "user_name": "",
                "language": "zh",
                "message": "登入成功",
                "preference" : true
            }
            if (data.valid) {
                sessionStorage.setItem('jwtToken', data.jwt_token);
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
        sessionStorage.removeItem('jwtToken');
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

// fetchWithJwt function adjusted for error handling
async function fetchWithJwt(url, method = 'POST', postData = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(sessionStorage.getItem('jwtToken') && { 'Authorization': `Bearer ${sessionStorage.getItem('jwtToken')}` }),
        },
        ...(postData && { body: JSON.stringify(postData) }),
    };

    return fetch(url, options);
}
