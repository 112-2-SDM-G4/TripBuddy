import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState({});

    const login = async (email, password) => {
        const url = "/api/login";
        const method = "POST";
        const postData = { email, password };
    
        const response = await fetchWithJwt(url, method, postData);
        // Check if 'response' has 'success' field instead of 'valid'
        if (response.success) {
            const { jwt_token: jwtToken, ...userData } = response.data; 
            localStorage.setItem('jwtToken', jwtToken); // Store JWT in localStorage
            setUser(userData);
            setIsLoggedIn(true);
            return { success: true }; // Indicate login was successful
        } else {
            console.error(response.error);
            // Assuming 'response' has 'error' field for error message
            return { success: false, error: response.error }; // Provide error information
        }
    };

    const logout = () => {
        localStorage.removeItem('jwtToken'); // Remove JWT from localStorage
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
async function fetchWithJwt(url, method = 'GET', postData = null) {
    try {
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json',
                // Include the token only for requests that require authorization
                ...(localStorage.getItem('jwtToken') && { 'Authorization': `Bearer ${localStorage.getItem('jwtToken')}` }),
            },
        };

        if (postData) {
            options.body = JSON.stringify(postData);
        }

        // const response = await fetch(url, options);
        // if (!response.ok) {
        //     throw new Error(`HTTP error! status: ${response.status}`);
        // }
        // const data = await response.json();
        const data ={
            "valid": true,
            "jwt_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMTIzNDU2Nzg5MCIsIm5hbWUiOiLlsI_mmI4ifQ.f2QgkBxI2j09ks4XBnzDNOVBo-WKlbRp6f8FxfqgtKg",
            "language": "zh",
            "message": "登入成功"
        }

        return { success: true, data }; // Match the structure in 'login'

    } catch (error) {
        return { success: false, error: error.message }; // Corrected error handling
    }
}
