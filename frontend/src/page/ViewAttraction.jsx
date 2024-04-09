import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { useLanguage } from "../hooks/useLanguage";
import style from "./ViewAttraction.module.css";

const Attraction = () => {
    const { id } = useParams();
    const { language } = useLanguage();
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
            <img src={spot["spot_image"]} alt="Logo" className={style.img} />

            <div className={style.textbox}>
                <div className={style.title}> {spot["spot_name"]} </div>
                <div className={style.info}>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {language === "en" ? "Rate:" : "評分:"}
                        </div>

                        {spot["spot_rate"]}
                    </div>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {language === "en" ? "Address:" : "地址:"}
                        </div>
                        {spot["spot_address"]}
                    </div>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {language === "en" ? "Phone number:" : "電話:"}
                        </div>
                        {spot["spot_phone"]}
                    </div>
                    <div className={style.row}>
                        <div className={style.rowname}>
                            {language === "en" ? "Open Hour:" : "營業時間:"}
                        </div>
                        {spot["spot_open"]}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attraction;
