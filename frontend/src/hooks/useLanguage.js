import React, { createContext, useState, useContext, useEffect } from "react";

const LanguageContext = createContext();
export const LanguageProvider = ({ children }) => {
    
    const [language, setLanguage] = useState("en");
    useEffect(()=>{
        const lang = localStorage.getItem("language")
        if(lang){
            setLanguage(lang)
        }
    },[])
    const toggleLanguage = () => {
        setLanguage((prevLanguage) => (prevLanguage === "en" ? "zh" : "en"));
    };
    useEffect(() => {
        document.documentElement.lang = language;
        document.title = language === "en" ? "Trip buddy" : "旅遊伴";
    }, [language]);
    return (
        <LanguageContext.Provider value={{ language, toggleLanguage, setLanguage }}>
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
