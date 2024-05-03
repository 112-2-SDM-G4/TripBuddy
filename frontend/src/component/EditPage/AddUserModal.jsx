import React, { useState } from "react";
import { useParams } from "react-router-dom";
import style from "../../page/Edit.module.css";

import Button from "../Button";
import InputText from "../InputText";
import Modal from "../Modal";

import { useLanguage } from "../../hooks/useLanguage";
import { fetchWithJwt } from "../../hooks/fetchWithJwt";

export default function AddUserModal({ close }) {
    const words = {
        zh: {
            title: "添加旅伴",
            email: "信箱",
            send: "發出邀請",
            success: "邀請成功，快與你的新夥伴建立全新的旅程吧",
        },
        en: {
            title: "Add Companion",
            email: "Email",
            send: "Invite to join",
            success:
                "The invitation is successful, start a new journey with your new partner",
        },
    };
    const { id } = useParams();
    const { language } = useLanguage();
    const [email, setEmail] = useState("");

    const addNewUser = (tripid, userid) => {
        fetchWithJwt("/api/v1/schdule/set_goup_member", "POST", {
            trip_id: tripid,
            invited_id: userid,
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (data.valid) {
                    alert(words[language]["success"]);
                    close();
                } else {
                    alert(data.message);
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

    return (
        <Modal onClose={close}>
            <div className={style.addusermodal}>
                {words[language]["title"]}
                <InputText
                    propmt={words[language]["email"]}
                    name={"email"}
                    setting={{ require: true, width: "100%" }}
                    onChange={setEmail}
                />
                <Button
                    txt={words[language]["send"]}
                    func={() => {
                        addNewUser(id, email);
                    }}
                    setting={{ width: "100%" }}
                />
            </div>
        </Modal>
    );
}
