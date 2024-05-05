import React, { useState } from "react";
import style from "./SpotinEdit.module.css";
import { IoMdClose } from "react-icons/io";
import EditViewSpot from "./EditViewSpot";

export default function SpotinEdit({ spot, delSpot, updateSpotData, locked=false }) {
    const [openEdit, setOpenEdit] = useState(false);

    const tryvalid = (obj) => {
        if (obj) return obj;
        return "";
    };
    const formatNumber = (num) => {
        return num.toString().length < 2 ? ` 0${num} ` : ` ${num} `;
    };

    return (
        <div className={style.block} onClick={() => setOpenEdit(true)}>
            {spot && (
                <>
                    <img
                        className={style.pic}
                        src={tryvalid(spot["image"])}
                        alt="暫無圖片"
                    />
                    <div className={style.info}>
                        <div className={style.title}>
                            {tryvalid(spot["name"])}
                        </div>
                        <div className={style.stay}>{`停留${formatNumber(
                            tryvalid(spot["stay_time"][0])
                        )}時${formatNumber(
                            tryvalid(spot["stay_time"][1])
                        )}分`}</div>
                        <div className={style.comment}>
                            {tryvalid(spot["comment"])}
                        </div>
                    </div>
                    <button
                        className={style.closebt}
                        onClick={() => {
                            delSpot();
                        }}
                    >
                        <IoMdClose className={style.closebt} />
                    </button>
                </>
            )}
            {openEdit && (
                <EditViewSpot
                    spot={spot}
                    onClose={() => setOpenEdit(false)}
                    updateSpotData={updateSpotData}
                    locked={locked}
                />
            )}
        </div>
    );
}
