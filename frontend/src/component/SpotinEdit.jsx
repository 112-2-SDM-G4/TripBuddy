import React from "react";
import style from "./SpotinEdit.module.css";
import { IoMdClose } from "react-icons/io";

export default function SpotinEdit({ spot, delSpot }) {
    const tryvalid = (obj) => {
        if (obj) return obj;
        return "";
    };
    const formatNumber = (num) => {
        return num < 10 ? ` 0${num} ` : ` ${num} `;
    };

    return (
        <div className={style.block}>
            {spot && (
                <>
                    <img
                        className={style.pic}
                        src={tryvalid(spot["spot_image"])}
                        alt="暫無圖片"
                    />
                    <div className={style.info}>
                        <div className={style.title}>
                            {tryvalid(spot["spot_name"])}
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
        </div>
    );
}
