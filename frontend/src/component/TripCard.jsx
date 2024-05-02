import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import style from "./TripCard.module.css";
import { IoMdHeartEmpty } from "react-icons/io";
import Tag from "./Tag";

function TripCard({ 
    name, 
    src, 
    tripId, 
    tagNames,
    isPublic=false
}) {
    const navigate = useNavigate();

    const handleCopyTrip = async () => {
        // TODO: copy other's to my trip   
        // get this trip data
        // add to my trip
    }

    return (
        <div
            className={style.card} 
            onClick={() => {navigate(`/edit/${tripId}`)}}
        >
            <img src={src} alt="spot loading" className={style.img} />
            <div className={style.info}>
                <div className={style.title}>  
                    <div>{name}</div>
                    <div className={style.icons}>
                        <div
                            className={style.icon}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            <IoMdHeartEmpty size={20} />
                        </div>
                        {isPublic && 
                            <div
                                className={style.icon}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    handleCopyTrip();
                                    navigate(`/edit/${tripId}`)
                                }}
                            >
                                <AiOutlinePlusCircle size={20} />
                            </div>
                        }
                    </div>
                </div>
                {isPublic &&
                    <div className={style.tags}>
                        {tagNames.map(tagName => 
                            <Tag 
                                key={tagName}
                                text={tagName}
                            />
                        )}
                    </div>
                }
            </div>
        </div>
    );
}

export default TripCard;
