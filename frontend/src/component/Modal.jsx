import React from 'react';
import { IoMdClose, IoIosArrowRoundBack } from "react-icons/io";

import style from "./Modal.module.css";

const Modal = ({ isOpen, onClose, title, content, showArrow=false, setIsBrowsingSpots=()=>{} }) => {
    if (!isOpen) return null;
    return (
        <div className={style.modaloverlay} onClick={onClose}>
            <div className={style.modal} onClick={(e) => e.stopPropagation()}>
            <div className={style.modalheader}>
                {showArrow && 
                    <button 
                        className={style.backarrowbt} 
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsBrowsingSpots(true);
                        }}>
                        <IoIosArrowRoundBack size={30}/>
                    </button>}
                <div>{title}</div>
                <button 
                    className={style.closebt} 
                    onClick={() => {
                        onClose();
                        setIsBrowsingSpots(true);
                }}>
                    <IoMdClose className={style.closebt} />
                </button>
            </div>
            <div className={style.modalcontent}>
                {content}
            </div>
            </div>
        </div>
    );
};

export default Modal;
