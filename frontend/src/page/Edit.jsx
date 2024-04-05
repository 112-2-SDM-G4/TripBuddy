import React, { useEffect, useState } from "react";
import style from "./Edit.module.css";
import Button from "../component/Button";
import Calendar from "../component/Calendar";
import InputText from "../component/InputText";
import { useLanguage } from "../hooks/useLanguage";
import DragBox from "../component/DragBox";
import testData from "../assets/testData.json";

export default function Edit() {
    const [stage, setStage] = useState(0);
    const [tripName, setTripName] = useState("");
    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");
    const { words, language } = useLanguage();
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
                    words={words}
                    setTripName={setTripName}
                />
            )}
            {stage === 1 && (
                <EditPage
                    setStage={setStage}
                    selectedStart={selectedStart}
                    selectedEnd={selectedEnd}
                    words={words}
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
    words,
    setTripName,
}) {
    const [displayCalendar, setDisplayCalendar] = useState(false);

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
                propmt={words["tripname"]}
                name={"tripname"}
                setting={{ require: true, width: "100%" }}
                onChange={setTripName}
            />
            <div
                className={style.pickdate}
                onClick={() => {
                    setDisplayCalendar(!displayCalendar);
                }}
            >
                <div>{words["startdate"]}</div>
                <div>{words["enddate"]}</div>
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
    words,
    language,
    tripName,
}) {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0);
    const [spots, setSpots] = useState(testData["trip"][0]);

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
                        key={"dates" + i}
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
                <DragBox spots={spots} setSpots={setSpots} />
            </div>
        </div>
    );
}
