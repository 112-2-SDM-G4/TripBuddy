import React, { useEffect, useState } from "react";

import style from "./ViewSpot.module.css";
import { FaMapMarkedAlt } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import { useParams } from "react-router";

import { useLanguage } from "../hooks/useLanguage";
import { fetchWithJwt } from "../hooks/fetchWithJwt";

import Button from "../component/Button";
import AddPageforTrip from "../component/AddPageforTrip";
import Loader from "../component/Loader";


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
    
    const { id } = useParams();
    const { language } = useLanguage();
    const [addPage, showAddPage] = useState(false);
    const [spot, setSpot] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchWithJwt(`/api/v1/place/detail?place_id=${id}&language=${language}`, "GET")
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
        window.open(spot["google_map_uri"], "_blank", "noreferrer");
        // window.location.href = spot["google_map_uri"]; // 替换为目标网页的 URL
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
                            spotData={spot}
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

                                <div className={style.rating}>
                                    <div className={style.ratingtext}>{spot["rating"]} </div>
                                    <div className={style.item}>
                                        <TiStarFullOutline 
                                            size={17}
                                            style={{ fill: "var(--secondarycolor)" }}
                                        />
                                    </div>
                                    <div className={style.item}>{"(" + spot["user_rating_count"] + ")"}</div>
                                </div>
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
                                    {spot["regular_opening_hours"]?.map (
                                        (openday, index) => {
                                            return (
                                                <div key={"zh" + index} className={style.openhrrow}>
                                                    <div>{openday.split(":")[0]}</div>
                                                    <div>{openday.split(/:(.*)/s)[1]}</div>
                                                </div>
                                            );
                                        }
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
