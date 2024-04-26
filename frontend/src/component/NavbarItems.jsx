import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import style from "./NavbarItems.module.css";
import { useLanguage } from "../hooks/useLanguage";

import { NavbarItemsData } from "./NavbarItemsData";

function NavbarItem() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("explore");
    const { language } = useLanguage();

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
        </div>
    );
}

export default NavbarItem;
