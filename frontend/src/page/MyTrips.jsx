import React, { useEffect } from "react";
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

    useEffect(() => {
        updateUserData();
        return () => {};
    }, []);

    return (
        <div className={style.container}>
            {user["trips"]
                ? user["trips"].map((trip) => (
                      <TripCard
                          key={trip["id"]}
                          name={trip["name"]}
                          src={trip["image"]}
                          tripId={trip["id"]}
                      />
                  ))
                : null}

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
