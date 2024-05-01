import React from 'react';
import style from "./DropdownItem.module.css";

const DropdownItem = ({ text, icon, onClick, setIsDropdownOpen, hoverRed=false }) => {
    return (
        <div className={hoverRed ? style.mainred : style.main} onClick={() => {
            onClick();
            setIsDropdownOpen(false);
        }}>
            <div className={style.item}>
                {icon}
            </div>
            <div className={style.item}>
                {text}
            </div>
        </div>
    );
};

export default DropdownItem;
