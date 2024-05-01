import React from "react";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { FaPlaneDeparture } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import style from "./TripCard.module.css";
import { IoMdHeartEmpty } from "react-icons/io";
import { useLanguage } from "../hooks/useLanguage";

function TripCard({ 
    name, 
    src, 
    tripId, 
    tagNames,
    isPublic=false,
    isUpcoming=false,
    isPost=false, // for explore page
    tripStartDate=null // for upcoming trip
}) {
    const navigate = useNavigate();
    const { language } = useLanguage();

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
                        {isUpcoming
                            ? 
                            <div className={style.rows}>
                                <div>{name}</div>
                                <div className={style.rowdepart}>
                                    <div className={style.icondepart}>
                                        <FaPlaneDeparture 
                                            size={17}
                                            style={{ fill: "var(--secondarycolor)" }}
                                        />
                                    </div>
                                    {language === "en"
                                        ? `Department on ${tripStartDate[0]}/${tripStartDate[1]}`
                                        : `${tripStartDate[0]}/${tripStartDate[1]} 出發`}
                                </div>
                            </div>
                          
                            :<div>{name}</div>}
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
