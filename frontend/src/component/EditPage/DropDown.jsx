import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import style from "../../page/Edit.module.css";

import AddUserModal from "./AddUserModal";
import ShareModal from "./ShareModal";

import { useLanguage } from "../../hooks/useLanguage";
import { useAuth } from "../../hooks/useAuth";
import { fetchWithJwt } from "../../hooks/fetchWithJwt";

import { IoRemoveCircle, IoPersonAdd } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { IoMdShareAlt } from "react-icons/io";

export default function DropDown({ open, setOpen }) {
    const words = {
        zh: {
            share: "分享",
            add: "添加旅伴",
            delete: "退出行程",
            edit: "編輯行程資料",
            confirmtxt: "是否確認退出行程?",
        },
        en: {
            share: "Share",
            add: "Add Companion",
            delete: "Leave Trip",
            edit: "Edit Trip Details",
            confirmtxt: "Are you sure to quit this trip?",
        },
    };
    const { language } = useLanguage();
    const { id } = useParams();
    let { updateUserData } = useAuth();
    const navigate = useNavigate();
    const [openAdd, setOpenAdd] = useState(false);
    const [openShare, setOpenShare] = useState(false);

    const delUser = (tripid) => {
        fetchWithJwt("/api/v1/schdule/set_goup_member", "DELETE", {
            trip_id: tripid,
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                updateUserData();
                navigate("/mytrips");
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
        <div
            className={`${style.dropdowncontainer} ${
                open ? null : style.close
            }`}
        >
            <DropdownItem
                text={words[language]["add"]}
                icon={<IoPersonAdd />}
                onClick={() => {
                    setOpenAdd(true);
                }}
            />
            <DropdownItem
                text={words[language]["edit"]}
                icon={<FaEdit />}
                onClick={() => {}}
            />
            <DropdownItem
                text={words[language]["share"]}
                icon={<IoMdShareAlt />}
                onClick={() => {
                    setOpenShare(true);
                }}
            />
            <DropdownItem
                text={words[language]["delete"]}
                icon={<IoRemoveCircle />}
                onClick={() => {
                    if (window.confirm(words[language]["confirmtxt"])) {
                        delUser(id);
                    }
                }}
            />
            {openAdd && (
                <AddUserModal
                    close={() => {
                        setOpenAdd(false);
                        setOpen(false);
                    }}
                />
            )}
            {openShare && (
                <ShareModal
                    close={() => {
                        setOpenShare(false);
                        setOpen(false);
                    }}
                />
            )}
        </div>
    );
}

const DropdownItem = ({ text, icon, onClick }) => {
    return (
        <div
            className={style.dropdownitem}
            onClick={() => {
                onClick();
            }}
        >
            <div className={style.item}>{icon}</div>
            <div className={style.item}>{text}</div>
        </div>
    );
};
