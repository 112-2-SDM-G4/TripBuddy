import React, { useState } from 'react';
import style from "./GroupMemberInfo.module.css";

const GroupMemberInfo = ({ trip_member_info, description, isButton, onSelect, selectedStatus = [] }) => {

    const [selected, setSelected] = useState(selectedStatus.length ? selectedStatus : new Array(trip_member_info.length).fill(false));


    const handleClick = (index, member) => {
        if (isButton) {
            // 更新选中状态
            const updatedSelected = [...selected];
            updatedSelected[index] = !updatedSelected[index];
            setSelected(updatedSelected);
            onSelect(member); // 如果需要，这里可以传递更多信息
        }
    };

    return (
        <div className={style.memberContainer}>
            <p>{description}</p>
            {trip_member_info.map((member, index) => (
                <div key={index}
                    className={`${style.memberButton} ${selected[index] ? style.selected : ''}`}
                    style={{ cursor: isButton ? 'pointer' : 'default' }}
                    onClick={() => handleClick(index, member)}
                >
                    
                    <img src={`../../${member.user_avatar}.png`} alt={`${member.user_name}'s avatar`} style={{ width: '50px', height: '50px' }} />
                    
                    <div className={style.memberName}>{member.user_name}</div>
                </div>
            ))}
        </div>
    );
};

export default GroupMemberInfo;
