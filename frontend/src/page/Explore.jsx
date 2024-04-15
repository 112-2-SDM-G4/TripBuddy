import React, { useEffect, useState } from "react";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import style from "./Explore.module.css";
import SpotCard from "../component/SpotCard";
import SearchBox from "../component/SearchBox";

const Explore = () => {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        fetchWithJwt("/api/v1/place/search?search=", "GET")
            .then(function (response) {
                console.log(response);
                return response.json();
            })
            .then(function (result) {
                if (result["result"]) {
                    setSpots(result["result"]);
                }
            });

        return () => {};
    }, []);

    const handleSearch = async (query) => {
        console.log("Searching for:", query);
        fetchWithJwt("/api/v1/place/search?search=" + query, "GET")
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result["result"]) {
                    setSpots(result["result"]);
                }
            });
    };

    return (
        <div>
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
