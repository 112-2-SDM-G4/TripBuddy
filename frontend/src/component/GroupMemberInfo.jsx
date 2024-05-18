import React, { useState, useEffect } from 'react';
import style from "./GroupMemberInfo.module.css";

const GroupMemberInfo = ({ trip_member_info, isButton, onSelect, selectedStatus = [] }) => {

    const [selected, setSelected] = useState(selectedStatus);

    useEffect(() => {
       
        setSelected(selectedStatus);
    }, [selectedStatus]); 
    

    const handleClick = (index, member) => {
        if (isButton) {
            const updatedSelected = [...selected];
            updatedSelected[index] = !updatedSelected[index];
            setSelected(updatedSelected);
            onSelect(member); 
        }
    };

    return (
        <div className={style.memberContainer}>
            {trip_member_info.map((member, index) => (
                <div key={index}
                    className={`${style.memberButton} ${selected[index] ? style.selected : ''}`}
                    style={{ cursor: isButton ? 'pointer' : 'default' }}
                    onClick={() => handleClick(index, member)}
                >
                    
                    <img src={`../../${member.user_avatar}.png`} alt={`${member.user_name}'s avatar`} className={style.avatar} />
                    
                    <div className={style.memberName}>{member.user_name}</div>
                </div>
            ))}
        </div>
    );
};

export default GroupMemberInfo;
