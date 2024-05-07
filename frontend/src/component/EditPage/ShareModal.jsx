import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import style from "../../page/Edit.module.css";

import Button from "../Button";
import InputText from "../InputText";
import Modal from "../Modal";
import Tag from "../Tag";
import TripSearchDropdown from "../TripSearchDropdown";

import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";
import { fetchWithJwt } from "../../hooks/fetchWithJwt";

export default function ShareModal({ close }) {
    const words = {
        zh: {
            title: "公開行程",
            intro: "簡單介紹你的行程",
            send: "分享",
            back: "取消",
            tag: "標籤選擇",
            success:
                "成功分享！你的行程現已公開，任何人都可以查看。快來探索吧！",
        },
        en: {
            title: "Share Trip",
            intro: "Briefly introduce your trip",
            send: "Share",
            back: "Not to share",
            tag: "Tag selection",
            success:
                "Shared successfully! Your itinerary is now public for everyone to see. Start exploring!",
        },
    };
    const { id } = useParams();
    const { language } = useLanguage();
    let { updateUserData } = useAuth();
    const [content, setContent] = useState("");
    const [tags, setTags] = useState([]);
    const [allTags, setAllTags] = useState([]);
    const [selectedTag, setSelectedTag] = useState([]);

    useEffect(() => {
        getTag();
        return () => {};
    }, []);

    const getTag = () => {
        fetchWithJwt(`/api/v1/tag/get_tags?source=SharePost`, "GET")
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (Array.isArray(data)) {
                    setTags(data);
                    setAllTags(
                        data
                            .map((cat) => {
                                return cat["options"];
                            })
                            .flat()
                    );
                }
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
    const shareTrip = (tags_id, content, share) => {
        fetchWithJwt(`/api/v1/post/${id}`, "PUT", {
            tags_id: tags_id,
            content: content,
            public: share,
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                alert(words[language]["success"]);
                close();
                updateUserData();
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
        <Modal onClose={close}>
            <div className={style.addusermodal}>
                {words[language]["title"]}
                <InputText
                    propmt={words[language]["intro"]}
                    name={"intro"}
                    setting={{ require: true, width: "100%", height: "6rem" }}
                    onChange={setContent}
                />
                <div className={style.sharedropdown}>
                    <div className={style.sharedropdowntitle}>
                        {words[language]["tag"]}
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        {Array.isArray(selectedTag) &&
                            selectedTag.map((tagId) => (
                                <Tag
                                    key={tagId}
                                    tagId={tagId}
                                    text={
                                        allTags.find(
                                            (tag) => tag["tag_id"] === tagId
                                        )[`tag_name_${language}`]
                                    }
                                    inSearchbox={true}
                                    removeFromSearch={() =>
                                        setSelectedTag((prev) =>
                                            prev.filter((t) => t !== tagId)
                                        )
                                    }
                                />
                            ))}
                    </div>
                    <TripSearchDropdown
                        allTags={tags ? tags : []}
                        addSelectedTagsId={(value) => {
                            setSelectedTag((prev) => {
                                if (prev.includes(value)) {
                                    return [...prev];
                                }
                                return [...prev, value];
                            });
                        }}
                        stylesetting={{
                            height: "10rem",
                            marginTop: "1rem",
                            position: "relative",
                        }}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                    }}
                >
                    <Button
                        txt={words[language]["back"]}
                        func={() => {
                            shareTrip(selectedTag, content, false);
                        }}
                        setting={{ width: "45%" }}
                    />
                    <Button
                        txt={words[language]["send"]}
                        func={() => {
                            shareTrip(selectedTag, content, true);
                        }}
                        setting={{ width: "45%" }}
                    />
                </div>
            </div>
        </Modal>
    );
}
