import React, { createContext, useState, useContext, useEffect } from "react";
import dictionary from "../assets/zhAnden.json";

const LanguageContext = createContext();
export const LanguageProvider = ({ children }) => {
    const [language, setLanguage] = useState("en");
    const [words, setWords] = useState(dictionary["en"]);
    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === "en" ? "zh" : "en"));
    };
    useEffect(() => {
        document.documentElement.lang = language;
        document.title = language === "en" ? "Tour buddy" : "旅遊伴";
        setWords(dictionary[language]);
    }, [language]);
    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, words }}>
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
