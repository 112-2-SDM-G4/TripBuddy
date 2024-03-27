import React, { useState } from "react";
import Menu from "../component/Menu";
import style from "./Edit.module.css";
import Button from "../component/Button";
import InputText from "../component/InputText";

export default function Edit() {
    const [stage, setStage] = useState(0);

    return (
        <div>
            <div className={style.main}>
                {stage === 0 && <InitialPage setStage={setStage} />}
            </div>
        </div>
    );
}

function InitialPage({ setStage }) {
    return (
        <div className={style.initialpage}>
            <InputText
                propmt={"地區"}
                name={"place"}
                setting={{ require: true, width: "50%" }}
            />
            <Button
                txt={"下一頁"}
                func={() => {
                    setStage(1);
                }}
                setting={{ width: "50%" }}
            />
        </div>
    );
}
