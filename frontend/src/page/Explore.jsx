import React, { useEffect, useState } from "react";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import style from "./Explore.module.css";
import SpotCard from "../component/SpotCard";
import TripSearchBox from "../component/TripSearchBox";
import Loader from "../component/Loader";
import { useLanguage } from "../hooks/useLanguage";

const Explore = () => {
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        fetchWithJwt(
            `/api/v1/place/search?language=${language}&location_lat=39.7036194&location_lng=141.1526839&search=`,
            "GET"
        )
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
    }, [language]);

    const handleSearch = async (query) => {
        console.log("Searching for:", query);
        setIsLoading(true);
        fetchWithJwt(
            `/api/v1/place/search?search=${query}&location_lat=39.7036194&location_lng=141.1526839&language=${language}`,
            "GET"
        )
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

            <div className={style.spotscontainer}>
                {spots.map((spot) => (
                    <SpotCard
                        key={spot["place_id"]}
                        name={spot["name"]}
                        src={spot["image"]}
                        spotId={spot["place_id"]}
                        spotData={spot}
                    />
                ))}
            </div>
        </div>
    );
};

export default Explore;
