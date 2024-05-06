import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import style from "./NavbarItems.module.css";

import { useLanguage } from "../hooks/useLanguage";
import { useWindowSize } from "../hooks/useWindowSize";
import { fetchWithJwt } from "../hooks/fetchWithJwt";

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
