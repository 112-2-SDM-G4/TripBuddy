import React, { useState } from 'react';
import { IoLanguage } from 'react-icons/io5';

import * as constants from '../constants';

import style from "./Header.module.css";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useWindowSize } from '../hooks/useWindowSize';

import { ColorButton } from "./ColorButton";

import NavbarItems from './NavbarItems';
import Avatar from './Avatar';
import Dropdown from './Dropdown';
import { useAuth } from '../hooks/useAuth';

function Header() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isLoggedIn } = useAuth();
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
                <Avatar src={"https://picsum.photos/200"} alt="test" 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}/>
                {isDropdownOpen && <Dropdown setIsDropdownOpen={setIsDropdownOpen} />}
              </>}
            
        </div> 
    </div>
  );
}

export default Header;