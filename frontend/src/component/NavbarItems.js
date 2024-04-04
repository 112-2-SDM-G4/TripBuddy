import React from 'react';
import * as IoIcons from 'react-icons/io5';
import * as TbIcons from "react-icons/tb";
import * as MdIcons from "react-icons/md";
import * as HiIcons from "react-icons/hi";

export const NavbarItems = [
  {
    title: '探索旅程',
    path: '/explore',
    icon: <MdIcons.MdOutlineTravelExplore />
  },
  {
    title: 'AI 助理',
    path: '/assistant',
    icon: <TbIcons.TbRobotFace />
  },
  {
    title: '我的旅程',
    path: '/mytrips',
    icon: <MdIcons.MdModeOfTravel />
  },
  {
    title: '其他',
    path: '/others',
    icon: <HiIcons.HiDotsHorizontal />
  },
  {
    title: '中英切換',
    path: '/others',
    icon: <IoIcons.IoLanguage />
  }
];