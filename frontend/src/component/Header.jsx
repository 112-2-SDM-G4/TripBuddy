import React from 'react';
import style from "./Header.module.css";
import { NavbarItems } from './NavbarItems';
import { useNavigate } from 'react-router-dom';


function Header() {
  const navigate = useNavigate();

  return (
    <div className={style.main}>
        <div className={style.itemcontainer}>
        {NavbarItems.map((item, index) => {
            return (
                <div key={index} className={style.item} onClick={() => navigate(item.path)}>
                    <div className={style.icon}>
                    {item.icon}
                    </div>
                    {item.title}

                </div>
            );
            })}
        </div>
    </div>
  );
}

export default Header;