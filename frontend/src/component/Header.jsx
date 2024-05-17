import React, { useEffect, useState, useRef } from 'react';

import * as constants from '../constants';

import style from "./Header.module.css";
import { useTheme } from "../hooks/useTheme";
import { useWindowSize } from '../hooks/useWindowSize';
import { useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  return (
    <div className={style.main} onClick={(e) => {
      setIsDropdownOpen(false);
    }}>
      <img
        src="../../logoTitle.png"
        onClick={() => navigate('/explore')}
        onMouseDown={(e) => e.currentTarget.classList.add(style.active)}
        onMouseUp={(e) => e.currentTarget.classList.remove(style.active)}
        onMouseLeave={(e) => e.currentTarget.classList.remove(style.active)}
        alt="TripBuddy"
        className={style.logo}
      />


      <div className={style.switchcontainer}>
        {windowSize.width > constants.MOBILE_SCREEN_WIDTH && <NavbarItems />}

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
            {isDropdownOpen && (
              <div ref={dropdownRef}>
                <Dropdown setIsDropdownOpen={setIsDropdownOpen} />
              </div>
            )}
          </>}

      </div>
    </div>
  );
}

export default Header;