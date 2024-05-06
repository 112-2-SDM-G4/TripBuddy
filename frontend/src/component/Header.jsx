import React, { useEffect, useState } from 'react';

import * as constants from '../constants';

import style from "./Header.module.css";
import { useTheme } from "../hooks/useTheme";
import { useWindowSize } from '../hooks/useWindowSize';
import { fetchWithJwt } from '../hooks/fetchWithJwt';

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
  const [isLoading, setIsLoading] = useState(false);

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");

  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     // fetchWithJwt(`/api/v1/tag/get_tags?source=UserProfile`, "GET")
  //     try {
  //         const response = await fetchWithJwt(`/api/v1/user/get_info`, 'GET');
  //         if(response.status !== 200) {
  //             throw new Error(`HTTP error! Status: ${response.status}`);
  //         }
  //         const data = await response.json();

  //         setUsername(data["user_name"]);
  //         setAvatar(data["avatar"] + 1);
  //         console.log("user info:", data);
  //     } catch (error) {
  //         console.error('Failed to fetch user info:', error);
  //     }
  //   };
  //   if(isLoggedIn) {
  //     getUserInfo();
  //   }

  // }, [userInfo, isLoggedIn])


  useEffect(() => {
    if(isLoggedIn) {
      const userDataString = sessionStorage.getItem("user");
      if (userDataString) {
        const userData = JSON.parse(userDataString);
        setUsername(userData["user_name"]);
      } else {
        // Handle case when user data is not available
        console.error("User data not found in sessionStorage");
      }
  
      const avatarDataString = sessionStorage.getItem("avatar");
      if (avatarDataString) {
        const avatarData = JSON.parse(avatarDataString);
        setAvatar(avatarData + 1);
      } else {
        // Handle case when avatar data is not available
        console.error("Avatar data not found in sessionStorage");
      }
    }

  }, [isLoggedIn])

  return (
    <div className={style.main} onClick={(e) => {
          setIsDropdownOpen(false);
        }}>
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