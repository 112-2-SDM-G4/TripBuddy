// HeaderContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';

const HeaderContext = createContext();

export const HeaderProvider = ({ children }) => {
    const [headerState, setHeaderState] = useState({
        userName: null,
        avatar: 0,
    });

    useEffect(() => {
        const user = sessionStorage.getItem("user");
        const avatar = sessionStorage.getItem("avatar");

        if (user) {
            
            const userData = JSON.parse(user);
            // alert(userData.user_name);
            setHeaderState({
                userName: userData.user_name || null,
                avatar: avatar || 0,
            });
        }
    }, []);

    const updateHeader = (newState) => {
        setHeaderState((prevState) => ({
            ...prevState,
            ...newState,
        }));
    };

    return (
        <HeaderContext.Provider value={{ headerState, updateHeader }}>
            {children}
        </HeaderContext.Provider>
    );
};

export const useHeader = () => useContext(HeaderContext);
