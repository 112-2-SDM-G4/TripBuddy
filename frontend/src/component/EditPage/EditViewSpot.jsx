import React, { useState } from "react";
import style from "./EditViewSpot.module.css";
import Button from "../Button";
import InputText from "../InputText";
import Modal from "../Modal";
import TimePicker from "../TimePicker";

import { FaMapMarkedAlt } from "react-icons/fa";
import { TiStarFullOutline } from "react-icons/ti";
import { useLanguage } from "../../hooks/useLanguage";

export default function EditViewSpot({
    spot,
    onClose,
    updateSpotData,
    locked = false,
}) {
    const words = {
        zh: {
            rate: "評分:",
            address: "地址:",
            phone: "電話:",
            open: "營業時間:",
            submit: "修改行程",
            summary: "簡介:",
            budget: "預算",
            comment: "註記",
            staytime: "停留時間",
            stayfor: "停留",
            hour: "時",
            minute: "分"
        },
        en: {
            rate: "Rate:",
            address: "Address:",
            phone: "Phone number:",
            open: "Open Hour:",
            submit: "Edit trip",
            summary: "Summary:",
            budget: "Budget",
            comment: "Comment",
            staytime: "Residence time",
            stayfor: "Stay for",
            hour: "hour",
            minute: "minute"
        },
    };
    const { language } = useLanguage();
    const [selectTime, setSelectTime] = useState([]);
    const [Comment, setComment] = useState(spot.comment ? spot.comment : "");
    const [Budget, setBudget] = useState(spot.money ? spot.money : "0");

    const handleRedirect = () => {
        window.open(spot["google_map_uri"], "_blank", "noreferrer");
    };
    const handleSubmit = () => {
        updateSpotData({
            ...spot,
            comment: Comment,
            money: Budget,
            stay_time: selectTime,
        });
        onClose();
    };

    const tryvalid = (obj) => {
        if (obj) return obj;
        return "";
    };
    const formatNumber = (num) => {
        return num.toString().length < 2 ? ` 0${num} ` : ` ${num} `;
    };

    return (
        <Modal onClose={onClose}>
            <div className={style.main}>
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
                                <div className={style.ratingtext}>
                                    {spot["rating"]}{" "}
                                </div>
                                <div className={style.item}>
                                    <TiStarFullOutline
                                        size={17}
                                        style={{
                                            fill: "var(--secondarycolor)",
                                        }}
                                    />
                                </div>
                                <div className={style.item}>
                                    {"(" + spot["user_rating_count"] + ")"}
                                </div>
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
                                {words[language]["open"]}
                            </div>
                            <div className={style.openhrblock}>
                                {spot["regular_opening_hours"]?.map(
                                    (openday, index) => {
                                        return (
                                            <div
                                                key={"zh" + index}
                                                className={style.openhrrow}
                                            >
                                                <div>
                                                    {openday.split(":")[0]}
                                                </div>
                                                <div>
                                                    {openday.split(/:(.*)/s)[1]}
                                                </div>
                                            </div>
                                        );
                                    }
                                )}
                            </div>
                        </div>

                        {locked && 
                        <>
                            <div className={style.row}>
                                <div className={style.rowname}>
                                    {`${words[language]["comment"]}:`}
                                </div>
                                <div className={style.item}>
                                    {spot.comment}
                                </div>
                            </div>

                            <div className={style.row}>
                                <div className={style.rowname}>
                                    {`${words[language]["budget"]}:`}
                                </div>
                                <div className={style.item}>
                                    {spot.money ? spot.money : "0"}
                                </div>
                            </div>

                            <div className={style.row}>
                                <div className={style.rowname}>
                                    {`${words[language]["staytime"]}:`}
                                </div>
                                <div className={style.item}>
                                    {`${words[language]["stayfor"]}${formatNumber(
                                        tryvalid(spot["stay_time"][0])
                                    )}${words[language]["hour"]}${formatNumber(
                                        tryvalid(spot["stay_time"][1])
                                    )}${words[language]["minute"]}`}
                                </div>
                            </div>
                        </>}
                    </div>
                    <div className={style.editblock}>
                        {!locked &&
                            <>
                            <InputText
                                propmt={words[language]["comment"]}
                                onChange={setComment}
                                setting={{
                                    defaultValue: spot.comment ? spot.comment : "",
                                }}
                            />
                            <InputText
                                propmt={words[language]["budget"]}
                                onChange={setBudget}
                                setting={{
                                    type: "number",
                                    defaultValue: spot.money ? spot.money : "0",
                                }}
                            />
                            <div className={style.inputcontainer}>
                                <label>{words[language]["staytime"]}</label>
                                <TimePicker
                                    changeTime={setSelectTime}
                                    setTime={spot["stay_time"]}
                                />
                            </div>
                            </>
                        }
                    </div>
                    {!locked && (
                        <div className={style.submit}>
                            <Button
                                txt={words[language]["submit"]}
                                func={handleSubmit}
                            />
                        </div>
                    )}
                </div>
            </div>
        </Modal>
    );
}
