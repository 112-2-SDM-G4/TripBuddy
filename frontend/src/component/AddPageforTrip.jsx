import React, { useEffect, useRef, useState } from "react";
import style from "./AddPageforTrip.module.css";
import { useLanguage } from "../hooks/useLanguage";
import { IoMdClose } from "react-icons/io";
import TimePicker from "./TimePicker";
import InputText from "../component/InputText";
import Button from "../component/Button";
import { fetchWithJwt } from "../hooks/fetchWithJwt";

export default function AddPageforTrip({ close, spot }) {
    const words = {
        zh: {
            add: "要加在哪?",
            edit: "編輯修改",
            budget: "預算",
            comment: "註記",
            staytime: "停留時間",
            submit: "儲存",
        },
        en: {
            add: "Where to add?",
            edit: "Edit and modify",
            budget: "Budget",
            comment: "Comment",
            staytime: "Residence time",
            submit: "Submit",
        },
    };

    const { name, src, attractionId } = spot;
    const { language } = useLanguage();
    const [stage, setStage] = useState(1);
    const [trips, setTrips] = useState([]);
    const [selectTrip, setSelectTrip] = useState("");
    const [selectDay, setSelectDay] = useState(-1);
    const [selectTime, setSelectTime] = useState([]);
    const [Comment, setComment] = useState("");
    const [Budget, setBudget] = useState("second");

    useEffect(() => {
        fetchWithJwt("/api/v1/trip", "GET")
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (result) {
                console.log(result);
                if (result["user_trip"]) {
                    setTrips(result["user_trip"]);
                } else {
                    alert(result["message"]);
                }
            });

        return () => {};
    }, []);

    const selectAddTarget = (tripid, day) => {
        setSelectTrip(tripid);
        setSelectDay(day);
        setStage(2);
    };

    const handleSubmit = () => {
        console.log(selectTrip);

        fetchWithJwt("/api/v1/single_place/" + selectTrip["id"], "POST", {
            place_id: attractionId,
            name: name,
            formatted_address: "addressFromGoogle",
            google_map_uri: src,
            comment: Comment,
            money: Budget,
            stay_time: selectTime,
            date: selectDay,
            order: 0,
        })
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                close();
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
    };

    return (
        <div className={style.background} onClick={close}>
            <div
                className={style.container}
                onClick={(event) => {
                    event.stopPropagation();
                }}
            >
                {stage === 1 && (
                    <>
                        <div className={style.title}>
                            {words[language]["add"]}
                        </div>
                        <div className={style.trips}>
                            {trips.map((trip) => (
                                <TripBlock
                                    key={trip.id}
                                    trip={trip}
                                    selectAddTarget={selectAddTarget}
                                />
                            ))}
                        </div>
                    </>
                )}
                {stage === 2 && (
                    <>
                        <div className={style.title}>
                            {words[language]["edit"]}
                        </div>
                        <div className={style.trips}>
                            <img
                                src={src}
                                alt="spot loading"
                                className={style.img}
                            />
                            <div className={style.tripname}>{name}</div>
                            <div
                                className={style.subtripname}
                            >{`${selectTrip["name"]}第${selectDay}天`}</div>
                            <div className={style.editblock}>
                                <InputText
                                    propmt={words[language]["comment"]}
                                    onChange={setComment}
                                />
                                <InputText
                                    propmt={words[language]["budget"]}
                                    onChange={setBudget}
                                    setting={{
                                        type: "number",
                                        defaultValue: "0",
                                    }}
                                />
                                <div className={style.inputcontainer}>
                                    <label>{words[language]["staytime"]}</label>
                                    <TimePicker changeTime={setSelectTime} />
                                </div>
                            </div>
                            <div className={style.submit}>
                                <Button
                                    txt={words[language]["submit"]}
                                    func={handleSubmit}
                                />
                            </div>
                        </div>
                    </>
                )}
                <button className={style.closebt} onClick={close}>
                    <IoMdClose className={style.closebt} />
                </button>
            </div>
        </div>
    );
}

const TripBlock = ({ trip, selectAddTarget }) => {
    const [datesArray, setDatesArray] = useState([]);
    const { language } = useLanguage();
    const contentRef = useRef(null);

    useEffect(() => {
        const startDate = new Date(
            trip.start_date[0],
            trip.start_date[1] - 1,
            trip.start_date[2]
        );
        const endDate = new Date(
            trip.end_date[0],
            trip.end_date[1] - 1,
            trip.end_date[2]
        );

        const generateDatesArray = (start, end) => {
            const dates = [];
            let currentDate = new Date(start);

            while (currentDate <= end) {
                const date = `${currentDate.getFullYear()}/${
                    currentDate.getMonth() + 1
                }/${currentDate.getDate()}`;
                const weekday = currentDate.toLocaleString(
                    language === "zh" ? "zh-CN" : "en-US",
                    { weekday: "long" }
                );
                const formattedWeekday =
                    language === "zh"
                        ? weekday.replace("星期", "星期")
                        : weekday; // Adjust if needed for formatting

                dates.push({ date, weekday: formattedWeekday });
                currentDate.setDate(currentDate.getDate() + 1);
            }
            return dates;
        };

        const dates = generateDatesArray(startDate, endDate);
        setDatesArray(dates);
    }, [trip, language]);

    useEffect(() => {
        const content = contentRef.current;
        content.style.maxHeight = content.scrollHeight + "px";
    }, [contentRef]);

    const toggleCollapse = () => {
        const content = contentRef.current;
        if (content.style.maxHeight !== "0px") {
            content.style.maxHeight = "0px";
        } else {
            content.style.maxHeight = content.scrollHeight + "px";
        }
    };

    return (
        <div className={style.tripblock}>
            <div className={style.tripname} onClick={() => toggleCollapse()}>
                {trip.name}
            </div>
            <div ref={contentRef} className={`${style.foldable}`}>
                {datesArray.map(({ date, weekday }, index) => (
                    <div
                        key={index}
                        className={style.oneday}
                        onClick={() => selectAddTarget(trip, index + 1)}
                    >
                        <div>{`第${index + 1}天`}</div>
                        <div className={style.daydetail}>
                            {date} {weekday}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
