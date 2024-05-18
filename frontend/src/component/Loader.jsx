import React from 'react';
import style from "./Loader.module.css";

const Loader = ({ isLoading }) => {
  return isLoading ? (
    <div className={style.container}>
      <div className={style.loader}>
      </div>
    </div>
  ) : null;
};

export default Loader;
