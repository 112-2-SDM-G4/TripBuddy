import React, { useState } from "react";
import style from "./SpotCard.module.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import AddPageforTrip from "./AddPageforTrip";
import { useNavigate } from "react-router-dom";

function SpotCard({ name, src, spotId, refreshTrip, spotData, onClick }) {
    const navigate = useNavigate();
    const [addPage, showAddPage] = useState(false);

    return (
        <>
            {addPage && (
                <AddPageforTrip
                    close={() => showAddPage(false)}
                    spot={{ name, src, spotId }}
                    spotData={spotData}
                    refreshTrip={refreshTrip ? refreshTrip : null}
                />
            )}
            <div className={style.card} onClick={() => navigate(`/spot/${spotId}`)}>
                <img src={src} alt="spot loading" className={style.img} />
                <div className={style.infocontainer}>
                    <div className={style.infotxt}>{name}</div>
                    <div
                        className={style.icon}
                        onClick={(event) => {
                            event.stopPropagation();
                            showAddPage(true);
                        }}
                    >
                        <AiOutlinePlusCircle size={20} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default SpotCard;
