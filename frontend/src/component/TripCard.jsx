import React, { useState } from "react";
import style from "./TripCard.module.css";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import { IoMdHeartEmpty } from "react-icons/io";

import AddPageforTrip from "./AddPageforTrip";

function TripCard({ name, src, tripId }) {
    const navigate = useNavigate();
    const [addPage, showAddPage] = useState(false);

    return (
    <>
        {addPage && (
            <AddPageforTrip
                close={() => showAddPage(false)}
                spot={{ name, src, tripId }}
            />
        )}
        <div
            className={style.card}
            onClick={() => navigate(`/edit`)}
            // onClick={() => navigate(`/edit/${tripId}`)}
        >
            <img src={src} alt="spot loading" className={style.img} />
            <div className={style.info} >
                <div className={style.title}>
                    <div>{name}</div>
                    <div className={style.icons}>
                        <div className={style.icon}><IoMdHeartEmpty size={20} /></div>
                        <div 
                            className={style.icon}
                            onClick={(event) => {
                                showAddPage(true);
                                event.stopPropagation();
                            }}
                        >
                                <AiOutlinePlusCircle size={20} />
                        </div>
                    </div>
                </div>

                <div className={style.tags}>
                    <div className={style.tag}>#family</div>
                    <div className={style.tag}>#casual</div>
                    <div className={style.tag}>#landscape viewing</div>
                </div>

            </div>
        </div>
    </>
    );
}

export default TripCard;
