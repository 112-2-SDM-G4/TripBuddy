import React from 'react';
import { IoLanguage } from 'react-icons/io5';
import { TbRobotFace } from "react-icons/tb";
import { MdOutlineTravelExplore, MdModeOfTravel } from "react-icons/md";
import { HiDotsHorizontal } from "react-icons/hi";


export const NavbarItems = [
  {
    tabname: 'explore',
    entitle: 'Explore',
    zhtitle: '探索旅程',
    path: '/explore',
    icon: <MdOutlineTravelExplore />
  },
  {
    tabname: 'assistant',
    entitle: 'AI Assistant',
    zhtitle: 'AI 助理',
    path: '/assistant',
    icon: <TbRobotFace />
  },
  {
    tabname: 'mytrips',
    entitle: 'My Trips',
    zhtitle: '我的旅程',
    path: '/mytrips',
    icon: <MdModeOfTravel />
  },
  {
    tabname: 'others',
    entitle: 'Others',
    zhtitle: '其他',
    path: '/others',
    icon: <HiDotsHorizontal />
  },
  // {
  //   title: '中英切換',
  //   path: '/others',
  //   icon: <IoLanguage />
  // }
];