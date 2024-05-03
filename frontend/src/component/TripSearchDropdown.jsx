import React, { useState } from "react";
import style from "./TripSearchDropdown.module.css";

import { useNavigate } from "react-router-dom";
import { useLanguage } from "../hooks/useLanguage";
import Tag from "./Tag";

const TripSearchDropdown = ({
    setIsDropdownOpen,
    addSelectedTagsId,
    allTags,
    stylesetting = {},
}) => {
    const navigate = useNavigate();
    const { language, toggleLanguage } = useLanguage();

    return (
        <div className={style.main} style={stylesetting}>
            {allTags.map((category) => {
                return (
                    <div
                        key={category[`type_name_en`]}
                        className={style.section}
                    >
                        <div className={style.sectiontitle}>
                            <div className={style.item}>
                                {category[`type_name_${language}`]}
                            </div>
                        </div>

                        <div className={style.tags}>
                            {category.options.map((tag) => {
                                return (
                                    <Tag
                                        key={tag["tag_id"]}
                                        tagId={tag["tag_id"]}
                                        onClick={() =>
                                            addSelectedTagsId(tag["tag_id"])
                                        }
                                        text={tag[`tag_name_${language}`]}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default TripSearchDropdown;
