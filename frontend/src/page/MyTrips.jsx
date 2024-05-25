import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

import style from "./MyTrips.module.css";
import TripCard from "../component/TripCard";
import Button from "../component/Button";

const MyTrips = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const { user, updateUserData } = useAuth();
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        updateUserData();
        return () => {};
    }, []);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const filteredTrips = user["trips"]
        ? user["trips"].filter(trip => 
            filter === 'all' ? true : filter === 'ended' ? trip.date_status === -1 : trip.date_status !== -1)
        : [];

    return (
        <div className={style.container}>
            <div className={style.filterContainer}>
                <div
                    className={`${style.filterOption} ${filter === 'all' ? style.active : ''}`}
                    onClick={() => handleFilterChange('all')}
                >
                    {language === "en" ? "All Trips" : "全部行程"}
                </div>
                <div
                    className={`${style.filterOption} ${filter === 'ended' ? style.active : ''}`}
                    onClick={() => handleFilterChange('ended')}
                >
                    {language === "en" ? "Ended" : "已結束"}
                </div>
                <div
                    className={`${style.filterOption} ${filter === 'ongoing' ? style.active : ''}`}
                    onClick={() => handleFilterChange('ongoing')}
                >
                    {language === "en" ? "Ongoing" : "未結束"}
                </div>
            </div>

            <div className={style.tripsContainer}>
                {filteredTrips.map((trip) => (
                    <TripCard
                        key={trip["id"]}
                        name={trip["name"]}
                        src={trip["image"]}
                        tripId={trip["id"]}
                        start_date={trip["start_date"]}
                        end_date={trip["end_date"]}
                        location_id={trip["location_id"]}
                        date_status={trip['date_status']}
                    />
                ))}
            </div>

            <div className={style.buttoncontainer}>
                <div className={style.button}>
                    <Button
                        txt={language === "en" ? "Add a trip" : "創建行程"}
                        func={() => navigate(`/edit`)}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyTrips;
