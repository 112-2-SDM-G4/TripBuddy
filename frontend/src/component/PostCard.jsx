import React from "react";
import { IoMdHeartEmpty } from "react-icons/io";
import { IoMdHeart } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import style from "./PostCard.module.css";
import Tag from "./Tag";
import { useLanguage } from "../hooks/useLanguage";
import { fetchWithJwt } from "../hooks/fetchWithJwt";
import defultImage from "../assets/defaultImg.jpg";


function PostCard({ name, src, tripId, tagNames, isFav }) {
    const navigate = useNavigate();
    const { language } = useLanguage();

    const words = {
        zh: {
            addSuccess: "收藏成功!",
            removeSuccess: "已刪除收藏!",
        },
        en: {
            addSuccess: "Trip successfully added to favorites!",
            removeSuccess: "Trip successfully removed from favorites!",
        },
    };

    const addToFav = (tripId) => {
        fetchWithJwt(`/api/v1/heart/${tripId}`, "POST", {
            heart: !isFav
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if(!isFav) {
                    alert(words[language]["addSuccess"]);
                } else {
                    alert(words[language]["removeSuccess"]);
                }
                window.location.reload();
            })
            .catch((error) => {
                console.log(
                    "There was a problem with the fetch operation:",
                    error
                );
                if (error.response) {
                    error.response.json().then((errorMessage) => {
                        alert(errorMessage.message);
                        console.log("Error message:", errorMessage.message);
                    });
                } else {
                    console.log("Network error:", error.message);
                }
            });
    };

    return (
        <div className={style.card} onClick={() => navigate(`/post/${tripId}`)}>
            <img src={src || defultImage} alt="spot loading" className={style.img} />
            <div className={style.row}>
                <div className={style.infotxt}>{name}</div>

                <div
                    className={style.icon}
                    onClick={(event) => {
                        event.stopPropagation();
                        addToFav(tripId);
                    }}
                >
                    {isFav ? 
                        <IoMdHeart
                            size={20} 
                            style={{ fill: "color-mix(in srgb, var(--fontcolor) 20%, #FF5151)" }} />
                        : <IoMdHeartEmpty size={20} />
                    }
                </div>
            </div>

            <div className={style.tags}>
                {tagNames.map((tagName, index) => 
                    <Tag 
                        key={tagName + index}
                        text={tagName}
                    />
                )}
            </div>
            
        </div>
    );
}

export default PostCard;
