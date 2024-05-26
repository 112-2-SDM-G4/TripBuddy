import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaDice } from "react-icons/fa";
import style from "./AIAssistant.module.css";

import { useLanguage } from '../hooks/useLanguage';
import Calendar from "../component/Calendar";
import Button from "../component/Button";
import SearchableSelect from '../component/SearchableSelect';
import Modal from '../component/Modal';
import Loader from '../component/Loader';

import { fetchWithJwt } from '../hooks/fetchWithJwt';

import CountryData from "../assets/Country.json";

const AIAssistant = () => {
    const navigate = useNavigate();
    const { language, toggleLanguage } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);
    const [displayCalendar, setDisplayCalendar] = useState(false);
    const [displayCountry, setDisplayCountry] = useState(false);
    const [selectedCountryId, setSelectedCountryId] = useState(-1);

    const [selectedStart, setSelectedStart] = useState("");
    const [selectedEnd, setSelectedEnd] = useState("");

    const [isRandom, setIsRandom] = useState(true);
    const [prompt, setPrompt] = useState("");

    const [newTripId, setNewTripId] = useState(-1);
    const [aiMsg, setAiMsg] = useState("");
    const [showModal, setShowModal] = useState(false);

    const words = {
        zh: {
            select: "請選擇",
            triptime: "為旅程選擇一個時間",
            country: "選擇國家",
            askAI: "使用AI小助手創建旅程",
            random: "隨機",
            choose: "自行選擇",
            input: "輸入你想要的旅程描述",
            goto: "前往查看新行程",
            errormsg: "有錯誤發生:( 請稍後再試",
            success: "成功建立新旅程！"
        },
        en: {
            select: "Select",
            triptime: "Choose a time for trip",
            country: "Choose a country",
            askAI: "Ask AI Assistant to schedule a trip",
            random: "Random",
            choose: "Choose",
            input: "Describe the trip you'd like to schedule",
            goto: "Go to this new trip",
            errormsg: "Some error occured:( Please try again.",
            success: "Trip created successfully."
        }
    }

    const handleSubmit = async () => {
        if(selectedStart === undefined || selectedEnd === undefined ||
            (!isRandom && selectedCountryId === -1) || prompt === ""
        ) {
            alert("Please fill in all fields.");
            return;
        }
        setIsLoading(true);
        await fetchWithJwt('/api/v1/trip/ai_generate', 'POST', {
            text: prompt,
            start_date: [selectedStart.getFullYear(), selectedStart.getMonth() + 1, selectedStart.getDate()],
            end_date: [selectedEnd.getFullYear(), selectedEnd.getMonth() + 1, selectedEnd.getDate()],
            location_id: selectedCountryId,
            location: [
                CountryData.places.find(
                    (place) => place.country_id === selectedCountryId
                ).latitude,
                CountryData.places.find(
                    (place) => place.country_id === selectedCountryId
                ).longitude
            ]
        })
        .then(function (response) {
            console.log("res", response);
            return response.json();
        })
        .then(function (result) {
            console.log("result", result);
            if(result["message"] === "Internal Server Error") { // 500
                setAiMsg(words[language]["errormsg"]);
                setShowModal(true);
            } else if (result["message"] === "Trip created successfully.") {
                setAiMsg(words[language]["success"]);
                setNewTripId(result["trip_id"])
                setShowModal(true);
            } else {
                setAiMsg(result["msg"]);
                setShowModal(true);
            }
        });
        setIsLoading(false);
    }

    const formatDate = (dateString) => {
        if(dateString === undefined) {
            setSelectedEnd("")
        }
        const date = new Date(dateString);
    
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份從 0 開始，所以要加 1
        const day = String(date.getDate()).padStart(2, '0');
    
        return `${year}/${month}/${day}`;
    }

    const onClose = () => {
        setAiMsg("") // reset AI message
        setShowModal(false);
    }

    return (
        <div className={style.main} onClick={() => {
            setDisplayCalendar(false);
            setDisplayCountry(false);
        }}>
            <div className={style.maincontent}>
                <div className={style.row}>
                    <div className={style.title}>{words[language]["triptime"]}</div>
                    <div className={style.section}>
                        <div className={style.button} onClick={(e) => {
                            e.stopPropagation();
                            setDisplayCalendar(!displayCalendar)
                        }}>
                            {(selectedStart !== "" && selectedEnd !== "") 
                                ? `${formatDate(selectedStart)} ~ ${formatDate(selectedEnd)}`
                                : words[language]["select"]}
                        </div>
                        <div 
                            className={`${style.span} ${
                                displayCalendar ? null : style.hidespan
                            }`}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div
                                className={`${style.calendarcontainer} ${
                                    displayCalendar ? null : style.hidecalendar
                                }`}
                            >
                                <Calendar
                                    selectedStart={selectedStart}
                                    setSelectedStart={setSelectedStart}
                                    selectedEnd={selectedEnd}
                                    setSelectedEnd={setSelectedEnd}
                                    toggleDropdown={() => setDisplayCalendar(!displayCalendar)}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={style.row}>
                    <div className={style.title}>{words[language]["country"]}</div>
                    <div className={style.section}>
                        <div className={style.sectionrow}>
                            <div className={style.selectbtns}>
                                <div className={`${style.btn} ${style.rightborder} ${isRandom ? style.selectedbtn : style.unselectedbtn}`} onClick={() => setIsRandom(true)}>
                                    {<FaDice size={17}/>}
                                    {` ${words[language]["random"]}`}
                                </div>
                                <div className={`${style.btn} ${style.leftborder} ${!isRandom ? style.selectedbtn : style.unselectedbtn}`} onClick={() => setIsRandom(false)}>
                                    {words[language]["choose"]}
                                </div>
                            </div>
                            {!isRandom && <div className={style.selectcountry}>
                                <SearchableSelect
                                    words={{
                                        zh: {
                                            select: "請選擇",
                                            search: "搜尋",
                                        },
                                        en: {
                                            select: "Select",
                                            search: "Search",
                                        },
                                    }}
                                    options={CountryData.places.map((c) => {
                                        return {
                                            value: c.country[language],
                                            id: c.country_id,
                                        };
                                    })}
                                    onSelect={(value) => {
                                        setSelectedCountryId(value.id);
                                    }}
                                    className={style.searchableselect}
                                />
                            </div>}
                        </div>
                    </div>
                </div>

            <div>
                <div className={style.title}>{words[language]["input"]}</div>
                <div className={style.textarea}>
                    <textarea
                        name = "promptarea"
                        type="text"
                        id="prompt"
                        value = {prompt}
                        onChange={e => setPrompt(e.target.value)}
                    >
                    </textarea>
                </div>

            </div>


                

                <div className={style.submit}>
                    <Button
                        txt={words[language]["askAI"]}
                        func={handleSubmit}
                    />
                </div>
            </div>

            {showModal && 
                <Modal onClose={onClose}>
                    {aiMsg}
                    {aiMsg === words["en"]["success"] &&
                        <div className={style.modalbtn}>
                            <Button 
                                txt={words[language]["goto"]}
                                func={() => navigate(`/edit/${newTripId}`)}
                            />
                        </div>

                    }
                </Modal>
            }
            <Loader isLoading={isLoading}/>
        </div>
    );
};

export default AIAssistant;
