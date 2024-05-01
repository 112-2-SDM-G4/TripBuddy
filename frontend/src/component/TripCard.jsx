import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { useNavigate } from "react-router-dom";

import style from "./TripCard.module.css";
import { IoMdHeartEmpty } from "react-icons/io";

function TripCard({ 
    name, 
    src, 
    tripId, 
    tagNames,
    isPublic=false,
    isUpcoming=false,
    isPost=false // for explore page
}) {
    const navigate = useNavigate();

    const handleCopyTrip = async () => {
        // TODO: copy other's to my trip   
        // get this trip data
        // add to my trip
    }

    return (
        <>
            <div
                className={isUpcoming ? style.upcomingcard : style.card}
                onClick={() => {
                    if(isPost) {
                        // TODO: view post
                        // navigate(`/post/${tripId}`)
                        navigate(`/edit/${tripId}`)
                    } else {
                        navigate(`/edit/${tripId}`)
                    }
                }}
            >
                <img src={src} alt="spot loading" className={style.img} />
                <div className={`${style.info} ${!isUpcoming && style.infopadding}`}>
                    <div className={`${style.title} ${!isUpcoming && style.titlemargin}`}>
                        <div>{name}</div>
                        <div className={style.icons}>
                            {!isUpcoming && 
                                <div
                                    className={style.icon}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                    }}
                                >
                                    <IoMdHeartEmpty size={20} />
                                </div>
                            }
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
                            {tagNames.map(tagName => <div className={style.tag}>{tagName}</div>)}
                        </div>
                    }
                </div>
            </div>
        </>
    );
}

export default TripCard;
