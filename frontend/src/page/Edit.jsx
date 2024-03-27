import React, { useState } from "react";
import Menu from "../component/Menu";
import style from "./Edit.module.css";
import Button from "../component/Button";

export default function Edit() {
    const [stage, setStage] = useState(0);

    return (
        <div>
            <div className={style.main}>
                {stage === 0 && <InitialPage setStage={setStage} />}
            </div>
            <Menu />
        </div>
    );
}

function InitialPage({ setStage }) {
    return (
        <div>
            <Button
                txt={"下一頁"}
                onclick={() => {
                    setStage(1);
                }}
            />
        </div>
    );
}
