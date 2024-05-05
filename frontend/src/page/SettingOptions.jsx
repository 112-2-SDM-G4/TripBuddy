import React from 'react';
import { useNavigate } from "react-router-dom";

import style from "./SettingOptions.module.css";

import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { SettingOptionsData } from '../component/SettingOptionsData';

const SettingOptions = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className={style.main}>
            <div 
              className={style.row} 
              onClick={toggleLanguage}>
                <div className={style.icon}>
                    {SettingOptionsData[0]["icon"]}
                </div>
                {SettingOptionsData[0][language]}
            </div>

            <div 
              className={style.row} 
              onClick={() => navigate("/profile")}>

                <div className={style.icon}>
                    {SettingOptionsData[1]["icon"]}
                </div>
                {SettingOptionsData[1][language]}
            </div>

            <div 
              className={style.rowlogout} 
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
                <div className={style.icon}>
                    {SettingOptionsData[2]["icon"]}
                </div>
                {SettingOptionsData[2][language]}
            </div>
        </div>
    );
};

export default SettingOptions;
