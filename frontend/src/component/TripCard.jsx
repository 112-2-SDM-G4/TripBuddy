import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { fetchWithJwt } from '../hooks/fetchWithJwt';
import { useLanguage } from "../hooks/useLanguage";

import style from "./TripCard.module.css";
import Tag from "./Tag";
import defultImage from "../assets/defaultImg.jpg";
import CountryData from "../assets/Country.json";

function TripCard({
    name,
    src,
    tripId,
    tagNames,
    isPublic = false,
    start_date = null,
    end_date = null,
    location_id,
    date_status = null
}) {
    const navigate = useNavigate();
    const { language } = useLanguage();
    const [groupMembers, setGroupMembers] = useState([]);

    const words = {
        en: {
            fetch_group_member_err: 'Failed to fetch group members:',
            ended: 'Ended',
            ongoing: 'Ongoing',
            within_7_days: 'Within 7 Days'
        },
        zh: {
            fetch_group_member_err: '讀取成員名單失敗:',
            ended: '已結束',
            ongoing: '進行中',
            within_7_days: '7天內'
        }
    };

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetchWithJwt(`/api/v1/group/set_group_member?trip_id=${tripId}`, 'GET');
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                if (data.trip_member_info && data.trip_member_info.length > 0) {
                    setGroupMembers(data.trip_member_info);
                }
            } catch (error) {
                console.error(words[language]['fetch_group_member_err'], error);
            }
        };

        fetchGroupMembers();
    }, [tripId]);

    const country = CountryData.places.find(
        (place) => place.country_id === location_id
    );

    const formatDate = (dateArray) => {
        if (!dateArray) return '';
        const [year, month, day] = dateArray;
        return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case -1:
                return words[language]['ended'];
            case 1:
                return words[language]['ongoing'];
            case 2:
                return words[language]['within_7_days'];
            default:
                return '';
        }
    };

    return (
        <div
            className={style.card}
            onClick={() => {
                navigate(`/edit/${tripId}`);
            }}
        >
            {date_status !== null && (
                <div className={`${style.status} ${style[`status${date_status}`]}`}>
                    {getStatusLabel(date_status)}
                </div>
            )}
            <img
                src={src || defultImage}
                alt="spot loading"
                className={style.img}
            />
            <div className={style.info}>
                <div className={style.title}>
                    <div>{name}</div>
                    <div className={style.icons}>
                        {country && (
                            <img
                                src={country.icon}
                                alt={country.country.en}
                                className={style.countryIcon}
                            />
                        )}
                        <div
                            className={style.icon}
                            onClick={(event) => {
                                event.stopPropagation();
                            }}
                        >
                            {/* <IoMdHeartEmpty size={20} /> */}
                        </div>
                    </div>
                </div>
                <div className={style.dates}>
                    {start_date && <div>{formatDate(start_date)}</div>}
                    {end_date && <div>{formatDate(end_date)}</div>}
                </div>
                {isPublic && (
                    <div className={style.tags}>
                        {tagNames.map((tagName) => (
                            <Tag key={tagName} text={tagName} />
                        ))}
                    </div>
                )}
                {groupMembers.length > 0 && (
                    <div className={`${style.members} ${style.membersCount}`}>
                        <span className={style.memberCountText}>
                            {groupMembers.length} {language === 'en' ? 'members' : '成員'}
                        </span>
                        <div className={style.memberAvatars}>
                            {groupMembers.slice(0, 3).map((member, index) => (
                                <div key={index} className={style.memberContainer}>
                                    <img
                                        src={`../../${member.user_avatar}.png`}
                                        alt={member.user_name}
                                        className={style.memberAvatar}
                                    />
                                    <span className={style.tooltip}>{member.user_name}</span>
                                </div>
                            ))}
                            {groupMembers.length > 3 && (
                                <div className={style.moreMembers}>
                                    +{groupMembers.length - 3} more
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default TripCard;
