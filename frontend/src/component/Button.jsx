import React from "react";
import style from "./Button.module.css";

function Button({ txt, func, setting = {} }) {
    const { width = "100%", type = "button" } = setting; // Default type to "button"
    return (
        <button
            style={{ width: width }}
            className={style["button-68"]}
            onClick={func}
            type={type} // Now you can pass "submit" as part of the setting prop
        >
            {txt}
        </button>
    );
}

export default Button;
