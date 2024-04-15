import React, { useEffect, useState } from "react";
import style from "./MyTrips.module.css";
import TripCard from "../component/TripCard";

const Explore = () => {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        fetchWithJwt("/api/v1/trip", "GET")
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (result) {
                if (result["user_trip"]) {
                    setTrips(result["user_trip"]);
                } else {
                    alert(result["message"]);
                }
            });
        return () => {};
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
        </div>
    );
};

export default Explore;
