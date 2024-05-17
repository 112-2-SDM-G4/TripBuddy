import React from "react";
import { TbRobotFace } from "react-icons/tb";
import { MdOutlineTravelExplore, MdModeOfTravel } from "react-icons/md";

export const NavbarItemsData = [
    {
        tabname: "explore",
        entitle: "Explore",
        zhtitle: "探索旅程",
        path: "/explore",
        icon: <MdOutlineTravelExplore />,
    },
    {
        tabname: "assistant",
        entitle: "AI Assistant",
        zhtitle: "AI 助理",
        path: "/assistant",
        icon: <TbRobotFace />,
    },
    {
        tabname: "mytrips",
        entitle: "My Trips",
        zhtitle: "我的旅程",
        path: "/mytrips",
        icon: <MdModeOfTravel />,
    }
];
