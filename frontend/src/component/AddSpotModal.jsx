import React, { useState, useEffect } from 'react';
import { TiStarFullOutline } from "react-icons/ti";
import { FiExternalLink } from "react-icons/fi";

import style from "./AddSpotModal.module.css";

import SpotSearchBox from './SpotSearchBox';
import SpotCard from './SpotCard';
import Modal from './Modal';
import Button from './Button';
import AddPageforTrip from "./AddPageforTrip";

import { fetchWithJwt } from '../hooks/fetchWithJwt';
import { useLanguage } from '../hooks/useLanguage';

const AddSpotModal = ({ isOpen, onClose }) => {
    const [addPage, showAddPage] = useState(false);

    const words = {
        zh: {
            address: "地址:",
            phone: "電話:",
            open: "營業時間:",
            submit: "新增至行程",
            summary: "簡介:",
        },
        en: {
            address: "Address:",
            phone: "Phone number:",
            open: "Open Hour:",
            submit: "Add to trip",
            summary: "Summary:",
        },
    };

    const daysOfWeek = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
    ];

    const { language } = useLanguage();

    const [isLoading, setIsLoading] = useState(true); 

    const [isBrowsingSpots, setIsBrowsingSpots] = useState(true); // switch page
    const [spots, setSpots] = useState([]);
    const [spot, setSpot] = useState({});


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
            })
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

    const handleViewSpot = (spotId) => {
        setIsLoading(true);
        fetchWithJwt("/api/v1/place/detail?place_id=" + spotId, "GET")
            .then(function (response) {
                return response.json();
            })
            .then(function (result) {
                console.log(result);
                setIsLoading(false);
                setSpot(result["result"]);
            });
        setIsBrowsingSpots(false);
    };

    const handleOpenGoogleMap = () => {
        window.open(spot["google_maps_uri"],'_blank', 'rel=noopener noreferrer')
    };

    const formatTime = (time) => {
        const hour = time.hour < 10 ? `0${time.hour}` : time.hour;
        const minute = time.minute < 10 ? `0${time.minute}` : time.minute;
        return `${hour}:${minute}`;
    };

    return (
        <>
        {addPage && (
            <AddPageforTrip
                close={() => showAddPage(false)}
                spot={spot}
            />
        )}
        
        isOpen ? (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            showArrow={!isBrowsingSpots}
            setIsBrowsingSpots={setIsBrowsingSpots}
            title={isBrowsingSpots ? (language === "en" ? "Add spot to your trip" : "新增景點到你的旅程") : ""}
            content={
                isBrowsingSpots ? ( 
                    <>
                        <div className={style.searchboxcontainer}>
                            <SpotSearchBox onSearch={handleSearch} />
                        </div>
                        <div className={style.spotscontainer}>
                            {spots.map((spot) => (
                                <SpotCard
                                    key={spot["place_id"]}
                                    name={spot["name"]}
                                    src={spot["image"]}
                                    spotId={spot["place_id"]}
                                    onClick={() => handleViewSpot(spot["place_id"])}
                                />
                            ))}
                        </div>
                    </>)
                : (spot &&
                    <>
                        <div className={style.viewspotcontainer}>
                            <div className={style.imgcontainer}>
                                <img src={spot["image"]} alt="Logo" className={style.img} />
                            </div>

                            <div className={style.detailcontainer}>
                                <div className={style.spotname}>{spot["name"]}</div>
                                <div className={style.rating}>
                                    <div className={style.ratingtext}>{spot["rating"]} </div>
                                    <div className={style.item}>
                                        <TiStarFullOutline 
                                            size={17}
                                            style={{ fill: "var(--secondarycolor)" }}
                                        />
                                    </div>
                                    <div className={style.item}>{"(" + spot["user_rating_count"] + ")"}</div>
                                    <button className={style.linkicon} onClick={handleOpenGoogleMap}>
                                        <FiExternalLink size={17}/>
                                    </button>
                                </div>

                                <div className={style.row}>
                                    <div className={style.rowname}>
                                        {words[language]["address"]}
                                    </div>
                                    {spot["address"]}
                                </div>
                                <div className={style.row}>
                                    <div className={style.rowname}>
                                        {words[language]["summary"]}
                                    </div>
                                    {spot["summary"]}
                                </div>
                                <div className={style.row}>
                                    <div className={style.rowname}>
                                        {words[language]["open"]}
                                    </div>
                                    <div className={style.openhrblock}>
                                        {language === "zh" &&
                                            spot["opening_hours_d"]?.map(
                                                (openday, index) => {
                                                    return (
                                                        <div key={"zh" + index}>
                                                            {openday}
                                                        </div>
                                                    );
                                                }
                                            )}
                                        {language === "en" &&
                                            spot["opening_hours_p"]?.map(
                                                (time, index) => (
                                                    <div key={"en" + index}>
                                                        <strong>
                                                            {
                                                                daysOfWeek[
                                                                    time.open.day
                                                                ]
                                                            }
                                                            :
                                                        </strong>
                                                        {"  "}
                                                        {formatTime(time.open)} -
                                                        {formatTime(time.close)}
                                                    </div>
                                                )
                                            )}
                                    </div>
                                </div>
                            </div>

                            <div className={style.submit}>
                                <Button
                                    txt={words[language]["submit"]}
                                    func={() => showAddPage(true)}
                                />
                            </div>
                        </div>
                    </>
                )
            }
        />
        ) :  null;
    </>
    )
};

export default AddSpotModal;
