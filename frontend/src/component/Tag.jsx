import React from 'react';
import style from "./Tag.module.css";
import { IoMdClose } from "react-icons/io";

const Tag = ({ tagId, text, onClick, inSearchbox=false, removeFromSearch=()=>{} }) => {
  return (
    <div
        className={style.main} 
        onClick={onClick}
    >
        {text}  
        {inSearchbox &&
        <div className={style.icon} onClick={(e) => {
            e.stopPropagation();
            removeFromSearch(tagId);
        }}>
          <IoMdClose size={13}/>
        </div>}
    </div>
  );
}

export default Tag;
