import React, { useState } from 'react';
import style from "./TripNoticeCard.module.css";
import { FaPlaneDeparture } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';

const UpcomingTrip = ({ trip, setNoticeTripsCnt, noticeCnt, isCurrent }) => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [show, setShow] = useState(true);

    return show ? (
        <div 
            className={style.upcomingtrip}
            onClick={() => navigate(`/edit/${trip.id}`)}
        >
            <div className={style.upcomingtriptitle}>
                <div className={style.noticecnt}>
                    <div className={style.noticecnttext}>
                        {noticeCnt}
                    </div>
                </div>
                {isCurrent && (language === "en" ? "Ongoing Trip" : "正在進行的旅程")}
                {!isCurrent && (language === "en" ? "Upcoming Trip" : "即將到來的旅程")}
            </div>

            <div className={style.close} onClick={(e) => {
                e.stopPropagation();
                setNoticeTripsCnt();
                setShow(false);
            }}>
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
                            {isCurrent && 
                                (language === "en"
                                    ? `Trip will end on ${trip.end_date[1]}/${trip.end_date[2]}`
                                    : `${trip.end_date[1]}/${trip.end_date[2]} 結束`)}

                            {!isCurrent && 
                                (language === "en"
                                    ? `Departure on ${trip.start_date[1]}/${trip.start_date[2]}`
                                    : `${trip.start_date[1]}/${trip.start_date[2]} 出發`)}

                        </div>
                    </div>
                </div>
        </div>
    ) : null;
}

export default UpcomingTrip;
