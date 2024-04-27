import React, { useEffect, useState } from "react";
import style from "./Edit.module.css";
import Button from "../component/Button";
import Calendar from "../component/Calendar";
import InputText from "../component/InputText";
import SearchableSelect from "../component/SearchableSelect";
import DragBox from "../component/DragBox";
import Explore from "./Explore";
import { useLanguage } from "../hooks/useLanguage";
import { useWindowSize } from "../hooks/useWindowSize";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import { useNavigate, useParams } from "react-router-dom";
import CountryData from "../assets/Country.json";
import {
    IoSunny,
    IoRainy,
    IoAlertCircle,
    IoAddCircleOutline,
} from "react-icons/io5";
import { useAuth } from "../hooks/useAuth";

export default function Edit() {
    const { id } = useParams();
    const [stage, setStage] = useState(0);
    const [trip, setTrip] = useState({});
    const { language } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== undefined) {
            fetchWithJwt("/api/v1/trip/" + id, "GET")
                .then(function (response) {
                    return response.json();
                })
                .then(function (result) {
                    if (result["trip"]) {
                        setTrip(result);
                    } else {
                        navigate("/login");
                        console.log(result["message"]);
                    }
                })
                .catch(function () {
                    navigate("/login");
                    console.log("errrr");
                });
            setStage(1);
        }
        return () => {};
    }, [id, navigate]);

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
            title: "創建行程",
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
            next: "下一頁",
        },
        en: {
            title: "Create Trip",
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
            next: "Next page",
        },
    };
    const [displayCalendar, setDisplayCalendar] = useState(false);
    const [tripName, setTripName] = useState("");
    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [selectedExchange, setSelectedExchange] = useState("");
    const [selectedStandard, setSelectedStandard] = useState("");
    let navigate = useNavigate();
    let { updateUserData } = useAuth();

    const createTrip = () => {
        if (tripName === "") {
            alert(words[language]["noname"]);
            return;
        }
        if (selectedStart === "" || selectedEnd === "") {
            alert(words[language]["nodate"]);
            return;
        }
        fetchWithJwt("/api/v1/trip", "POST", {
            trip_name: tripName,
            start_date: DatetoArray(selectedStart),
            end_date: DatetoArray(selectedEnd),
            location: selectedLocation,
            exchange: selectedExchange,
            standard: selectedStandard,
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                console.log(result);
                if (result["trip_id"]) {
                    updateUserData();
                    navigate("./" + result["trip_id"]);
                } else {
                    alert(result["message"]);
                }
            });

        setStage(1);
    };

    const DatetoArray = (date) => {
        const year = date.getFullYear(); // 获取年份
        const month = date.getMonth() + 1; // 获取月份（注意加1）
        const day = date.getDate(); // 获取日期

        return [year, month, day];
    };

    const formatDate = (date) => {
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
    };

    const getUniqueMoneyValues = (data, language) => {
        const uniqueMoneyValues = new Set();
        data.places.forEach((place) => {
            uniqueMoneyValues.add(place.money[language]);
        });
        return Array.from(uniqueMoneyValues);
    };

    return (
        <div className={style.initialpage}>
            <div className={style.initialblock}>
                <div className={style.title}>{words[language]["title"]}</div>
                <InputText
                    propmt={words[language]["tripname"]}
                    name={"tripname"}
                    setting={{ require: true, width: "100%" }}
                    onChange={setTripName}
                />

                <div className={style.row}>
                    <div className={style.selectbar}>
                        <div>{"目標國家"}</div>
                        <SearchableSelect
                            words={{
                                zh: {
                                    select: "請選擇",
                                    search: "搜尋",
                                },
                                en: {
                                    select: "Select",
                                    search: "Search",
                                },
                            }}
                            options={CountryData.places.map(
                                (c) => c.country[language]
                            )}
                            onSelect={(value) => {
                                setSelectedLocation(value);
                                const place = CountryData.places.find(
                                    (place) => place.country[language] === value
                                );
                                const money = place
                                    ? place.money[language]
                                    : "";
                                setSelectedExchange(money);
                            }}
                        />
                    </div>
                    <div className={style.selectbar}>
                        <div>{"記帳貨幣"}</div>
                        <SearchableSelect
                            words={{
                                zh: {
                                    select: "請選擇",
                                    search: "搜尋",
                                },
                                en: {
                                    select: "Select",
                                    search: "Search",
                                },
                            }}
                            options={getUniqueMoneyValues(
                                CountryData,
                                language
                            )}
                            onSelect={(money) => {
                                setSelectedExchange(money);
                            }}
                            setvalue={selectedExchange}
                        />
                    </div>
                    <div className={style.selectbar}>
                        <div>{"結算幣別"}</div>
                        <SearchableSelect
                            words={{
                                zh: {
                                    select: "請選擇",
                                    search: "搜尋",
                                },
                                en: {
                                    select: "Select",
                                    search: "Search",
                                },
                            }}
                            options={getUniqueMoneyValues(
                                CountryData,
                                language
                            )}
                            onSelect={(value) => {
                                setSelectedStandard(value);
                            }}
                        />
                    </div>
                </div>

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
                <div
                    className={`${style.calendarcontainer} ${
                        displayCalendar ? null : style.hidecalendar
                    }`}
                >
                    <Calendar
                        selectedStart={selectedStart}
                        setSelectedStart={setSelectedStart}
                        selectedEnd={selectedEnd}
                        setSelectedEnd={setSelectedEnd}
                    />
                </div>
                <div style={{ width: "100%", height: "2rem" }}>&nbsp;</div>
                <Button
                    txt={words[language]["next"]}
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
    const [trip, setTrip] = useState(tripinfo["trip"] ? tripinfo["trip"] : []);
    const [spots, setSpots] = useState(
        tripinfo["trip"] ? tripinfo["trip"][0] : []
    );
    const [openExplore, setOpenExplore] = useState(false);
    const windowSize = useWindowSize();

    console.log(tripinfo);
    console.log(trip);

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

        setTrip(tripinfo["trip"] ? tripinfo["trip"] : []);
        setSpots(tripinfo["trip"] ? tripinfo["trip"][0] : []);
        return () => {};
    }, [tripinfo, language]);

    useEffect(() => {
        setSpots(trip[selectedDate] || []);
    }, [selectedDate, trip]);

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
        const newTrip = chkempty(trip).map((item, index) =>
            index === selectedDate ? newSpots : item
        );
        setTrip(newTrip);

        fetchWithJwt("/api/v1/trip/" + tripinfo["id"], "PUT", {
            trip: newTrip,
        })
            .then((response) => {
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
        setOpenExplore((prev) => !prev);
    };
    const exploreCol = () => {
        if (windowSize.width < 1200) {
            return 2;
        } else {
            return 3;
        }
    };

    return (
        <div className={style.editpagecontainer}>
            <div className={style.editpage}>
                <div className={style.editpageTitle}>{tripinfo["name"]}</div>
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
            <div
                className={`${style.explorepage} ${
                    openExplore ? null : style.hidden
                }`}
            >
                <div className={`${style.title} ${style.exploretitle}`}>
                    景點搜尋
                </div>
                <Explore
                    fixcol={exploreCol()}
                    tripid={id}
                    location={"Taiwan"}
                />
            </div>
        </div>
    );
}
