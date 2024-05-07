import React, { useEffect, useState } from 'react';

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

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  function waitForSessionData(key) {
    return new Promise((resolve, reject) => {
      const checkData = () => {
        const dataString = sessionStorage.getItem(key);
        if (dataString) {
          const data = JSON.parse(dataString);
          resolve(data);
        } else {
          setTimeout(checkData, 100); // 每100毫秒检查一次
        }
      };
  
      checkData();
    });
  }
  
  useEffect(() => {
    if (isLoggedIn) {
      waitForSessionData("user").then(userData => {
        setUsername(userData["user_name"]);
      }).catch(error => {
        console.error("Error waiting for user data:", error);
      });
  
      waitForSessionData("avatar").then(avatarData => {
        setAvatar(avatarData);
      }).catch(error => {
        console.error("Error waiting for avatar data:", error);
      });
    }
  }, [userInfo, isLoggedIn]);

  return (
    <div className={style.main} onClick={(e) => {
          setIsDropdownOpen(false);
        }}>
        <img src="../../logoTitle.png" alt="TripBuddy" />
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
                    src={`../../${avatar}.png`} 
                    alt={username}
                    username={username}
                    onClick={(e) => {
                      e.stopPropagation();
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