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
import { useHeader } from './HeaderContext';
import { useAuth } from "../hooks/useAuth";

function Header() {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const windowSize = useWindowSize();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  const { headerState, updateHeader } = useHeader(); // Use HeaderContext
  const { userName, avatar } = headerState;
  const { isLoggedIn } = useAuth();

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

  useEffect(() => {
    if (isLoggedIn) {
      const user = sessionStorage.getItem("user");
      const avatar = sessionStorage.getItem("avatar");

      if (user) {
        const userData = JSON.parse(user);
        const newUserName = userData.user_name || null;
        const newAvatar = avatar || 0;
        
        if (newUserName !== headerState.userName || newAvatar !== headerState.avatar) {
          updateHeader({
            userName: newUserName,
            avatar: newAvatar,
          });
        }
      }
    }
  }, [isLoggedIn, updateHeader, headerState.userName, headerState.avatar]);

  return (
    <div className={style.main} onClick={() => setIsDropdownOpen(false)}>
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
          <ColorButton isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
        </div>

        {windowSize.width > constants.MOBILE_SCREEN_WIDTH && isLoggedIn &&
          <>
            <Avatar
              src={`../../${avatar}.png`}
              alt={userName}
              username={userName}
              onClick={(e) => {
                e.stopPropagation();
                setIsDropdownOpen(!isDropdownOpen);
              }}
            />
            {isDropdownOpen && (
              <div ref={dropdownRef}>
                <Dropdown setIsDropdownOpen={setIsDropdownOpen} />
              </div>
            )}
          </>
        }
      </div>
    </div>
  );
}

export default Header;
