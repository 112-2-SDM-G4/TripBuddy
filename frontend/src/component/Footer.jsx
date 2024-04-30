import React from 'react';
import style from "./Footer.module.css";

import NavbarItems from './NavbarItems';

function Footer() {
  return (
    <div className={style.main}>
          <NavbarItems />
    </div>
  );
}

export default Footer;