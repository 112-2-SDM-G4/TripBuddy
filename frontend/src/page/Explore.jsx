import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import style from "./Explore.module.css";

import TripSearchBox from "../component/TripSearchBox";
import Loader from "../component/Loader";

import { fetchWithJwt } from "../hooks/fetchWithJwt";
import { useLanguage } from "../hooks/useLanguage";
import { useWindowSize } from "../hooks/useWindowSize";
import UpcomingTrip from "../component/UpcomingTrip";
import PostCard from "../component/PostCard";

const Explore = () => {
    const navigate = useNavigate();
    const windowSize = useWindowSize();

    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [haveUpcomingTrip, setHaveUpcomingTrip] = useState(false);
    const [upcomingTrip, setUpcomingTrip] = useState({});
    const [allTrips, setAllTrips] = useState([]);

    const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
    const [allTags, setAllTags] = useState([]);
    const [selectedTagsId, setSelectedTagsId] = useState([]);
    const [hideUpcomingTrip, setHideUpcomingTrip] = useState(false);

    const getTagsMap = (allTags) => {
        const tagidToName = {};
    
        allTags.forEach(category => {
            category.options.forEach(tag => {
                tagidToName[tag.tag_id] = {
                    tag_name_zh: tag.tag_name_zh,
                    tag_name_en: tag.tag_name_en
                };
            });
        });
        // console.log(tagidToName)
        return tagidToName;
    }

    useEffect(() => {
        const getAllTags = async () => {
            try {
                const response = await fetchWithJwt(`/api/v1/tag/get_tags?source=${"SearchTag"}`, 'GET');
                const data = await response.json();
                console.log("tagdata", data)
                setAllTags(data);

            } catch (error) {
                console.error("Fetching preferences failed:", error);
            }
        };

        setIsLoading(true);
        getAllTags();

    }, []);

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
                    // setIsLoading(false);
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
                    console.log("trips:", tripData);
                    setAllTrips(tripData)
                    // setIsLoading(false);
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
        setIsLoading(false);
    }, []);

    const handleSearch = async (query) => {
        console.log("Searching for:", query);
        setIsLoading(true);

        await fetchWithJwt('/api/v1/post', 'POST', {
            tags_id: selectedTagsId,
            keyword: query
        })
            .then(function (response) {
                console.log("res", response);
                return response.json();
            })
            .then(function (result) {
                if(result["search_result"]) {
                    setAllTrips(prevState => ({
                        ...prevState,
                        public_trips: result["search_result"],
                    }))
                    // setAllTrips({..., public_trips: result["search_result"]});
                    console.log("search result:", result["search_result"]);
                    setIsLoading(false);
                }
            });
    };

    return (
        <div className={style.main} onClick={() => setIsSearchDropdownOpen(false)}>
            <div className={style.container}>
                <Loader isLoading={isLoading} />

                <div className={style.searchbox}>
                    <TripSearchBox 
                        onSearch={handleSearch}
                        setIsDropdownOpen={setIsSearchDropdownOpen}
                        isDropdownOpen={isSearchDropdownOpen}
                        allTags={allTags}
                        addSelectedTagsId={(tagId) => {
                            setSelectedTagsId((prev) => {
                              if (prev.includes(tagId)) {
                                return [...prev];
                              }
                              return [...prev, tagId];
                            });
                        }}
                        removeSelectedTagsId={(tagId) => {
                            setSelectedTagsId(selectedTagsId.filter(t => t !== tagId))
                        }}
                        selectedTagsId={selectedTagsId}
                    />
                </div>
                

                <div className={style.block}>
                    <div className={style.blocktitle}>{language === "en" ? "Suggestions" : "為你推薦" }</div>
                    <div className={style.postscontainer}>
                        {(allTrips["public_trips"]?.length !== 0 && allTags.length !== 0)
                            ? allTrips["public_trips"]?.map((trip) => (
                                <PostCard 
                                    key={trip["id"]}
                                    tripId={trip["id"]}
                                    name={trip["name"]}
                                    src={trip["image"]}git pu
                                    tagNames={trip["tags_id"].map(tagId => getTagsMap(allTags)[tagId][`tag_name_${language}`]).filter(n => n)}
                                    isFav={allTrips["hearted_trips"].map(t => t["id"]).includes(trip["id"])}
                                />
                                ))
                        : null}
                    </div>
                </div>

                <div className={style.block}>
                    <div className={style.blocktitle}>{language === "en" ? "My favorites" : "我的收藏" }</div>
                    <div className={style.postscontainer}>
                        {(allTrips["hearted_trips"]?.length !== 0 && allTags.length !== 0)
                            ? allTrips["hearted_trips"]?.map((trip) => (
                                <PostCard 
                                    key={trip["id"]}
                                    tripId={trip["id"]}
                                    name={trip["name"]}
                                    src={trip["image"]}
                                    tagNames={trip["tags_id"].map(tagId => getTagsMap(allTags)[tagId][`tag_name_${language}`]).filter(n => n)}
                                    isFav={true}
                                />
                                ))
                        : null}
                    </div>
                </div>

            </div>

            {(haveUpcomingTrip && !hideUpcomingTrip) &&
            <div className={style.upcoming}>
                <UpcomingTrip trip={upcomingTrip} setHideUpcomingTrip={(e) => {
                    e.stopPropagation();
                    setHideUpcomingTrip(true);
                }}/>
            </div>}


        </div>
    );
};

export default Explore;
