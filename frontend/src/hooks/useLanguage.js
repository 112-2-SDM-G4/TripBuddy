import React, { createContext, useState, useContext } from "react";

const LanguageContext = createContext();
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("zh");
    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === "en" ? "zh" : "en"));
    };
    return (
        <LanguageContext.Provider value={{ language, toggleLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
};
