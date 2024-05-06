import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import style from "./NavbarItems.module.css";

import { useLanguage } from "../hooks/useLanguage";
import { useWindowSize } from "../hooks/useWindowSize";

import { NavbarItemsData } from "./NavbarItemsData";
import * as constants from "../constants";

import Avatar from "./Avatar";
import { useAuth } from "../hooks/useAuth";

function NavbarItem() {
    const navigate = useNavigate();
    const windowSize = useWindowSize();
    const { language } = useLanguage();
    const { isLoggedIn, userInfo } = useAuth();
    const [activeTab, setActiveTab] = useState("explore");

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
            setAvatar(avatarData + 1);
            }).catch(error => {
            console.error("Error waiting for avatar data:", error);
            });
        }
    }, [userInfo, isLoggedIn]);
    

    return (
        <div className={style.tabcontainer}>
            {NavbarItemsData.map((item, index) => {
                return (
                    <div
                        key={index}
                        className={style.tab}
                        onClick={() => {
                            setActiveTab(item.tabname);
                            navigate(item.path);
                        }}
                    >
                        <div className={style.icon}>
                            {/* <IconContext.Provider value={{ style: { color: "blue", fill: "light blue" } }}> */}
                            {item.icon}
                            {/* </IconContext.Provider> */}
                        </div>

                        <div
                            className={
                                activeTab === item.tabname
                                    ? style.titlefocus
                                    : style.title
                            }
                        >
                            {language === "en" ? item.entitle : item.zhtitle}
                        </div>
                    </div>
                );
            })}

        {windowSize.width < constants.MOBILE_SCREEN_WIDTH && isLoggedIn
            && 
            <Avatar 
                src={`../../${avatar}.png`} 
                alt={username}
                username={username}
                onClick={() => navigate("setting-options")}
            />}
        </div>
    );
}

export default NavbarItem;
