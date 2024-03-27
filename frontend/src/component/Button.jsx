import React from "react";
import style from "./Button.module.css";

function Button({ txt, func }) {
    return (
        <div className={style["button-68"]} onClick={func}>
            {txt}
        </div>
    );
}

export default Button;
