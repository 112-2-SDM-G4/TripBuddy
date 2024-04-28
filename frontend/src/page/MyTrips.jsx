import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../hooks/useAuth";
import { useLanguage } from "../hooks/useLanguage";

import style from "./MyTrips.module.css";
import TripCard from "../component/TripCard";
import Button from "../component/Button";
import AddSpotModal from "../component/AddSpotModal";

const MyTrips = () => {
    const [isSpotModalOpen, setIsSpotModalOpen] = useState(false);

    const openSpotModal = () => setIsSpotModalOpen(true);
    const closeSpotModal = () => setIsSpotModalOpen(false);

    const navigate = useNavigate();
    const { language } = useLanguage();
    const { user } = useAuth();

    return (
        <>
            <AddSpotModal 
                    isOpen={isSpotModalOpen} 
                    onClose={closeSpotModal} 
            />

            <div className={style.container}>
                {user["trips"]
                    ? user["trips"].map((trip) => (
                          <TripCard
                              key={trip["id"]}
                              name={trip["name"]}
                              src={trip["image"]}
                              tripId={trip["id"]}
                              openSpotModal={openSpotModal}
                          />
                      ))
                    : null}

                <div className={style.buttoncontainer}>
                    <div className={style.button}>
                        <Button
                            txt={language === "en" ? "Add a trip" : "創建行程"}
                            func={() => navigate(`/edit`)}
                        />
                    </div>
                </div>
            </div>
        </>
    );
};

export default MyTrips;
