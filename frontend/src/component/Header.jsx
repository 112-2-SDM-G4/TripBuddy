import React from 'react';
import { IoLanguage } from 'react-icons/io5';

import * as constants from '../constants';

import style from "./Header.module.css";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";
import { useWindowSize } from '../hooks/useWindowSize';

import { ColorButton } from "./ColorButton";

import NavbarItems from './NavbarItems';

function Header() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { toggleLanguage } = useLanguage();
  const windowSize = useWindowSize();

  return (
    <div className={style.main}>
          <div>TripBuddy</div>
          {windowSize.width > constants.MOBILE_SCREEN_WIDTH && <NavbarItems />}

        <div className={style.switchcontainer}>
            <div className={style.switch} onClick={toggleLanguage}>
            <IoLanguage size={20}/>
            </div>

            <div className={style.switch}>
              <ColorButton
                  isDarkMode={isDarkMode}
                  setIsDarkMode={setIsDarkMode}
              ></ColorButton>
            </div> 

            <div className={style.avatar}>

            </div>
        </div> 
    </div>
  );
}

export default Header;