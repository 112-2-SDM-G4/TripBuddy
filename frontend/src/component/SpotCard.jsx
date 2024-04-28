import React, { useState } from "react";
import style from "./SpotCard.module.css";
import { AiOutlinePlusCircle } from "react-icons/ai";
import AddPageforTrip from "./AddPageforTrip";

function SpotCard({ name, src, spotId, onClick }) {
    const [addPage, showAddPage] = useState(false);

    return (
        <>
            {addPage && (
                <AddPageforTrip
                    close={() => showAddPage(false)}
                    spot={{ name, src, spotId }}
                />
            )}
            <div
                className={style.card}
                onClick={onClick}
            >
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
