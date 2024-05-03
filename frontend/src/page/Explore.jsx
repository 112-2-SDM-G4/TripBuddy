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

    const trips = [
        {
            id: 1,
            name: "Trip to Tokyo",
            tags_id: [1, 2], // Example tags: [1, 2] for Tokyo
            image: "https://picsum.photos/70/50"
        },
        {
            id: 2,
            name: "Trip to Paris",
            tags_id: [3, 4], // Example tags: [3, 4] for Paris
            image: "https://picsum.photos/38/30"
        },
        {
            id: 3,
            name: "Trip to New York City",
            tags_id: [5, 35], // Example tags: [5, 6] for New York City
            image: "https://picsum.photos/80"
        },
        {
            id: 4,
            name: "Trip to Rome",
            tags_id: [5, 3, 4], // Example tags: [7, 8] for Rome
            image: "https://picsum.photos/79/90"
        },
        {
            id: 5,
            name: "Trip to Sydney",
            tags_id: [34, 24], // Example tags: [9, 10] for Sydney
            image: "https://picsum.photos/20/38"
        }
    ];

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
    }, []);

    const handleSearch = async (query) => {
        console.log("Searching for:", query);
        setIsLoading(true);

        await fetchWithJwt('/api/v1/post', 'POST', {
            tags_id: selectedTagsId,
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

    return (
        <div className={style.main} onClick={() => setIsSearchDropdownOpen(false)}>
            <div className={style.container}>
                <Loader isLoading={isLoading} />

                <TripSearchBox 
                    onSearch={handleSearch}
                    setIsDropdownOpen={setIsSearchDropdownOpen}
                    isDropdownOpen={isSearchDropdownOpen}
                    allTags={allTags}
                    addSelectedTagsId={tagId => {
                        setSelectedTagsId([...selectedTagsId, tagId])
                    }}
                    removeSelectedTagsId={(tagId) => {
                        setSelectedTagsId(selectedTagsId.filter(t => t !== tagId))
                    }}
                    selectedTagsId={selectedTagsId}
                />

                <div className={style.postscontainer}>
                    {(allTrips.length !== 0 && allTags.length !== 0)
                        ? allTrips.map((trip) => (
                            <PostCard 
                                key={trip["id"]}
                                tripId={trip["id"]}
                                name={trip["name"]}
                                src="https://picsum.photos/200"
                                tagNames={trip["tags_id"].map(tagId => getTagsMap(allTags)[tagId][`tag_name_${language}`]).filter(n => n)}
                            />
                            ))
                    : null}

                    {/* {trips.map((trip) => (
                        <PostCard 
                            key={trip["id"]}
                            name={trip["name"]}
                            src={trip["image"]}
                            // tagNames={trip["tags_id"].map(tagId => getTagsMap(allTags)[tagId][`tag_name_${language}`]).filter(n => n)}
                            tagNames={trip["tags_id"].map(tagId => getTagsMap(allTags)[tagId][`tag_name_zh`])}

                        />
                    ))} */}
                </div>
            </div>

            {haveUpcomingTrip &&
            <div className={style.upcoming}>
                <UpcomingTrip trip={upcomingTrip} />
            </div>}


        </div>
    );
};

export default Explore;
