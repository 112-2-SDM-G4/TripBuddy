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
    const [setlang, setprofile, setlogout] = SettingOptionsData;

    return (
        <div className={style.main}>
            <div 
              className={style.row} 
              onClick={toggleLanguage}>
                <div className={style.icon}>
                    {setlang["icon"]}
                </div>
                {setlang[language]}
            </div>

            <div 
              className={style.row} 
              // onClick={() => navigate("/profile")}>
              onClick={() => navigate("/profile-setup")}>

                <div className={style.icon}>
                    {setprofile["icon"]}
                </div>
                {setprofile[language]}
            </div>

            <div 
              className={style.rowlogout} 
              onClick={() => {
                logout();
                navigate("/");
              }}
            >
                <div className={style.icon}>
                    {setlogout["icon"]}
                </div>
                {setlogout[language]}
            </div>
        </div>
    );
};

export default SettingOptions;
