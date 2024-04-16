import React, { useEffect, useState } from "react";
import style from "./Edit.module.css";
import Button from "../component/Button";
import Calendar from "../component/Calendar";
import InputText from "../component/InputText";
import { useLanguage } from "../hooks/useLanguage";
import DragBox from "../component/DragBox";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
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
    const [trip, setTrip] = useState({});
    const { language } = useLanguage();

    useEffect(() => {
        console.log(id);
        if (id !== undefined) {
            setTrip({
                public: false,
                id: "trip01",
                name: "嘉義三天兩夜",
                image: null,
                start_date: [2024, 1, 2],
                end_date: [2024, 1, 4],
                trip: [
                    [
                        {
                            relation_id: 12,
                            comment: "早上來感覺很漂亮",
                            formatted_address:
                                "4-chōme-2-8 Shibakōen, Minato City, Tokyo 105-0011日本",
                            google_maps_uri:
                                "https://maps.google.com/?cid=5195627782660688349",
                            image: "https://lh3.googleusercontent.com/places/ANXAkqEy8vwNygsL8QZcb1Nt8kGwzwL6FCRgcR327XM_qtgJx6MJLHMsxRgOhEN3OPmMwSEEUzfbmeabFxe3Uz443TMZRnDNaX-Yk5E=s4800-w800-h1204",
                            money: 200.0,
                            name: "東京鐵塔",
                            place_id: "ChIJCewJkL2LGGAR3Qmk0vCTGkg",
                            place_summary:
                                "這座地標讓人想起巴黎艾菲爾鐵塔，設有觀景區和其他景點。",
                            rating: 4.4,
                            regular_opening_hours: [
                                "星期一: 09:00 – 22:30",
                                "星期二: 09:00 – 22:30",
                                "星期三: 09:00 – 22:30",
                                "星期四: 09:00 – 22:30",
                                "星期五: 09:00 – 22:30",
                                "星期六: 09:00 – 22:30",
                                "星期日: 09:00 – 22:30",
                            ],
                            stay_time: [1, 0],
                            user_rating_count: 71591,
                        },
                        {
                            relation_id: 15,
                            comment: null,
                            formatted_address:
                                "2-chōme-3-1 Asakusa, Taito City, Tokyo 111-0032日本",
                            google_maps_uri:
                                "https://maps.google.com/?cid=15683880811625452221",
                            image: "https://lh5.googleusercontent.com/p/AF1QipPDdrqtwIEd_Ty0Oo21LmVjVV9oBXxFwXMw5amL=w408-h306-k-no",
                            money: null,
                            name: "淺草寺 雷門",
                            place_id: "ChIJ0YwG28aOGGARvRKAXIBWqNk",
                            place_summary:
                                "位於淺草寺入口處的莊嚴大門，掛有 3.9 公尺高的燈籠。",
                            rating: 4.5,
                            regular_opening_hours: [
                                "星期一: 24 小時營業",
                                " 星期二: 24 小時營業",
                                " 星期三: 24 小時營業",
                                " 星期四: 24 小時營業",
                                " 星期五: 24 小時營業",
                                " 星期六: 24 小時營業",
                                " 星期日: 24 小時營業",
                            ],
                            stay_time: [1, 0],
                            user_rating_count: 29588,
                        },
                    ],
                    [
                        {
                            relation_id: 16,
                            comment: "讚讚",
                            formatted_address:
                                "1-chōme-1-2 Oshiage, Sumida City, Tokyo 131-0045日本",
                            google_maps_uri:
                                "https://maps.google.com/?cid=9015449659807889194",
                            image: "https://lh5.googleusercontent.com/p/AF1QipPkHrinKramHo5HstdfR12_EqIkcb1eG3D3Fkwe=w408-h544-k-no",
                            money: 0.0,
                            name: "東京晴空塔",
                            place_id: "ChIJ35ov0dCOGGARKvdDH7NPHX0",
                            place_summary:
                                "世界上最高的獨立廣播塔，上面的觀景台可飽覽 360 度全景。",
                            rating: 4.4,
                            regular_opening_hours: [
                                "星期一: 10:00 – 21:00",
                                " 星期二: 10:00 – 21:00",
                                " 星期三: 10:00 – 21:00",
                                " 星期四: 10:00 – 21:00",
                                " 星期五: 10:00 – 21:00",
                                " 星期六: 10:00 – 21:00",
                                " 星期日: 10:00 – 21:00",
                            ],
                            stay_time: [0, 30],
                            user_rating_count: 84392,
                        },
                    ],
                    [],
                    [],
                ],
            });
            fetchWithJwt("/ap1/v1/trip/" + id, "GET")
                .then(function (response) {
                    return response.json();
                })
                .then(function (result) {
                    if (result) {
                        setTrip(result);
                    } else {
                        alert(result["message"]);
                    }
                })
                .catch(function () {
                    console.log("errrr");
                });
            setStage(1);
        }
        return () => {};
    }, [id]);

    return (
        <div className={style.main}>
            {stage === 0 && (
                <InitialPage setStage={setStage} language={language} />
            )}
            {stage === 1 && (
                <EditPage tripinfo={trip} language={language} id={id} />
            )}
        </div>
    );
}

