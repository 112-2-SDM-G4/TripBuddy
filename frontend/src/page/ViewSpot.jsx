import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useLanguage } from "../hooks/useLanguage";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import style from "./ViewSpot.module.css";
import Button from "../component/Button";
import AddPageforTrip from "../component/AddPageforTrip";
import Loader from "../component/Loader";
import { FaMapMarkedAlt } from "react-icons/fa";

const ViewSpot = () => {
    const words = {
        zh: {
            rate: "評分:",
            address: "地址:",
            phone: "電話:",
            open: "營業時間:",
            submit: "新增至行程",
            summary: "簡介:",
        },
        en: {
            rate: "Rate:",
            address: "Address:",
            phone: "Phone number:",
            open: "Open Hour:",
            submit: "Add to trip",
            summary: "Summary:",
        },
    };
    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];
    const { id } = useParams();
    const { language } = useLanguage();
    const [addPage, showAddPage] = useState(false);
    const [spot, setSpot] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWithJwt("/api/v1/place/detail?place_id=" + id, "GET")
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                console.log(result);
                setIsLoading(false);
                setSpot(result["result"]);
            });
        return () => {};
    }, [id]);

    const handleRedirect = () => {
        window.location.href = spot["google_maps_uri"]; // 替换为目标网页的 URL
    };
    const formatTime = (time) => {
        const hour = time.hour < 10 ? `0${time.hour}` : time.hour;
        const minute = time.minute < 10 ? `0${time.minute}` : time.minute;
        return `${hour}:${minute}`;
    };

    return (
        <>
            <Loader isLoading={isLoading} />
            {!isLoading && (
                <div className={style.main}>
                    {addPage && (
                        <AddPageforTrip
                            close={() => showAddPage(false)}
                            spot={{
                                name: spot["name"],
                                src: spot["image"],
                                attractionId: spot["place_id"],
                            }}
                        />
                    )}
                    <img src={spot["image"]} alt="Logo" className={style.img} />

                    <div className={style.textbox}>
                        <div className={style.title}>
                            {spot["name"]}{" "}
                            <FaMapMarkedAlt
                                onClick={handleRedirect}
                                style={{ cursor: "pointer" }}
                            />
                        </div>
                        <div className={style.info}>
                            <div className={style.row}>
                                <div className={style.rowname}>
                                    {words[language]["rate"]}
                                </div>

                                {spot["rating"]}
                                {" (" + spot["user_rating_count"] + ")"}
                            </div>
                            <div className={style.row}>
                                <div className={style.rowname}>
                                    {words[language]["address"]}
                                </div>
                                {spot["address"]}
                            </div>
                            <div className={style.row}>
                                <div className={style.rowname}>
                                    {words[language]["summary"]}
                                </div>
                                {spot["summary"]}
                            </div>
                            <div className={style.row}>
                                <div className={style.rowname}>
                                    {words[language]["open"]}
                                </div>
                                <div className={style.openhrblock}>
                                    {language === "zh" &&
                                        spot["opening_hours_d"].map(
                                            (openday, index) => {
                                                return (
                                                    <div key={"zh" + index}>
                                                        {openday}
                                                    </div>
                                                );
                                            }
                                        )}
                                    {language === "en" &&
                                        spot["opening_hours_p"].map(
                                            (time, index) => (
                                                <div key={"en" + index}>
                                                    <strong>
                                                        {
                                                            daysOfWeek[
                                                                time.open.day
                                                            ]
                                                        }
                                                        :
                                                    </strong>
                                                    {"  "}
                                                    {formatTime(time.open)} -
                                                    {formatTime(time.close)}
                                                </div>
                                            )
                                        )}
                                </div>
                            </div>
                        </div>
                        <div className={style.submit}>
                            <Button
                                txt={words[language]["submit"]}
                                func={() => showAddPage(true)}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ViewSpot;
