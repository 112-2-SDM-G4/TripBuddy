import React, { useState } from 'react';
import * as FaIcons from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { SidebarItem } from './SidebarItem';

import style from "./Sidebar.module.css";

function Sidebar() {
  const [sidebar, setSidebar] = useState(true);

  const showSidebar = () => setSidebar(!sidebar);

  return (
    <div className={style.main}>
        <div className={style.sidebaricon}>
          <Link to='#'>
            <FaIcons.FaBars onClick={showSidebar} />
          </Link>
        </div>
        {sidebar &&
        <div className={style.menu}>
            <div className={style.menuitems}>
                {SidebarItem.map((item, index) => {
                return (
                    <div key={index} className={style.menuitem}>
                    <Link to={item.path}>
                        {item.icon}
                        <div className={style.menuitemtext}>
                          {item.title}
                        </div>
                    </Link>
                    </div>
                );
                })}
            </div>
        </div>
        }
    </div>
  );
}

export default Sidebar;