function InitialPage({ setStage, language }) {
    const words = {
        zh: {
            tripname: "請替這個旅程起個名稱",
            startdate: "起始日期",
            enddate: "結束日期",
            area: "地區",
            Sun: "日",
            Mon: "一",
            Tue: "二",
            Wed: "三",
            Thu: "四",
            Fri: "五",
            Sat: "六",
            noname: "尚未填寫名稱",
            nodate: "尚未輸入日期",
        },
        en: {
            tripname: "Please name this trip",
            startdate: "Start date",
            enddate: "End date",
            area: "Area",
            Sun: "Sun",
            Mon: "Mon",
            Tue: "Tue",
            Wed: "Wed",
            Thu: "Thu",
            Fri: "Fri",
            Sat: "Sat",
            noname: "Name not found",
            nodate: "Date not found",
        },
    };
    const [displayCalendar, setDisplayCalendar] = useState(false);
    const [tripName, setTripName] = useState("");
    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");
    let navigate = useNavigate();

    const createTrip = () => {
        if (tripName === "") {
            alert(words[language]["noname"]);
            return;
        }
        if (selectedStart === "" || selectedEnd === "") {
            alert(words[language]["nodate"]);
            return;
        }
        fetchWithJwt("/ap1/v1/trip", "POST", {
            trip_name: tripName,
            start_date: DatetoArray(selectedStart),
            end_date: DatetoArray(selectedEnd),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result["trip_id"]) {
                    navigate("./" + result["trip_id"]);
                } else {
                    alert(result["message"]);
                }
            });

        setStage(1);
    };

    function DatetoArray(date) {
        const year = date.getFullYear(); // 获取年份
        const month = date.getMonth() + 1; // 获取月份（注意加1）
        const day = date.getDate(); // 获取日期

        return [year, month, day];
    }

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
                        createTrip();
                    }}
                    setting={{ width: "100%" }}
                />
            </div>
        </div>
    );
}

function EditPage({ tripinfo, language, id }) {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0);
    const [trip, setTrip] = useState([]);
    const [spots, setSpots] = useState([]);
    const [editable, setEditable] = useState(false);
    let navigate = useNavigate();

    useEffect(() => {
        if (tripinfo["trip"]) {
            setTrip(tripinfo["trip"]);
            setSpots(tripinfo["trip"][0]);
        }
        return () => {};
    }, [tripinfo]);

    useEffect(() => {
        function formatDateAndWeekday(start, end, language) {
            if (!start || !end) {
                return [];
            }
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
        function tryformatDate(dateArray) {
            try {
                return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
            } catch {
                return false;
            }
        }
        setDates(
            formatDateAndWeekday(
                tryformatDate(tripinfo["start_date"]),
                tryformatDate(tripinfo["end_date"]),
                language
            )
        );

        return () => {};
    }, [tripinfo, language]);

    useEffect(() => {
        setSpots(trip[selectedDate] || []);
    }, [selectedDate, trip]);

    useEffect(() => {
        console.log(trip);
        if (id !== tripinfo["id"]) {
            return;
        }
        if (!editable) {
            setEditable(true);
            return;
        }
        fetchWithJwt("/ap1/v1/trip/" + tripinfo["id"], "PUT", {
            trip: trip,
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                console.log(data);
            })
            .catch((error) => {
                console.log(
                    "There was a problem with the fetch operation:",
                    error
                );
                if (error.response) {
                    error.response.json().then((errorMessage) => {
                        alert(errorMessage.message);
                        console.log("Error message:", errorMessage.message);
                    });
                } else {
                    console.log("Network error:", error.message);
                }
            });
        return () => {};
    }, [trip, tripinfo, id]);

    const reorderSpots = (newOrder) => {
        const newSpots = newOrder.map((id) =>
            spots.find((s) => s.relation_id === id)
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
            <div className={style.editpageTitle}>{trip["name"]}</div>
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
