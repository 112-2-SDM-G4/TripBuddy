import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useLanguage } from "../hooks/useLanguage";

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
        spot_id: "spot01",
        spot_name: "某某公園",
        spot_image:
            "https://down-tw.img.susercontent.com/file/tw-11134201-7qula-lk0pv54axu19d0",
        spot_rate: 4.7,
        spot_address: "Urayasu, Chiba, Japan",
        spot_phone: 3242342,
        spot_open: "9-18",
    });

    useEffect(() => {
        console.log(id);
        return () => {};
    }, [id]);

    return (
        <div className={style.main}>
            {addPage && (
                <AddPageforTrip
                    close={() => showAddPage(false)}
                    spot={{
                        name: spot["spot_name"],
                        src: spot["spot_image"],
                        attractionId: spot["spot_id"],
                    }}
                />
            )}
            <img src={spot["spot_image"]} alt="Logo" className={style.img} />

            <div className={style.textbox}>
                <div className={style.title}> {spot["spot_name"]} </div>
                <div className={style.info}>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {words[language]["rate"]}
                        </div>

                        {spot["spot_rate"]}
                    </div>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {words[language]["address"]}
                        </div>
                        {spot["spot_address"]}
                    </div>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {words[language]["phone"]}
                        </div>
                        {spot["spot_phone"]}
                    </div>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {words[language]["open"]}
                        </div>
                        {spot["spot_open"]}
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
