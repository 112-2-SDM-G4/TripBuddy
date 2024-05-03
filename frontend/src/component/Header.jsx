import React, { useState } from 'react';

import * as constants from '../constants';

import style from "./Header.module.css";
import { useTheme } from "../hooks/useTheme";
import { useWindowSize } from '../hooks/useWindowSize';

import { ColorButton } from "./ColorButton";

import NavbarItems from './NavbarItems';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isLoggedIn, userInfo } = useAuth();
  const windowSize = useWindowSize();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);


  return (
    <div className={style.main}>
        <div className={style.title}>TripBuddy</div>
        {windowSize.width > constants.MOBILE_SCREEN_WIDTH && <NavbarItems />}

        <div className={style.switchcontainer}>
            {/* <div className={style.switch} onClick={toggleLanguage}>
            <IoLanguage size={20}/>
            </div> */}

            <div className={style.switch}>
              <ColorButton
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
              ></ColorButton>
            </div> 

            {windowSize.width > constants.MOBILE_SCREEN_WIDTH && isLoggedIn
              &&
              <>
                <Avatar 
                    src={userInfo.avatar} 
                    alt={userInfo.user_name}
                    username={userInfo.user_name}
                    onClick={() => {
                      console.log("userinfo", userInfo);
                      setIsDropdownOpen(!isDropdownOpen);
                    }}
                />
                {isDropdownOpen && <Dropdown setIsDropdownOpen={setIsDropdownOpen} />}
              </>}
            
        </div> 
    </div>
  );
}

export default Header;