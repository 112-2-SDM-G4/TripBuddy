import React from "react";
import style from "./SpotinEdit.module.css";

export default function SpotinEdit({ spot }) {
    console.log(spot);

    const formatNumber = (num) => {
        return num < 10 ? ` 0${num} ` : ` ${num} `;
    };

    return (
        <div className={style.block}>
            <img
                className={style.pic}
                src={spot["spot_image"]}
                alt="暫無圖片"
            />
            <div className={style.info}>
                <div className={style.time}>{spot["stay_time"][0]}</div>
                <div className={style.title}>{spot["spot_name"]}</div>
                <div className={style.stay}>{`停留${formatNumber(
                    spot["stay_time"][0]
                )}時${formatNumber(spot["stay_time"][1])}分`}</div>
                <div className={style.comment}>{spot["comment"]}</div>
            </div>
        </div>
    );
}
