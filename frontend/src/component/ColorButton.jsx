import React, { useEffect } from "react";
import style from "./ColorButton.module.css";

export const ColorButton = ({ setIsDarkMode }) => {
    useEffect(() => {
        const storedTheme = localStorage.getItem("darkMode");
        setIsDarkMode(storedTheme === "true");
    }, [setIsDarkMode]);

    const toggleDarkMode = () => {
        setIsDarkMode((prevMode) => {
            localStorage.setItem("darkMode", !prevMode);
            return !prevMode;
        });
    };

    return (
        <div className={style.colormode_button} onClick={toggleDarkMode}>
            <svg
                fill="#000000"
                height="800px"
                width="800px"
                version="1.1"
                viewBox="0 0 285.92 285.92"
            >
                <g>
                    <path
                        d="M142.96,0C64.132,0,0,64.132,0,142.96s64.132,142.96,142.96,142.96s142.96-64.132,142.96-142.96S221.788,0,142.96,0z
            M260.92,142.96c0,59.734-44.631,109.241-102.298,116.925c-3.956,0.527-7.946-0.68-10.947-3.31s-4.715-6.429-4.715-10.419V39.765
            c0-3.987,1.722-7.779,4.72-10.407c2.998-2.628,6.989-3.849,10.942-3.322C216.289,33.719,260.92,83.226,260.92,142.96z"
                    />
                </g>
            </svg>
        </div>
    );
};
