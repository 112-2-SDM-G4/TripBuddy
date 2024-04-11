import React from "react";
import style from "./AddPageforTrip.module.css";
import { useLanguage } from "../hooks/useLanguage";

export default function AddPageforTrip({ close }) {
    const { language } = useLanguage();
    return (
        <div className={style.background} onClick={close}>
            <div className={style.container}>
                <div className={style.title}>要加在哪?</div>
            </div>
        </div>
    );
}
