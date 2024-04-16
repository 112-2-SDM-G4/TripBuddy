import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useLanguage } from "../hooks/useLanguage";
import style from "./SearchBox.module.css";

function SearchBox({ onSearch }) {
    const words = {
        zh: { search: "搜尋..." },
        en: { search: "Search..." },
    };
    const { language } = useLanguage();
    const [query, setQuery] = useState("");

    const handleChange = (event) => {
        setQuery(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query);
    };

    return (
        <form
            onFormSubmit={handleSubmit} 
            className={style.container} >
            <input
                type="text"
                value={query}
                onChange={handleChange}
                placeholder={words[language]["search"]}
                className={style.input}
            />
            <button
                type="submit"
                className={`${style.button} ${
                    language === "zh" ? style.zh : null
                }`}
            >
                <IoSearch
                    size={17}
                    style={{ fill: "var(--backgroundcolor)" }}
                />
            </button>
        </form>
    );
}

export default SearchBox;
