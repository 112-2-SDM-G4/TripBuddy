import React from "react";
import style from "./Explore.module.css";
import disneyPic from "../fakeData/images/disney.png";
import AttractionCard from "../component/AttractionCard";

const Explore = () => {
    return (
        <div className={style.main}>
            explore page
            <div className={style.cardwrapper}>
                <AttractionCard
                    name="東京迪士尼"
                    src={disneyPic}
                    attractionId={234}
                />
                <AttractionCard
                    name="東京迪士尼"
                    src={disneyPic}
                    attractionId={235}
                />
            </div>
        </div>
    );
};

export default Explore;
