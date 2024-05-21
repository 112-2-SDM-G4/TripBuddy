import React, { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./Edit.module.css";

import Button from "../component/Button";
import Calendar from "../component/Calendar";
import InputText from "../component/InputText";
import SearchableSelect from "../component/SearchableSelect";
import DragBox from "../component/EditPage/DragBox";
import Loader from "../component/Loader";
import SpotSearchBox from "../component/SpotSearchBox";
import Ledger from "../component/Ledger";
import SpotCard from "../component/SpotCard";
import Dropdown from "../component/EditPage/DropDown";
import ViewSpot from "../component/EditPage/ViewSpot";

import { useLanguage } from "../hooks/useLanguage";
import { useAuth } from "../hooks/useAuth";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import io from "socket.io-client";

import CountryData from "../assets/Country.json";
import { RiMoneyDollarBoxLine } from "react-icons/ri";
import {
    IoSunny,
    IoRainy,
    IoAlertCircle,
    IoAddCircleOutline,
    IoChevronBack,
    IoEllipsisHorizontalSharp,
} from "react-icons/io5";

export default function Edit() {
    const { id } = useParams();
    const [stage, setStage] = useState(0);
    const [trip, setTrip] = useState({});
    const { language } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        if (id !== undefined) {
            fetchWithJwt("/api/v1/trip/" + id + "/" + language, "GET")
                .then(function (response) {
                    return response.json();
                })
                .then(function (result) {
                    console.log(result);
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
    }, [id, navigate, language]);

    const refreshTrip = () => {
        fetchWithJwt("/api/v1/trip/" + id + "/" + language, "GET")
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result["trip"]) {
                    console.log(result);
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
    };

    return (
        <div className={style.main}>
            {stage === 0 && (
                <InitialPage setStage={setStage} language={language} />
            )}
            {stage === 1 && (
                <EditPage
                    tripinfo={trip}
                    language={language}
                    refreshTrip={refreshTrip}
                />
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
            nodetail: "尚未選擇目標國家/貨幣",
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
            nodetail: "Country not found",
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
        if (selectedLocation === "" || selectedStandard === "") {
            alert(words[language]["nodetail"]);
            return;
        }
        const place = CountryData.places.find(
            (place) => place.country_id === selectedLocation
        );
        console.log({
            trip_name: tripName,
            start_date: DatetoArray(selectedStart),
            end_date: DatetoArray(selectedEnd),
            location_id: selectedLocation,
            location: [place.latitude, place.longitude],
            exchange: selectedExchange,
            standard: selectedStandard,
        });
        fetchWithJwt("/api/v1/trip", "POST", {
            trip_name: tripName,
            start_date: DatetoArray(selectedStart),
            end_date: DatetoArray(selectedEnd),
            location_id: selectedLocation,
            location: [place.latitude, place.longitude],
            exchange: selectedExchange,
            standard: selectedStandard,
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result["trip_id"]) {
                    updateUserData();
                    navigate("./" + result["trip_id"]);
                } else {
                    console.log(result);
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
        const uniqueMoneyValues = new Map();
        data.places.forEach((place) => {
            const id = place.money["en"]; // 假设 "en" 是唯一标识
            if (!uniqueMoneyValues.has(id)) {
                uniqueMoneyValues.set(id, {
                    value: place.money[language],
                    id: id,
                });
            }
        });
        return Array.from(uniqueMoneyValues.values());
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
                            options={CountryData.places.map((c) => {
                                return {
                                    value: c.country[language],
                                    id: c.country_id,
                                };
                            })}
                            onSelect={(value) => {
                                setSelectedLocation(value.id);
                                const place = CountryData.places.find(
                                    (place) => place.country_id === value.id
                                );
                                const money = place ? place.money["en"] : "";
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
                                setSelectedExchange(money.id);
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
                                setSelectedStandard(value.id);
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

function EditPage({ tripinfo, language, refreshTrip }) {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(0);
    const [trip, setTrip] = useState(tripinfo["trip"] ? tripinfo["trip"] : []);
    const [spots, setSpots] = useState(
        tripinfo["trip"] ? tripinfo["trip"][0] : []
    );
    const [openExplore, setOpenExplore] = useState(false);
    const [openDropDown, setOpenDropDown] = useState(false);
    const [openWallet, setOpenWallet] = useState(false);
    const dropdownRef = useRef(null);

    console.log("我是新的喔");

    const jwtToken = sessionStorage.getItem("jwtToken");
    const socket = useMemo(() => {
        return io.connect("https://planar-effect-420508.de.r.appspot.com", {
            query: {
                ...(jwtToken && { jwt: jwtToken }),
            },
            autoConnect: false,
        });
    }, [jwtToken]);

    useEffect(() => {
        socket.connect();
        socket.on("connect", () => {
            console.log("WebSocket 连接成功");
        });

        socket.on("reconnect_attempt", (attemptNumber) => {
            console.log(`尝试重新连接，第 ${attemptNumber} 次`);
        });

        socket.on("error", (error) => {
            console.error("WebSocket 连接错误:", error);
        });

        socket.on("connect_timeout", (timeout) => {
            console.error("WebSocket 连接超时:", timeout);
        });

        socket.on("disconnect", (reason) => {
            console.log("WebSocket 连接断开:", reason);
            if (reason === "transport error") {
                console.error("传输层错误导致连接断开");
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [socket]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpenDropDown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropdownRef]);

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

    useEffect(() => {
        socket.emit("join_trip", { trip_id: tripinfo["id"] });

        socket.on("render_trip", (data) => {
            setTrip(data.trip);
        });

        return () => {
            socket.emit("leave_trip", { trip_id: tripinfo["id"] });
            socket.disconnect();
        };
    }, [socket]);

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
        // setTrip(newTrip);

        // fetchWithJwt("/api/v1/trip/" + tripinfo["id"], "PUT", {
        //     trip: newTrip,
        // })
        //     .then((response) => {
        //         return response.json();
        //     })
        //     .then((data) => {
        //         console.log(data);
        //     })
        //     .catch((error) => {
        //         console.log(
        //             "There was a problem with the fetch operation:",
        //             error
        //         );
        //         if (error.response) {
        //             error.response.json().then((errorMessage) => {
        //                 alert(errorMessage.message);
        //                 console.log("Error message:", errorMessage.message);
        //             });
        //         } else {
        //             console.log("Network error:", error.message);
        //         }
        //     });

        socket.emit("update_trip", {
            trip_id: tripinfo["id"],
            langauge: language,
            trip: newTrip,
        });

        setSpots(newSpots);
    };
    const updateSpotData = (newSpot) => {
        const newSpots = spots.map((spot) => {
            if (spot.relation_id === newSpot.relation_id) {
                return newSpot;
            }
            return spot;
        });
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
        // setTrip(newTrip);

        // fetchWithJwt("/api/v1/trip/" + tripinfo["id"], "PUT", {
        //     trip: newTrip,
        // })
        //     .then((response) => {
        //         return response.json();
        //     })
        //     .then((data) => {
        //         console.log(data);
        //     })
        //     .catch((error) => {
        //         console.log(
        //             "There was a problem with the fetch operation:",
        //             error
        //         );
        //         if (error.response) {
        //             error.response.json().then((errorMessage) => {
        //                 alert(errorMessage.message);
        //                 console.log("Error message:", errorMessage.message);
        //             });
        //         } else {
        //             console.log("Network error:", error.message);
        //         }
        //     });

        socket.emit("update_trip", {
            trip_id: tripinfo["id"],
            langauge: language,
            trip: newTrip,
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
        setOpenWallet(false);
        setOpenExplore((prev) => !prev);
    };

    const openLedger = () => {
        setOpenExplore(false);
        setOpenWallet((prev) => !prev);
    };

    return (
        <div className={style.editpagecontainer}>
            <div
                className={`${style.editpage} ${
                    openExplore || openWallet ? style.hidepage : null
                }`}
            >
                <div className={`${style.editpageTitle}`}>
                    {tripinfo["name"]}
                    <div className={style.morebtcontianer} ref={dropdownRef}>
                        <IoEllipsisHorizontalSharp
                            className={`${style.backbt}`}
                            onClick={() => setOpenDropDown((prev) => !prev)}
                        />
                        <Dropdown
                            open={openDropDown}
                            setOpen={setOpenDropDown}
                        />
                    </div>
                </div>
                <div className={style.secondRow}>
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
                    <RiMoneyDollarBoxLine
                        className={style.ledger}
                        onClick={openLedger}
                    />
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
                    <DragBox
                        spots={spots}
                        onItemsReordered={reorderSpots}
                        updateSpotData={updateSpotData}
                    />
                </div>
            </div>
            <div
                className={`${style.explorepage} ${
                    openExplore ? null : style.hidden
                }`}
            >
                <Explore
                    location={tripinfo.location}
                    refreshTrip={refreshTrip}
                    close={() => setOpenExplore(false)}
                    startSearch={openExplore}
                />
            </div>
            <div
                className={`${style.ledgerPage} ${
                    openWallet ? null : style.hidden
                }`}
            >
                <Ledger
                    close={() => setOpenWallet(false)}
                    schedule_id={tripinfo["id"]}
                    exchange={tripinfo["exchange"]}
                    showButton={openWallet}
                />
            </div>
        </div>
    );
}

const Explore = ({ refreshTrip, location, close, startSearch }) => {
    const words = {
        zh: {
            search: "景點搜尋",
        },
        en: {
            search: "Spot Search",
        },
    };
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [spots, setSpots] = useState([]);
    const [detailSpot, setDetailSpot] = useState("");

    useEffect(() => {
        if (!startSearch) {
            return;
        }
        fetchWithJwt(
            `/api/v1/place/search?language=${language}&location_lat=${
                location ? location[0] : null
            }&location_lng=${location ? location[1] : null}&search=`,
            "GET"
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result["result"]) {
                    console.log(result["result"]);
                    setSpots(result["result"]);
                    setIsLoading(false);
                }
            });

        return () => {};
    }, [language, location, startSearch]);

    const handleSearch = async (query) => {
        console.log("Searching for:", query);
        setIsLoading(true);
        fetchWithJwt(
            `/api/v1/place/search?search=${query}&location_lat=${
                location ? location[0] : null
            }&location_lng=${
                location ? location[1] : null
            }&language=${language}`,
            "GET"
        )
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result["result"]) {
                    setSpots(result["result"]);
                    setIsLoading(false);
                }
            });
    };

    return (
        <div className={style.container}>
            <Loader isLoading={isLoading} />
            {detailSpot !== "" && (
                <ViewSpot
                    spotid={detailSpot}
                    closeModal={() => setDetailSpot("")}
                ></ViewSpot>
            )}
            <div className={`${style.title} ${style.exploretitle}`}>
                <IoChevronBack
                    className={`${style.backbt}`}
                    onClick={() => close()}
                />
                {words[language]["search"]}
            </div>
            <div className={style.searchboxcontainer}>
                <SpotSearchBox onSearch={handleSearch} />
            </div>

            <div className={style.spotscontainer}>
                {spots.map((spot) => (
                    <SpotCard
                        key={spot["place_id"]}
                        name={spot["name"]}
                        src={spot["image"]}
                        spotId={spot["place_id"]}
                        spotData={spot}
                        refreshTrip={refreshTrip}
                        onClick={() => {
                            setDetailSpot(spot["place_id"]);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};
