import React, { useEffect, useState } from "react";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import style from "./Explore.module.css";
import SpotCard from "../component/SpotCard";
import TripSearchBox from "../component/TripSearchBox";
import Loader from "../component/Loader";

const Explore = ({ fixcol }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        fetchWithJwt("/api/v1/place/search?search=", "GET")
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result["result"]) {
                    console.log(result["result"]);
                    setSpots(result["result"]);
                    setIsLoading(false);
                }
            });

        return () => {};
    }, []);

    const handleSearch = async (query) => {
        console.log("Searching for:", query);
        setIsLoading(true);
        fetchWithJwt("/api/v1/place/search?search=" + query, "GET")
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result["result"]) {
                    setSpots(result["result"]);
                    setIsLoading(false);
                }
            });
    };

    return (
        <div className={style.container}>
            <Loader isLoading={isLoading} />
            <div className={style.searchboxcontainer}>
                <TripSearchBox onSearch={handleSearch} />
            </div>

            <div
                className={style.spotscontainer}
                style={fixcol ? { columnCount: fixcol } : null}
            >
                {spots.map((spot) => (
                    <SpotCard
                        key={spot["place_id"]}
                        name={spot["name"]}
                        src={spot["image"]}
                        spotId={spot["place_id"]}
                    />
                ))}
            </div>
        </div>
    );
};

export default Explore;
