import React, { useRef, useState } from "react";
import Menu from "../component/Menu";
import style from "./Edit.module.css";
import inputstyle from "../component/InputText.module.css";
import Button from "../component/Button";
import Calendar from "../component/Calendar";
import InputText from "../component/InputText";
import { useLanguage } from "../hooks/useLanguage";
import words from "../assets/zhAnden.json";

export default function Edit() {
    const [stage, setStage] = useState(0);

    return (
        <div className={style.main}>
            <div className={style.title}>編輯行程</div>
            {stage === 0 && <InitialPage setStage={setStage} />}
        </div>
    );
}

function InitialPage({ setStage }) {
    const { language, toggleLanguage } = useLanguage();
    const [tripName, setTripName] = useState("");
    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");
    const inputtxt = useRef(null);
    const locations = [
        "Tokyo",
        "New York",
        "Paris",
        "London",
        "Beijing",
        "Sydney",
        "Cairo",
        "Berlin",
        "Moscow",
        "Dubai",
        "Singapore",
        "Istanbul",
        "Los Angeles",
        "Rome",
        "Bangkok",
        "Madrid",
        "Toronto",
        "Hong Kong",
        "Buenos Aires",
        "Cape Town",
    ];

    function formatDate(date) {
        if (!date || date === "") {
            return "";
        }
        let d = new Date(date),
            month = "" + (d.getMonth() + 1),
            day = "" + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = "0" + month;
        if (day.length < 2) day = "0" + day;

        return [year, month, day].join("-");
    }

    return (
        <div className={style.initialpage}>
            <InputText
                propmt={words[language]["tripname"]}
                name={"tripname"}
                setting={{ require: true, width: "100%" }}
                onChange={setTripName}
            />

            <div
                style={{ width: "100%" }}
                className={`${inputstyle.inputcontainer}`}
                onClick={() => {
                    inputtxt.current.focus();
                }}
            >
                <input
                    ref={inputtxt}
                    type="text"
                    id="area"
                    name="area"
                    list="areas"
                    required
                    placeholder=" "
                />
                <label>{words[language]["area"]}</label>
            </div>
            <datalist id="areas">
                {locations.map((item, index) => (
                    <option key={index} value={item} />
                ))}
            </datalist>

            <div className={style.pickdate}>
                <div>{words[language]["startdate"]}</div>
                <div>{words[language]["enddate"]}</div>
                <input
                    className={style.datepicker}
                    type="date"
                    name="startdate"
                    id="startdate"
                    value={formatDate(selectedStart)}
                    disabled
                />
                <input
                    className={style.datepicker}
                    type="date"
                    name="enddate"
                    id="enddate"
                    value={formatDate(selectedEnd)}
                    disabled
                />
            </div>
            <Calendar
                selectedStart={selectedStart}
                setSelectedStart={setSelectedStart}
                selectedEnd={selectedEnd}
                setSelectedEnd={setSelectedEnd}
            />
            <div style={{ width: "100%", height: "2rem" }}>&nbsp;</div>
            <Button
                txt={"下一頁"}
                func={() => {
                    toggleLanguage("en");
                }}
                setting={{ width: "100%" }}
            />
        </div>
    );
}
