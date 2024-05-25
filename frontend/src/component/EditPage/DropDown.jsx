import React, { useState, useEffect } from "react";
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
            member: "查看成員名單",
            memberList: '成員名單',
            confirmtxt: "是否確認退出行程?",
        },
        en: {
            share: "Share",
            add: "Add Companion",
            delete: "Leave Trip",
            member: "View Members List",
            memberList: 'Group Members',
            confirmtxt: "Are you sure to quit this trip?",
        },
    };
    const { language } = useLanguage();
    const { id } = useParams();
    let { updateUserData } = useAuth();
    const navigate = useNavigate();
    const [openAdd, setOpenAdd] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [showGroupMember, setShowGroupMember] = useState(false);
    const [groupMembers, setGroupMembers] = useState([]);

    useEffect(() => {
        const fetchGroupMembers = async () => {
            try {
                const response = await fetchWithJwt(`/api/v1/group/set_group_member?trip_id=${id}`, 'GET');
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
    }, [id]);


    const handleCloseGroupMember = () => {
        setShowGroupMember(false);
    }
    
    const delUser = (tripid) => {
        fetchWithJwt("/api/v1/group/set_group_member", "DELETE", {
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
            className={`${style.dropdowncontainer} ${open ? null : style.close
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
                text={words[language]["member"]}
                icon={<FaEdit />}
                onClick={() => {
                    setOpen(false);
                    setShowGroupMember(true);
                }}
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
            {showGroupMember && (
                <>
                    <div className={style.overlay} onClick={handleCloseGroupMember}></div>
                    <div className={style.groupMemberContainer}>
                        <div><strong>{words[language]['memberList']}</strong></div>
                        <ul className={style.memberList}>
                            {groupMembers.map(member => (
                                <li key={member.user_email} className={style.memberDetail}>
                                    <img src={`../../${member.user_avatar}.png`} alt={member.user_name} className={style.avatar} />
                                    <span className={style.memberName}>{member.user_name}</span>
                                    <span className={style.memberEmail}>{member.user_email}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            )}
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
