import React, { useRef, useState } from "react";
import style from "./InputText.module.css";

const InputText = ({ propmt, name, setting = {}, onChange }) => {
    const {
        require = false,
        focus = false,
        type = "text",
        width = "100%",
        fontSize = "1rem",
    } = setting;
    const inputtxt = useRef(null);
    const [inputValue, setInputValue] = useState("");
    const handleChange = (event) => {
        const newValue = event.target.value;
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };

    return (
        <div
            style={{ width: width }}
            className={`${style.inputcontainer} ${
                inputValue === "" ? style.type : style.type
            }`}
            onClick={() => {
                inputtxt.current.focus();
            }}
        >
            <input
                ref={inputtxt}
                type={type}
                id={name}
                name={name}
                autoComplete={name}
                required={require}
                autoFocus={focus}
                value={inputValue}
                onChange={handleChange}
                placeholder=" "
                style={{ fontSize: fontSize }}
            />
            <label style={{ fontSize: fontSize }}>{propmt}</label>
        </div>
    );
};

export default InputText;
