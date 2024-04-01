import React, { useEffect, useRef, useState } from "react";
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
    const [tripName, setTripName] = useState("");
    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");
    const { language } = useLanguage();
    return (
        <div className={style.main}>
            <div className={style.title}>編輯行程</div>
            {stage === 0 && (
                <InitialPage
                    setStage={setStage}
                    selectedStart={selectedStart}
                    setSelectedStart={setSelectedStart}
                    selectedEnd={selectedEnd}
                    setSelectedEnd={setSelectedEnd}
                    language={language}
                    setTripName={setTripName}
                />
            )}
            {stage === 1 && (
                <EditPage
                    setStage={setStage}
                    selectedStart={selectedStart}
                    selectedEnd={selectedEnd}
                    language={language}
                    tripName={tripName}
                />
            )}
        </div>
    );
}

function InitialPage({
    setStage,
    selectedStart,
    setSelectedStart,
    selectedEnd,
    setSelectedEnd,
    language,
    setTripName,
}) {
    const [displayCalendar, setDisplayCalendar] = useState(false);
    // const inputtxt = useRef(null);
    // const locations = [
    //     "Tokyo",
    //     "New York",
    //     "Paris",
    //     "London",
    //     "Beijing",
    //     "Sydney",
    //     "Cairo",
    //     "Berlin",
    //     "Moscow",
    //     "Dubai",
    //     "Singapore",
    //     "Istanbul",
    //     "Los Angeles",
    //     "Rome",
    //     "Bangkok",
    //     "Madrid",
    //     "Toronto",
    //     "Hong Kong",
    //     "Buenos Aires",
    //     "Cape Town",
    // ];

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

            {/* <div
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
            </datalist> */}

            <div
                className={style.pickdate}
                onClick={() => {
                    setDisplayCalendar(!displayCalendar);
                }}
            >
                <div>{words[language]["startdate"]}</div>
                <div>{words[language]["enddate"]}</div>
                <input
                    className={style.datepicker}
                    type="date"
                    name="startdate"
                    id="startdate"
                    value={formatDate(selectedStart)}
                    onClick={(event) => {
                        event.target.blur();
                    }}
                    readOnly
                />
                <input
                    className={style.datepicker}
                    type="date"
                    name="enddate"
                    id="enddate"
                    onClick={(event) => {
                        event.target.blur();
                    }}
                    value={formatDate(selectedEnd)}
                    readOnly
                />
            </div>
            {displayCalendar && (
                <Calendar
                    selectedStart={selectedStart}
                    setSelectedStart={setSelectedStart}
                    selectedEnd={selectedEnd}
                    setSelectedEnd={setSelectedEnd}
                />
            )}
            <div style={{ width: "100%", height: "2rem" }}>&nbsp;</div>
            <Button
                txt={"下一頁"}
                func={() => {
                    setStage(1);
                }}
                setting={{ width: "100%" }}
            />
        </div>
    );
}

function EditPage({
    setStage,
    selectedStart,
    selectedEnd,
    language,
    tripName,
}) {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0);
    useEffect(() => {
        function formatDateAndWeekday(start, end, language) {
            const oneDay = 24 * 60 * 60 * 1000;
            const datesArray = [];

            for (
                let date = start;
                date <= end;
                date = new Date(date.getTime() + oneDay)
            ) {
                let dateString = "";
                let weekdayString = "";

                if (language === "en") {
                    dateString = date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                    weekdayString = date.toLocaleDateString("en-US", {
                        weekday: "long",
                    });
                } else if (language === "zh") {
                    dateString = date.toLocaleDateString("zh-CN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    });
                    weekdayString = date.toLocaleDateString("zh-CN", {
                        weekday: "long",
                    });
                }
                datesArray.push({ date: dateString, weekday: weekdayString });
            }

            return datesArray;
        }
        setDates(formatDateAndWeekday(selectedStart, selectedEnd, language));

        return () => {};
    }, [selectedStart, selectedEnd, language]);

    return (
        <div className={style.editpage}>
            <div className={style.editpageTitle}>{tripName}</div>
            <div className={style.selectdate}>
                {dates.map((d, i) => (
                    <div
                        className={`${style.date} ${
                            i === selectedDate ? style.selected : null
                        }`}
                        key={i}
                        onClick={() => {
                            setSelectedDate(i);
                        }}
                    >{`第${i + 1}天`}</div>
                ))}
            </div>
            <div className={style.datedetail}>
                {dates[selectedDate] ? dates[selectedDate].date : ""}
                {dates[selectedDate] ? dates[selectedDate].weekday : ""}
                {"天氣晴"}
            </div>
        </div>
    );
}
