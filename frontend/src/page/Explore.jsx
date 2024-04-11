import React, { useEffect, useState } from "react";
import style from "./Explore.module.css";
import AttractionCard from "../component/AttractionCard";
import testData from "../assets/testData.json";

const Explore = () => {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        setSpots(testData["testSpots"]);

        return () => {};
    }, []);

    return (
        <div className={style.container}>
            {spots.map((spot) => (
                <AttractionCard
                    key={spot["spot_id"]}
                    name={spot["spot_name"]}
                    src={spot["spot_image"]}
                    attractionId={spot["spot_id"]}
                />
            ))}
        </div>
    );
};

export default Explore;
