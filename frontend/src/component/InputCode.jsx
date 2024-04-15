import React, { useEffect, useRef } from "react";
import style from "./InputCode.module.css";

const InputCode = ({ length, label, loading, value, onChange, onComplete }) => {
    const inputs = useRef(new Array(length).fill(null));

    useEffect(() => {
        // Reset code when external value changes and is empty
        if (value.length === 0) {
            inputs.current[0]?.focus();  // Focus the first input on reset
        }
    }, [value]);

    const processInput = (e, slot) => {
        const num = e.target.value;
        if (/[^0-9]/.test(num)) return; // Prevent non-numeric input
    
        const newCode = value.split(''); // Split the existing value to update it
        newCode[slot] = num; // Set the new value for the specific slot
        onChange(newCode.join('')); // Update the external state with the new value as a string
    
        if (slot !== length - 1 && num) {
            inputs.current[slot + 1].focus(); // Focus next input field if not the last one and input is not empty
        }
    
        // Check if all inputs are filled
        if (newCode.length === length) {
            onComplete(newCode.join('')); // Complete with the new code as a string if every slot is filled
        }
    };

    const onKeyUp = (e, slot) => {
        if (e.key === "Backspace" && !value[slot] && slot !== 0) {
            inputs.current[slot - 1].focus();
        }
    };

    return (
        <div className={style.input_code}>
            <label className={style.code_label}>{label}</label>
            <div className={style.code_inputs}>
                {new Array(length).fill(null).map((_, idx) => (
                    <input
                        key={idx}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={value[idx] || ""}
                        autoFocus={idx === 0 && value.length === 0}
                        readOnly={loading}
                        onChange={(e) => processInput(e, idx)}
                        onKeyUp={(e) => onKeyUp(e, idx)}
                        ref={el => inputs.current[idx] = el}
                    />
                ))}
            </div>
        </div>
    );
};

export default InputCode;
