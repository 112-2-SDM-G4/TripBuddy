import React, { useState } from "react";
import style from "./Calendar.module.css";
import { useLanguage } from "../hooks/useLanguage";

const Calendar = ({
    selectedStart,
    selectedEnd,
    setSelectedStart,
    setSelectedEnd,
}) => {
    const [date, setDate] = useState(new Date());
    const { words } = useLanguage();

    const changeMonth = (increment) => {
        setDate(new Date(date.getFullYear(), date.getMonth() + increment, 1));
    };
    const onDateClick = (day) => {
        const newDate = new Date(date.getFullYear(), date.getMonth(), day);
        if (
            !selectedStart ||
            selectedStart > newDate ||
            (selectedStart && selectedEnd)
        ) {
            setSelectedStart(newDate);
            if (selectedStart && selectedEnd) {
                setSelectedEnd(undefined);
            }
        } else if (!selectedEnd || selectedEnd < newDate) {
            setSelectedEnd(newDate);
        }
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };
    const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());
    const firstDayOfMonth = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
    ).getDay();

    const daysArray = Array(firstDayOfMonth)
        .fill(null)
        .concat(
            Array(daysInMonth)
                .fill(null)
                .map((_, index) => index + 1)
        );
    const weeks = [];
    while (daysArray.length) weeks.push(daysArray.splice(0, 7));

    const isDateInRange = (day) => {
        const currentDate = new Date(date.getFullYear(), date.getMonth(), day);
        if (
            selectedStart &&
            selectedEnd &&
            currentDate.getTime() > selectedStart.getTime() &&
            currentDate.getTime() < selectedEnd.getTime()
        ) {
            return "in";
        }
        if (
            selectedEnd &&
            selectedStart &&
            currentDate.getTime() === selectedStart.getTime()
        ) {
            return "selectstart";
        }
        if (
            selectedStart &&
            selectedEnd &&
            currentDate.getTime() === selectedEnd.getTime()
        ) {
            return "selectend";
        }
        if (
            (selectedStart &&
                currentDate.getTime() === selectedStart.getTime()) ||
            (selectedEnd && currentDate.getTime() === selectedEnd.getTime())
        ) {
            return "select";
        }
        return "no";
    };

    return (
        <div className={style.calendar}>
            <header className={style.header}>
                <div
                    className={`${style.control} ${style.clickable}`}
                    onClick={() => changeMonth(-1)}
                >
                    {"<"}
                </div>
                <span className={style.title}>{`${date.getFullYear()} / ${
                    date.getMonth() + 1
                }`}</span>
                <div
                    className={`${style.control} ${style.clickable}`}
                    onClick={() => changeMonth(1)}
                >
                    {">"}
                </div>
            </header>
            <table className={style.table}>
                <thead>
                    <tr>
                        <th className={style.block}>{words["Sun"]}</th>
                        <th className={style.block}>{words["Mon"]}</th>
                        <th className={style.block}>{words["Tue"]}</th>
                        <th className={style.block}>{words["Wed"]}</th>
                        <th className={style.block}>{words["Thu"]}</th>
                        <th className={style.block}>{words["Fri"]}</th>
                        <th className={style.block}>{words["Sat"]}</th>
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week, weekIndex) => (
                        <tr key={`week-${weekIndex}`}>
                            {week.map((day, dayIndex) => {
                                let classes = `${style.block} ${style.clickable}`;
                                if (day) {
                                    const isInRange = isDateInRange(day);
                                    if (isInRange === "selectstart") {
                                        classes += ` ${style.selected} ${style.selectedstart}`;
                                    }
                                    if (isInRange === "selectend") {
                                        classes += ` ${style.selected} ${style.selectedend}`;
                                    }
                                    if (isInRange === "select") {
                                        classes += ` ${style.selected}`;
                                    }
                                    if (isInRange === "in") {
                                        classes += ` ${style.between}`;
                                    }
                                }
                                return (
                                    <td
                                        className={classes}
                                        key={`day-${weekIndex}-${dayIndex}`}
                                        onClick={() => day && onDateClick(day)}
                                    >
                                        <div>
                                            <span>{day}</span>
                                        </div>
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;
