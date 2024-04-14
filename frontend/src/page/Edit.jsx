import React, { useEffect, useState } from "react";
import style from "./Edit.module.css";
import Button from "../component/Button";
import Calendar from "../component/Calendar";
import InputText from "../component/InputText";
import { useLanguage } from "../hooks/useLanguage";
import DragBox from "../component/DragBox";
import testData from "../assets/testData.json";
import { useNavigate, useParams } from "react-router-dom";
import {
    IoSunny,
    IoRainy,
    IoAlertCircle,
    IoAddCircleOutline,
} from "react-icons/io5";

export default function Edit() {
    const { id } = useParams();
    const [stage, setStage] = useState(0);
    const [tripName, setTripName] = useState("");
    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");
    const { words, language } = useLanguage();

    useEffect(() => {
        if (id !== undefined) {
            console.log(id);
            //getTrip
        }
        return () => {};
    }, [id]);

    return (
        <div className={style.main}>
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
            <div className={style.initialblock}>
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
        </div>
    );
}

function EditPage({ selectedStart, selectedEnd, language, tripName }) {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0);
    const [trip, setTrip] = useState(testData["trip"]);
    const [spots, setSpots] = useState(testData["trip"][0]);
    let navigate = useNavigate();

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

    useEffect(() => {
        setSpots(trip[selectedDate] || []);
    }, [selectedDate, trip]);

    useEffect(() => {
        console.log(trip);
        return () => {};
    }, [trip]);

    const reorderSpots = (newOrder) => {
        const newSpots = newOrder.map((id) =>
            spots.find((s) => s.spot_id === id)
        );
        const chkempty = (obj) => {
            if (obj && obj.length > 0) {
                return obj;
            } else {
                return [];
            }
        };
        setTrip((prev) => {
            return chkempty(prev).map((item, index) =>
                index === selectedDate ? newSpots : item
            );
        });

        setSpots(newSpots);
    };
    const getWeather = () => {
        let weather = "晴";
        switch (weather) {
            case "晴":
                return <IoSunny className={style.weather} />;
            case "雨":
                return <IoRainy className={style.weather} />;
            default:
                return <IoAlertCircle className={style.weather} />;
        }
    };
    const openAddSpot = () => {
        navigate("../explore");
    };

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
                <div className={style.dateinfos}>
                    <div>
                        {dates[selectedDate]
                            ? dates[selectedDate].date + " "
                            : ""}
                        {dates[selectedDate]
                            ? dates[selectedDate].weekday + " "
                            : ""}
                        {getWeather()}
                    </div>
                    <IoAddCircleOutline
                        className={style.addspot}
                        onClick={openAddSpot}
                    />
                </div>
                <DragBox spots={spots} onItemsReordered={reorderSpots} />
            </div>
        </div>
    );
}
