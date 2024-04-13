import React, { useEffect, useState } from "react";

import style from "./Explore.module.css";
import SpotCard from "../component/SpotCard";
import testData from "../assets/testData.json";
import SearchBox from "../component/SearchBox";

const Explore = () => {
    const [spots, setSpots] = useState([]);

    useEffect(() => {
        setSpots(testData["testSpots"]);

        return () => {};
    }, []);

    const handleSearch = (query) => {
        // fetch data from an API
        console.log('Searching for:', query);
        // Update searchResults state with search results
      };
    

    return (
        <div>
            <div className={style.searchboxcontainer}>
             <SearchBox onSearch={handleSearch} />
            </div>
         
            <div className={style.spotscontainer}>
                {spots.map((spot) => (
                    <SpotCard
                        key={spot["spot_id"]}
                        name={spot["spot_name"]}
                        src={spot["spot_image"]}
                        spotId={spot["spot_id"]}
                    />
                ))}
            </div>
        </div>
    );
};

export default Explore;
