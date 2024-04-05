import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoLanguage } from 'react-icons/io5';

import style from "./Header.module.css";
import { useTheme } from "../hooks/useTheme";
import { useLanguage } from "../hooks/useLanguage";

import { NavbarItems } from './NavbarItems';
import { ColorButton } from "./ColorButton";



function Header() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("explore");
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { words, language, toggleLanguage } = useLanguage();


  return (
    <div className={style.main}>
          <div>TripBuddy</div>
          <div className={style.tabcontainer}>
          {NavbarItems.map((item, index) => {
              return (
                  <div key={index} className={style.tab} onClick={() => {
                    setActiveTab(item.tabname)
                    navigate(item.path)
                  }}>
                      <div className={style.icon}>
                      {item.icon}
                      </div>

                      <div className={activeTab === item.tabname ? style.titlefocus : style.title}>
                      {language === "en" ? item.entitle : item.zhtitle}
                      </div>

                  </div>
              );
              })}
          </div>
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
        </div> 
    </div>
  );
}

export default Header;