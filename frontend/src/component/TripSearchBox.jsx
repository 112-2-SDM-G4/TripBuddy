import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useLanguage } from "../hooks/useLanguage";
import style from "./TripSearchBox.module.css";
import TripSearchDropdown from "./TripSearchDropdown"
import Tag from "./Tag";

function TripSearchBox({ 
    onSearch, 
    setIsDropdownOpen, 
    isDropdownOpen, 
    addSelectedTagsId,
    removeSelectedTagsId, 
    selectedTagsId, 
    allTags 
}) {
    const words = {
        zh: { search: "搜尋..." },
        en: { search: "Search..." },
    };
    const { language } = useLanguage();
    const [query, setQuery] = useState("");

    const handleChange = (event) => {
        setQuery(event.target.value);
        // console.log(selectedTagsId)
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(query);
    };

    const allTagsMapping = allTags.map(cat => {
        return (
            cat["options"]
        )
    }).flat()

    return (
        <div className={style.main} onClick={(e) => {
            e.stopPropagation();
            setIsDropdownOpen(true)
        }}>
            <form onSubmit={handleSubmit} className={style.container}>
                {selectedTagsId.length !== 0 && 
                    selectedTagsId.map(tagId =>
                    <Tag 
                        key={tagId}
                        tagId={tagId}
                        text={allTagsMapping.find(tag => tag["tag_id"] === tagId)[`tag_name_${language}`]}
                        inSearchbox={true}
                        removeFromSearch={removeSelectedTagsId}
                    />)
                }
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

            {isDropdownOpen &&
            <div className={style.dropdown}>
                <TripSearchDropdown 
                    setIsDropdownOpen={setIsDropdownOpen}
                    addSelectedTagsId={addSelectedTagsId}
                    allTags={allTags}
                />
            </div>}
        </div>
    );
}

export default TripSearchBox;
