import React, { useRef, useState } from "react";
import Menu from "../component/Menu";
import style from "./Edit.module.css";
import Button from "../component/Button";
import Calendar from "../component/Calendar";
import InputText from "../component/InputText";
import { useLanguage } from "../hooks/useLanguage";
import words from "../assets/zhAnden.json";

export default function Edit() {
    const [stage, setStage] = useState(0);

    return (
        <div>
            <div className={style.main}>
                {stage === 0 && <InitialPage setStage={setStage} />}
            </div>
        </div>
    );
}

function InitialPage({ setStage }) {
    const { language, toggleLanguage } = useLanguage();
    const [tripName, setTripName] = useState("");
    const startDate = useRef(null);
    const endDate = useRef(null);
    return (
        <div className={style.initialpage}>
            <InputText
                propmt={words[language]["tripname"]}
                name={"tripname"}
                setting={{ require: true, width: "80%", fontSize: "1rem" }}
                onChange={setTripName}
            />
            <div className={style.pickdate}>
                <div>{words[language]["startdate"]}</div>
                <div>{words[language]["enddate"]}</div>
                <input
                    ref={startDate}
                    onClick={(event) => {
                        event.preventDefault();
                        startDate.current.showPicker();
                    }}
                    onChange={() => {
                        endDate.current.showPicker();
                    }}
                    className={style.datepicker}
                    type="date"
                    name="startdate"
                    id="startdate"
                />
                <input
                    ref={endDate}
                    className={style.datepicker}
                    type="date"
                    name="enddate"
                    id="enddate"
                    onClick={() => {
                        endDate.current.showPicker();
                    }}
                />
            </div>
            <div>
                {words[language]["area"]}
                <select name="area" id="area">
                    <option value="1">東京</option>
                </select>
            </div>
            <Calendar />
            <Button
                txt={"下一頁"}
                func={() => {
                    toggleLanguage("en");
                }}
                setting={{ width: "50%" }}
            />
        </div>
    );
}
