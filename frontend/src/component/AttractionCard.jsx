import React, { useState } from "react";
import style from "./AttractionCard.module.css";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlusCircle } from "react-icons/ai";
import AddPageforTrip from "./AddPageforTrip";

function AttractionCard({ name, src, attractionId }) {
    const navigate = useNavigate();
    const [addPage, showAddPage] = useState(false);

    return (
        <>
            {addPage && <AddPageforTrip close={() => showAddPage(false)} />}
            <div
                className={style.card}
                onClick={() => navigate(`/attraction/${attractionId}`)}
            >
                <img src={src} alt="spot loading" className={style.img} />
                <div className={style.infocontainer}>
                    <div>{name}</div>
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
        </>
    );
}

export default AttractionCard;
