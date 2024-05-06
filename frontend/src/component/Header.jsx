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
import { fetchWithJwt } from '../hooks/fetchWithJwt';

function Header() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { isLoggedIn } = useAuth();
  const windowSize = useWindowSize();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [username, setUsername] = useState("hihihi");

  // useEffect(() => {
  //   const getInfo = async () => {
  //     try {
  //       const response = await fetchWithJwt(`/api/v1/user/get_info?`, 'GET');
  //       if(!response.OK) {
  //           throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();
  //       setUserInfo(data);
  //   } catch (error) {
  //       console.error('Failed to fetch group members:', error);
  //       // setError('Failed to load group members');
  //   }

  //   }
  //   getInfo();

  // }, [])

  // useEffect(() => {
  //   const userDataString = sessionStorage.getItem('user');
  //   const userData = JSON.parse(userDataString);
  //   setUsername(userData?.user_name)
  //   console.log('username: ' + userData.user_name)

  // }, [isLoggedIn])


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
                    src={"../../1.png"} 
                    alt={"../../1.png"}
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