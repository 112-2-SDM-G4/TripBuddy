import React, { useEffect, useState } from "react";

import style from "./MyTrips.module.css";
import TripCard from "../component/TripCard";
import testData from "../assets/testData.json";

const Explore = () => {
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        setTrips(testData["testSpots"]);

        return () => {};
    }, []);
    

    return (
        <div>
            <div className={style.container}>
                {trips.map((trip) => (
                    <TripCard
                        key={trip["spot_id"]}
                        name={trip["spot_name"]}
                        src={trip["spot_image"]}
                        tripId={trip["spot_id"]}
                    />
                ))}
            </div>
        </div>
    );
};

export default Explore;
