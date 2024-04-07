import React from "react";
import { useParams } from 'react-router';
import disneyPic from "../fakeData/images/disney.png"


import style from "./ViewAttraction.module.css";

const Attraction = () => {
    const { id } = useParams();
    // get attraction information

    return <div className={style.main}>
        <div className={style.img}>
            <img src={disneyPic} alt="Logo" className={style.img}/>
        </div>

        <div className={style.textbox}>
            <div className={style.title}> 東京迪士尼 </div>
            <div className={style.info}>
                <div> Rate: 4.7 </div>
                <div> Address: Urayasu, Chiba, Japan </div>
                <div> Phone number: 3242342 </div>
                <div> Open Hour: 9-18 </div>
            </div>
        </div>
    </div>;
};

export default Attraction;
