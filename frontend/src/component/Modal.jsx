import React from "react";
import { IoMdClose } from "react-icons/io";

import style from "./Modal.module.css";

const Modal = ({ isOpen, onClose, children, showArrow = false }) => {
    return (
        <div className={style.modaloverlay} onClick={onClose}>
            <div className={style.modal} onClick={(e) => e.stopPropagation()}>
                <button
                    className={style.closebt}
                    onClick={() => {
                        onClose();
                    }}
                >
                    <IoMdClose className={style.closebt} />
                </button>
                <div className={style.modalcontent}>{children}</div>
            </div>
        </div>
    );
};

export default Modal;
