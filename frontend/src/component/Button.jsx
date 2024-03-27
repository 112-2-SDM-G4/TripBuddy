import React from "react";
import style from "./Button.module.css";

function Button({ txt, func, setting = {} }) {
    const { width = "100%" } = setting;
    return (
        <div
            style={{ width: width }}
            className={style["button-68"]}
            onClick={func}
        >
            {txt}
        </div>
    );
}

export default Button;
