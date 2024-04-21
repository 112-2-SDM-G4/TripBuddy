import React, { useEffect, useState } from "react";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import style from "./Explore.module.css";
import SpotCard from "../component/SpotCard";
import SearchBox from "../component/SearchBox";
import Loader from "../component/Loader";

const Explore = () => {
    const [isLoading, setIsLoading] = useState(true);

    const [spots, setSpots] = useState([]
    //     [
    //     {
    //         place_id: "ChIJCewJkL2LGGAR3Qmk0vCTGkg",
    //         name: "東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔東京鐵塔",
    //         image: "https://lh3.googleusercontent.com/places/ANXAkqEy8vwNygsL8QZcb1Nt8kGwzwL6FCRgcR327XM_qtgJx6MJLHMsxRgOhEN3OPmMwSEEUzfbmeabFxe3Uz443TMZRnDNaX-Yk5E=s4800-w800-h1204",
    //     },
    //     {
    //         place_id: "ChIJ35ov0dCOGGARKvdDH7NPHX0",
    //         name: "東京晴空塔",
    //         image: "https://lh3.googleusercontent.com/places/ANXAkqEy8vwNygsL8QZcb1Nt8kGwzwL6FCRgcR327XM_qtgJx6MJLHMsxRgOhEN3OPmMwSEEUzfbmeabFxe3Uz443TMZRnDNaX-Yk5E=s4800-w800-h1204",
    //     },
    // ]
);

    useEffect(() => {
        fetchWithJwt("/api/v1/place/search?search=", "GET")
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (result) {
                if (result["result"]) {
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
        <div classeName={style.container}>
            <Loader isLoading={isLoading} />
            <div className={style.searchboxcontainer}>
                <SearchBox onSearch={handleSearch} />
            </div>

            <div className={style.spotscontainer}>
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
