import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./NavbarItems.module.css";

import { useLanguage } from "../hooks/useLanguage";
import { useWindowSize } from "../hooks/useWindowSize";

import { NavbarItemsData } from "./NavbarItemsData";
import * as constants from "../constants";

import Avatar from "./Avatar";

function NavbarItem() {
    const navigate = useNavigate();
    const windowSize = useWindowSize();
    const { language } = useLanguage();
    const [activeTab, setActiveTab] = useState("explore");


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

        {windowSize.width < constants.MOBILE_SCREEN_WIDTH 
            && 
            <Avatar 
                src={"https://picsum.photos/200"}
                alt="test"
                onClick={() => navigate("setting-options")}
            />}
        </div>
    );
}

export default NavbarItem;
