import React, { useState, useEffect } from "react";
import style from "./SearchableSelect.module.css";
import { useLanguage } from "../hooks/useLanguage";

export default function SearchableSelect({
    words,
    options,
    onSelect,
    setvalue,
}) {
    const { language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOption, setSelectedOption] = useState(
        setvalue ? setvalue : null
    );

    useEffect(() => {
        setSearchTerm("");
        setSelectedOption("");
        setIsOpen(false);
        return () => {};
    }, [language]);

    useEffect(() => {
        setSelectedOption(setvalue);
        return () => {};
    }, [setvalue]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        setSearchTerm(""); // 打开下拉菜单时重置搜索词
    };

    const handleSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false); // 选中选项后关闭下拉菜单
    };

    const filteredOptions = options.filter((option) =>
        searchTerm
            ? option.toLowerCase().includes(searchTerm.toLowerCase())
            : true
    );

    return (
        <div className={style.main}>
            <div className={style.container} onClick={handleToggle}>
                <div className={style.selected}>
                    {selectedOption
                        ? selectedOption
                        : words[language]["select"]}
                </div>
                <div className={`dropdown-icon ${isOpen ? "open" : ""}`}>
                    &#9662;
                </div>
            </div>
            {isOpen && (
                <div className={style.menu}>
                    <input
                        type="text"
                        className={style.input}
                        placeholder={words[language]["search"]}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <ul className={style.options}>
                        {filteredOptions.map((option) => (
                            <li
                                key={words["en"]["select"] + option}
                                onClick={() => handleSelect(option)}
                                className={style.option}
                            >
                                {option}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
