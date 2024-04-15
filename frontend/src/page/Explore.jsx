import React, { useEffect, useState } from "react";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import style from "./Explore.module.css";
import SpotCard from "../component/SpotCard";
import SearchBox from "../component/SearchBox";

const testSpots = [
    {
        place_id: "spot01",
        name: "某某公園",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/20230630_Song_Yu-qi.jpg",
    },
    {
        place_id: "spot02",
        name: "某某小吃攤",
        image: "https://hips.hearstapps.com/hmg-prod/images/getygerteg-64d4c26d64da8.jpg?crop=0.493xw:0.987xh;0,0&resize=640:*",
    },
    {
        place_id: "spot08",
        name: "某某景點",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSazC6FJYrFAwLPgUg6rtCnzF8kmZ2G9v36s6wvnK9BXu1XplBPlJZI5ZwQiMyBraI3NUk&usqp=CAU",
    },
    {
        place_id: "spot03",
        name: "某某餐廳",
        image: "https://pbs.twimg.com/media/F8OnxyJbcAAfpQX?format=jpg&name=4096x4096",
    },
    {
        place_id: "spot04",
        name: "某某地點",
        image: "https://down-tw.img.susercontent.com/file/tw-11134201-7qula-lk0pv54axu19d0",
    },
    {
        place_id: "spot05",
        name: "某某地點",
        image: "https://cdn1.wishnote.tw/550/2021/01/15/550_1558569_1610684440.webp",
    },
    {
        place_id: "spot06",
        name: "某某地點",
        image: "https://upload.wikimedia.org/wikipedia/commons/f/fa/20230630_Song_Yu-qi.jpg",
    },
    {
        place_id: "spot07",
        name: "某某地點",
        image: "https://i.ytimg.com/vi/LD-LsSgSftQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLBnVw-Rij7a9G13r7TGXdsMpXemOg",
    },
];

const Explore = () => {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        setSpots(testSpots);
        fetchWithJwt("/api/v1/place/search", "GET", {
            search: "",
        })
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
        fetchWithJwt("/api/v1/place/search", "GET", {
            search: query,
        })
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
