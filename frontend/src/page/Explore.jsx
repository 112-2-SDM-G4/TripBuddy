import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./Explore.module.css";
import * as constants from "../constants";

import TripCard from "../component/TripCard";
import TripSearchBox from "../component/TripSearchBox";
import Loader from "../component/Loader";

import { fetchWithJwt } from "../hooks/fetchWithJwt";
import { useLanguage } from "../hooks/useLanguage";
import { useWindowSize } from "../hooks/useWindowSize";

const Explore = () => {
    const navigate = useNavigate();
    const windowSize = useWindowSize();

    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [haveUpcomingTrip, setHaveUpcomingTrip] = useState(false);
    const [upcomingTrip, setUpcomingTrip] = useState({});
    const [allTrips, setAllTrips] = useState([]);

    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);

    const tagMapping = {
        1: "文藝",
        2: "自然景觀",
        3: "小資",
        4: "奢華",
        5: "休閒",
        6: "古蹟",
        7: "美食"
    }

    useEffect(() => {
        const getMyTrips = async () => {
            try {
                const tripResponse = await fetchWithJwt("/api/v1/trip", "GET");
                const tripData = await tripResponse.json();
                if (tripResponse.ok) {
                    const upcomingTrips = tripData.user_trip.filter(trip => trip.date_status === 2) // start in 7 days
                    // console.log(upcomingTrips)
                    if(upcomingTrips.length === 0) {
                        setHaveUpcomingTrip(false)
                    } else {
                        setHaveUpcomingTrip(true)
                        setUpcomingTrip(upcomingTrips[0]);
                    }

                    // console.log(tripData.user_trip);
                    setIsLoading(false);
                    return { success: true, error: null };
                } else {
                    throw new Error("Failed to fetch my trips");
                }
            } catch (error) {
                console.error(error);
                return { success: false, error: error.message };
            }
        };

        const getAllTrips = async () => {
            try {
                const tripResponse = await fetchWithJwt("/api/v1/post", "GET");
                const tripData = await tripResponse.json();
                if (tripResponse.ok) {
                    console.log("trips:", tripData.public_trips);
                    setAllTrips(tripData.public_trips)
                    setIsLoading(false);
                    return { success: true, error: null };
                } else {
                    throw new Error("Failed to fetch all trips");
                }
            } catch (error) {
                console.error(error);
                return { success: false, error: error.message };
            }
        };

        setIsLoading(true);
        getMyTrips();
        getAllTrips();

        return () => {};
    }, []);

    const handleSearch = async (query) => {
        console.log("Searching for:", query);
        setIsLoading(true);

        await fetchWithJwt('/api/v1/post', 'POST', {
            tags_id: [1, 2],
            keyword: query
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                if (result["search_result"]) {
                    setAllTrips(result["search_result"]);
                    setIsLoading(false);
                }
            });
    };


    const  isSmallScreen = windowSize.width < constants.MOBILE_SCREEN_WIDTH
    return (
        <div className={style.main} onClick={() => setIsSearchDropdownOpen(false)}>
            <div className={style.container}>
                <Loader isLoading={isLoading} />

                {haveUpcomingTrip &&
                <div 
                    className={`${style.upcomingtrip} ${isSmallScreen && style.upcomingtripcol}`}
                    onClick={() => navigate(`/edit/${upcomingTrip["id"]}`)}
                >
                    <div className={`${style.upcomingtriptitle} ${isSmallScreen && style.upcomingtriptitlecol}`}>
                        {language === "en" ? "Upcoming Trip" : "即將到來的旅程"}
                    </div>
                        <div className={style.tripcard}>
                            <TripCard
                                key={upcomingTrip["id"]}
                                name={upcomingTrip["name"]}
                                // src={upcomingTrip["image"]}
                                src="https://picsum.photos/200"
                                tripId={upcomingTrip["id"]}
                                isPublic={false}
                                isUpcoming={true}
                                tripStartDate={[upcomingTrip["start_date"][1], upcomingTrip["start_date"][1]]}
                            />
                        </div>
                </div>}

                <div className={style.searchboxcontainer}>
                    heree
                </div>

                <div className={style.alltrips}>
                    {/* <div className={style.alltripstitle}>
                        {language === "en" ? "You might be interested" : "看看別人的旅程規劃"}
                    </div> */}
                    {allTrips
                        ? allTrips.map((trip) => (
                                <TripCard
                                    key={trip["id"]}
                                    name={trip["name"]}
                                    // src={trip["image"]}
                                    src="https://picsum.photos/200"
                                    tripId={trip["id"]}
                                    tagNames={trip["tags_id"].map(tagId => tagMapping[tagId])}
                                    isPublic={true}
                                    isPost={true}
                                />
                            ))
                    : null}
                </div>
            </div>
        </div>
    );
};

export default Explore;
