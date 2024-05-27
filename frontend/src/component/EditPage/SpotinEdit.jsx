import React, { useState } from "react";
import style from "./SpotinEdit.module.css";
import { IoMdClose } from "react-icons/io";
import { useLanguage } from "../../hooks/useLanguage";

export default function SpotinEdit({
    spot,
    delSpot,
    setOpenedSpot,
    locked = false,
}) {
    const { language } = useLanguage();
    const words = {
        zh: {
            budget: "預算",
            stay: "停留",
            hr: "時",
            min: "分",
        },
        en: {
            budget: "Budget",
            stay: "Stay",
            hr: "hr",
            min: "min",
        },
    };
    const tryvalid = (obj) => {
        if (obj) return obj;
        return "";
    };
    const formatNumber = (num) => {
        return num.toString().length < 2 ? ` 0${num} ` : ` ${num} `;
    };

    return (
        <div
            className={`${style.block} ${locked && style.blocklocked}`}
            onClick={() => setOpenedSpot(spot)}
        >
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
                        <div className={style.stay}>{`${
                            words[language]["stay"]
                        }${formatNumber(tryvalid(spot["stay_time"][0]))}${
                            words[language]["hr"]
                        }${formatNumber(tryvalid(spot["stay_time"][1]))}${
                            words[language]["min"]
                        }`}</div>
                        <div className={style.comment}>
                            {words[language]["budget"] + ": "}
                            {tryvalid(spot["money"])}
                        </div>
                        <div className={style.comment}>
                            {tryvalid(spot["comment"])}
                        </div>
                    </div>
                    {!locked && (
                        <button
                            className={style.closebt}
                            onClick={() => {
                                delSpot();
                            }}
                        >
                            <IoMdClose className={style.closebt} />
                        </button>
                    )}
                </>
            )}
        </div>
    );
}
