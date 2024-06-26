import React, { useRef, useState } from "react";
import style from "./InputText.module.css";

const InputText = ({ propmt, name, setting = {}, onChange, onBlur }) => {
    const {
        require = false,
        focus = false,
        type = "text",
        width = "100%",
        defaultValue = "",
        min = 0,
        readOnly = false,
    } = setting;
    const inputtxt = useRef(null);
    const [inputValue, setInputValue] = useState(defaultValue);
    const handleChange = (event) => {
        const newValue = event.target.value;
        if (type === "number") {
            if (newValue < min) {
                return;
            }
            if (newValue.includes(".")) {
                const parts = newValue.split(".");
                if (parts[1].length > 2) {
                    return;
                }
            }
        }
        setInputValue(newValue);
        if (onChange) {
            onChange(newValue);
        }
    };
    const handleBlur = (event) => {
        const value = event.target.value;
        if (onBlur) {
            onBlur(value);
        }
    };

    return (
        <div
            style={{ width: width }}
            className={`${style.inputcontainer}`}
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
                readOnly={readOnly}
                required={require}
                autoFocus={focus}
                value={inputValue}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder=" "
            />
            <label>{propmt}</label>
        </div>
    );
};

export default InputText;
