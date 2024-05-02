import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import style from "./PostCard.module.css";
import Tag from "./Tag";

function PostCard({ name, src, tripId, tagNames }) {
    const navigate = useNavigate();

    return (
        <div className={style.card} onClick={() => navigate(`/edit/${tripId}`)}>
            <img src={src} alt="spot loading" className={style.img} />
            <div className={style.row}>
                <div className={style.infotxt}>{name}</div>

                <div
                    className={style.icon}
                    onClick={(event) => {
                        event.stopPropagation();
                    }}
                >
                    <IoMdHeartEmpty size={20} />
                </div>
                <div
                    className={style.icon}
                    onClick={() => navigate(`/edit/${tripId}`)}
                >
                    <AiOutlinePlusCircle size={20} />
                </div>
            </div>

            <div className={style.tags}>
                {tagNames.map(tagName => 
                    <Tag 
                        key={tagName}
                        text={tagName}
                    />
                )}
            </div>
            
        </div>
    );
}

export default PostCard;
