import React from 'react';
import style from "./Avatar.module.css";
import * as constants from '../constants';

import { useNavigate } from "react-router-dom";
import { useWindowSize } from '../hooks/useWindowSize';
import { useAuth } from '../hooks/useAuth';



const Avatar = ({ src, alt, onClick }) => {
    const navigate = useNavigate();
    const windowSize = useWindowSize();
    // const { username } = useAuth();
    const username = "polllly"


    return (
        <div className={style.container}>
            <div className={style.circle} onClick={onClick}>
                <img src={src} alt={alt} />
            </div>
            {windowSize.width < constants.MOBILE_SCREEN_WIDTH && 
                <div className={style.username}>{username}</div>}
        </div>
    );
};

export default Avatar;
