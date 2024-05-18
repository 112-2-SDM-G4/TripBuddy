import React from 'react';
import style from "./Avatar.module.css";

const Avatar = ({ src, alt, onClick, username }) => {
    return (
        <div className={style.container}>
            <div className={style.circle} onClick={onClick}>
                <img src={src} alt={alt} />
            </div>
            <div className={style.username}>{username}</div>
        </div>
    );
};

export default Avatar;
