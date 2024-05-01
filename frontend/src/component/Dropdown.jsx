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

    const [setlang, setprofile, setlogout] = SettingOptionsData;

    return (
        <div className={style.main}>
            <DropdownItem 
                text={setlang[language]}
                icon={setlang["icon"]}
                onClick={toggleLanguage}
                setIsDropdownOpen={setIsDropdownOpen}
            />
            <DropdownItem 
                text={setprofile[language]}
                icon={setprofile["icon"]}
                // onClick={() => navigate("/profile")}
                onClick={() => navigate("/profile-setup")}
                setIsDropdownOpen={setIsDropdownOpen}
            />
            <DropdownItem 
                text={setlogout[language]}
                icon={setlogout["icon"]}
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
