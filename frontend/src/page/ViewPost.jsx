import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "./ViewPost.module.css";

import DragBox from "../component/EditPage/DragBox";
import Tag from "../component/Tag";

import { useLanguage } from "../hooks/useLanguage";
import { fetchWithJwt } from "../hooks/fetchWithJwt";

import { IoSunny, IoRainy, IoAlertCircle } from "react-icons/io5";

export default function ViewPost() {
    const { id } = useParams();
    const [trip, setTrip] = useState({});
    const [post, setPost] = useState({});
    const [allTags, setAllTags] = useState([]);
    const { language } = useLanguage();
    const navigate = useNavigate();

    useEffect(() => {
        const getPostData = async () => {
            try {
                const response = await fetchWithJwt(
                    `/api/v1/post/${id}`,
                    "GET"
                );
                const result = await response.json();
                if (result["public"] === true) {
                    console.log(result);
                    setPost({
                        content: result["content"],
                        tags_id: result["tags"],
                    });
                } else {
                    navigate("/login");
                    console.log(result["message"]);
                }
            } catch (error) {
                console.error("Fetching preferences failed:", error);
            }
        };
        getPostData();
    }, []);

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
        }
        return () => {};
    }, [id, navigate, language]);

    const refreshTrip = () => {
        fetchWithJwt("/api/v1/post/" + id + "/" + language, "GET")
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

    useEffect(() => {
        const getAllTags = async () => {
            try {
                const response = await fetchWithJwt(
                    `/api/v1/tag/get_tags?source=${"SharePost"}`,
                    "GET"
                );
                const data = await response.json();
                if (Array.isArray(data)) {
                    setAllTags(
                        data
                            .map((cat) => {
                                return cat["options"];
                            })
                            .flat()
                    );
                }
            } catch (error) {
                console.error("Fetching preferences failed:", error);
            }
        };
        getAllTags();
    }, []);

    const getTagName = (tagId, lang) => {
        if (allTags.length === 0) return null;
        for (let i = 0; i < allTags.length; i++) {
            if (allTags[i].tag_id === tagId) {
                return allTags[i][`tag_name_${lang}`];
            }
        }
        return null;
    };

    return (
        <div className={style.main}>
            <div className={style.postcontainer}>
                <div className={style.row}>
                    <div className={style.title}>{trip?.name}</div>

                    <div className={style.tagscontainer}>
                        <div className={style.tag}>
                            {post["tags_id"]?.map((tagId) => (
                                <Tag
                                    key={tagId}
                                    text={getTagName(tagId, language)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                <textarea
                    style={{
                        border: "none",
                        backgroundColor: "var(--backgroundcolor)",
                    }}
                    className={style.postcontent}
                    value={post.content}
                    disabled
                ></textarea>
            </div>

            <EditPage
                tripinfo={trip}
                language={language}
                refreshTrip={refreshTrip}
            />
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

    // const getWeather = () => {
    //     let weather = "晴";
    //     switch (weather) {
    //         case "晴":
    //             return <IoSunny className={style.weather} />;
    //         case "雨":
    //             return <IoRainy className={style.weather} />;
    //         default:
    //             return <IoAlertCircle className={style.weather} />;
    //     }
    // };
    return (
        <div className={style.editpagecontainer}>
            <div className={style.editpage}>
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
                            {/* {getWeather()} */}
                        </div>
                    </div>
                    <DragBox
                        spots={spots}
                        onItemsReordered={reorderSpots}
                        updateSpotData={updateSpotData}
                        locked={true}
                    />
                </div>
            </div>
        </div>
    );
}
