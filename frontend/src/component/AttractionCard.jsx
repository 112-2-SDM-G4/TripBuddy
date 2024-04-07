import React from 'react';
import style from "./AttractionCard.module.css";
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlusCircle } from 'react-icons/ai';

function AttractionCard({ name, src, attractionId}) {
  const navigate = useNavigate();

  return (
    <div className={style.card} onClick={() => navigate(`/attraction/${attractionId}`)}>
        <img src={src} alt="Logo" className={style.img}/>
        <div className={style.infocontainer}>
            <div>{name}</div>
            <div className={style.icon}><AiOutlinePlusCircle size={20}/></div>
        </div>
    </div>
  );
}

export default AttractionCard;