import React from 'react';
import style from "./UpcomingTrip.module.css";
import { FaPlaneDeparture } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

const UpcomingTrip = ({ trip, setHideUpcomingTrip }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();

    return (
        <div 
            className={style.upcomingtrip}
            onClick={() => navigate(`/edit/${trip.id}`)}
        >
            <div className={style.upcomingtriptitle}>
                {language === "en" ? "Upcoming Trip" : "即將到來的旅程"}
            </div>

            <div className={style.close} onClick={setHideUpcomingTrip}>
                <IoMdClose size={18} style={{ fill: "color-mix(in srgb, var(--fontcolor) 45%, transparent)"}}/>
            </div>

                <div
                    className={style.upcomingcard}
                    onClick={() => {
                            navigate(`/edit/${trip.id}`)
                    }}
                >
                    <div className={style.card}>
                        <div>{trip.name}</div>
                        <div className={style.row}>
                            <div className={style.icon}>
                                <FaPlaneDeparture 
                                    size={17}
                                    style={{ fill: "var(--secondarycolor)" }}
                                />
                            </div>
                            {language === "en"
                                ? `Departure on ${trip.start_date[1]}/${trip.start_date[2]}`
                                : `${trip.start_date[1]}/${trip.start_date[2]} 出發`}
                        </div>
                    </div>
                </div>
        </div>
    );
}

export default UpcomingTrip;
