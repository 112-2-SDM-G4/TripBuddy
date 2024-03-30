import React, { useState } from "react";
import stlye from "./Calendar.module.css";

const Calendar = ({
    selectedStart,
    selectedEnd,
    setSelectedStart,
    setSelectedEnd,
}) => {
    const [date, setDate] = useState(new Date());

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
        <div className={stlye.calendar}>
            <header className={stlye.header}>
                <div
                    className={`${stlye.control} ${stlye.clickable}`}
                    onClick={() => changeMonth(-1)}
                >
                    {"<"}
                </div>
                <span className={stlye.title}>{`${date.getFullYear()} / ${
                    date.getMonth() + 1
                }`}</span>
                <div
                    className={`${stlye.control} ${stlye.clickable}`}
                    onClick={() => changeMonth(1)}
                >
                    {">"}
                </div>
            </header>
            <table className={stlye.table}>
                <thead>
                    <tr>
                        <th className={stlye.block}>Sun</th>
                        <th className={stlye.block}>Mon</th>
                        <th className={stlye.block}>Tue</th>
                        <th className={stlye.block}>Wed</th>
                        <th className={stlye.block}>Thu</th>
                        <th className={stlye.block}>Fri</th>
                        <th className={stlye.block}>Sat</th>
                    </tr>
                </thead>
                <tbody>
                    {weeks.map((week, weekIndex) => (
                        <tr key={`week-${weekIndex}`}>
                            {week.map((day, dayIndex) => {
                                let classes = `${stlye.block} ${stlye.clickable}`;
                                if (day) {
                                    const isInRange = isDateInRange(day);
                                    if (isInRange === "selectstart") {
                                        classes += ` ${stlye.selected} ${stlye.selectedstart}`;
                                    }
                                    if (isInRange === "selectend") {
                                        classes += ` ${stlye.selected} ${stlye.selectedend}`;
                                    }
                                    if (isInRange === "select") {
                                        classes += ` ${stlye.selected}`;
                                    }
                                    if (isInRange === "in") {
                                        classes += ` ${stlye.between}`;
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
