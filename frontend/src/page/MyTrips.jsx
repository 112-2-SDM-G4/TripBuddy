import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

import { useLanguage } from "../hooks/useLanguage";
import { fetchWithJwt } from "../hooks/fetchWithJwt";

import style from "./MyTrips.module.css";
import TripCard from "../component/TripCard";
import Button from "../component/Button";


const Explore = () => {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [trips, setTrips] = useState([
        {
            "id": "234",
            "name": "trip nameee",
            "image": "https://",
        }, 
        {
            "id": "234",
            "name": "trip nameee",
            "image": "https://",
        },
        {
            "id": "234",
            "name": "trip nameee",
            "image": "https://",
        },
        {
            "id": "234",
            "name": "trip nameee",
            "image": "https://",
        },
        {
            "id": "234",
            "name": "trip nameee",
            "image": "https://",
        },
        {
            "id": "234",
            "name": "trip nameee",
            "image": "https://",
        },
        {
            "id": "234",
            "name": "trip nameee",
            "image": "https://",
        },
        {
            "id": "234",
            "name": "trip nameee",
            "image": "https://",
        }
    ]);

    useEffect(() => {
        // fetchWithJwt("/api/v1/trip", "GET")
        //     .then(function (response) {
        //         console.log(response);
        //         return response.json();
        //     })
        //     .then(function (result) {
        //         console.log(result);
        //         if (result["user_trip"]) {
        //             setTrips(result["user_trip"]);
        //         } else {
        //             alert(result["message"]);
        //         }
        //     });
        // return () => {};
    }, []);

    return (
        <div className={style.container}>
            {trips.map((trip) => (
                <TripCard
                    key={trip["id"]}
                    name={trip["name"]}
                    src={trip["image"]}
                    tripId={trip["id"]}
                />
            ))}

            <div className={style.buttoncontainer}>
                <div className={style.button}>
                    <Button txt={language === "en" ? "Add a trip" : "創建行程"} func={() => navigate(`/edit`)}/>
                </div>
            </div>
        </div>
    );
};

export default Explore;
