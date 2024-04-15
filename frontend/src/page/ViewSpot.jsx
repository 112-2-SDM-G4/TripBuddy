import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useLanguage } from "../hooks/useLanguage";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import style from "./ViewSpot.module.css";
import Button from "../component/Button";
import AddPageforTrip from "../component/AddPageforTrip";

const ViewSpot = () => {
    const words = {
        zh: {
            rate: "評分:",
            address: "地址:",
            phone: "電話:",
            open: "營業時間:",
            submit: "新增至行程",
        },
        en: {
            rate: "Rate:",
            address: "Address:",
            phone: "Phone number:",
            open: "Open Hour:",
            submit: "Add to trip",
        },
    };

    const { id } = useParams();
    const { language } = useLanguage();
    const [addPage, showAddPage] = useState(false);
    const [spot, setSpot] = useState({
        place_id: "ChIJCewJkL2LGGAR3Qmk0vCTGkg",
        name: "東京鐵塔",
        address: "4-chōme-2-8 Shibakōen, Minato City, Tokyo 105-0011日本",
        google_maps_uri: "https://maps.google.com/?cid=5195627782660688349",
        location: (35.6585805, 139.7454329),
        image: "https://lh3.googleusercontent.com/places/ANXAkqEy8vwNygsL8QZcb1Nt8kGwzwL6FCRgcR327XM_qtgJx6MJLHMsxRgOhEN3OPmMwSEEUzfbmeabFxe3Uz443TMZRnDNaX-Yk5E=s4800-w800-h1204",
        rating: 4.4,
        user_rating_count: 71591,
        opening_hours_d: [
            "星期一: 09:00 – 22:30",
            "星期二: 09:00 – 22:30",
            "星期三: 09:00 – 22:30",
            "星期四: 09:00 – 22:30",
            "星期五: 09:00 – 22:30",
            "星期六: 09:00 – 22:30",
            "星期日: 09:00 – 22:30",
        ],
        opening_hours_p: [
            {
                open: { day: 0, hour: 9, minute: 0 },
                close: { day: 0, hour: 22, minute: 30 },
            },
            {
                open: { day: 1, hour: 9, minute: 0 },
                close: { day: 1, hour: 22, minute: 30 },
            },
            {
                open: { day: 2, hour: 9, minute: 0 },
                close: { day: 2, hour: 22, minute: 30 },
            },
            {
                open: { day: 3, hour: 9, minute: 0 },
                close: { day: 3, hour: 22, minute: 30 },
            },
            {
                open: { day: 4, hour: 9, minute: 0 },
                close: { day: 4, hour: 22, minute: 30 },
            },
            {
                open: { day: 5, hour: 9, minute: 0 },
                close: { day: 5, hour: 22, minute: 30 },
            },
            {
                open: { day: 6, hour: 9, minute: 0 },
                close: { day: 6, hour: 22, minute: 30 },
            },
        ],
        summary: "這座地標讓人想起巴黎艾菲爾鐵塔，設有觀景區和其他景點。",
    });

    useEffect(() => {
        console.log(id);
        fetchWithJwt("/api/v1/place/detail?place_id=" + id, "GET")
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                console.log(result);
                setSpot(result["result"]);
            });
        return () => {};
    }, [id]);

    return (
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
                <div className={style.title}> {spot["name"]} </div>
                <div className={style.info}>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {words[language]["rate"]}
                        </div>

                        {spot["rating"]}
                    </div>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {words[language]["address"]}
                        </div>
                        {spot["address"]}
                    </div>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {words[language]["open"]}
                        </div>
                        {spot["opening_hours_d"][0]}
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
    );
};

export default ViewSpot;
