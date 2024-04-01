import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarItem = [
  {
    title: 'Explore',
    path: '/explore',
    icon: <AiIcons.AiFillHome />
  },
  {
    title: 'AI Assistant',
    path: '/aiassistant',
    icon: <IoIcons.IoIosPaper />
  },
  {
    title: 'My Trips',
    path: '/mytrips',
    icon: <FaIcons.FaCartPlus />
  },
  {
    title: 'Others',
    path: '/others',
    icon: <IoIcons.IoMdPeople />
  },
  {
    title: '中英切換',
    path: '/others',
    icon: <IoIcons.IoMdPeople />
  }
];