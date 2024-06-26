import React, { useEffect, useState } from "react";
import style from "./TimePicker.module.css";
import { useLanguage } from "../hooks/useLanguage";

export default function TimePicker({ changeTime, setTime = ["00", "00"] }) {
    const words = {
        en: { hr: "hour", min: "minute" },
        zh: { hr: "時", min: "分" },
    };
    const totwo = (str) => {
        return str < 10 ? "0" + str : str.toString();
    };
    const { language } = useLanguage();
    const [hour, setHour] = useState(totwo(setTime[0]));
    const [minute, setMinute] = useState(totwo(setTime[1]));

    const hours = Array.from({ length: 12 }, (_, i) =>
        i < 10 ? "0" + i : i.toString()
    );
    const minutes = ["00", "15", "30", "45"];

    useEffect(() => {
        changeTime([hour, minute]);
    }, [hour, minute, changeTime]);

    const handleHourChange = (event) => {
        setHour(event.target.value);
    };

    const handleMinuteChange = (event) => {
        setMinute(event.target.value);
    };

    return (
        <div className={style.block}>
            <select
                className={style.picker}
                value={hour}
                onChange={handleHourChange}
            >
                {hours.map((h) => (
                    <option key={h} value={h}>
                        {h}
                    </option>
                ))}
            </select>
            {words[language]["hr"]}
            <select
                className={style.picker}
                value={minute}
                onChange={handleMinuteChange}
            >
                {minutes.map((m) => (
                    <option key={m} value={m}>
                        {m}
                    </option>
                ))}
            </select>
            {words[language]["min"]}
        </div>
    );
}
