import React from 'react';
import style from "./Dropdown.module.css";

import { useNavigate } from "react-router-dom";
import { useAuth } from '../hooks/useAuth';
import { useLanguage } from '../hooks/useLanguage';
import { SettingOptionsData } from './SettingOptionsData';
import DropdownItem from './DropdownItem';

const Dropdown = ({ setIsDropdownOpen }) => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className={style.main}>
            <DropdownItem 
                text={SettingOptionsData[0][language]}
                icon={SettingOptionsData[0]["icon"]}
                onClick={toggleLanguage}
                setIsDropdownOpen={setIsDropdownOpen}
            />
            <DropdownItem 
                text={SettingOptionsData[1][language]}
                icon={SettingOptionsData[1]["icon"]}
                // onClick={() => navigate("/profile")}
                onClick={() => navigate("/profile")}
                setIsDropdownOpen={setIsDropdownOpen}
            />
            <DropdownItem 
                text={SettingOptionsData[2][language]}
                icon={SettingOptionsData[2]["icon"]}
                onClick={() => {
                    logout();
                    navigate("/");
                }}
                setIsDropdownOpen={setIsDropdownOpen}
                hoverRed={true}
            />
        </div>
    );
};

export default Dropdown;
