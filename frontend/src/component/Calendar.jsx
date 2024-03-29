import React, { useState } from "react";

const Calendar = () => {
    // Initialize with the current year and month
    const [date, setDate] = useState(new Date());

    const changeMonth = (increment) => {
        // Adjust the month by the increment (+1 for next, -1 for previous)
        setDate(new Date(date.getFullYear(), date.getMonth() + increment, 1));
    };

    const changeYear = (increment) => {
        // Adjust the year by the increment (+1 for next, -1 for previous)
        setDate(new Date(date.getFullYear() + increment, date.getMonth(), 1));
    };

    // Getting the number of days in the current month
    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(date.getFullYear(), date.getMonth());

    // Generate an array [1, 2, ..., daysInMonth]
    const daysArray = [...Array(daysInMonth).keys()].map((day) => day + 1);

    return (
        <div>
            <header>
                <button onClick={() => changeYear(-1)}>Previous Year</button>
                <button onClick={() => changeMonth(-1)}>Previous Month</button>
                <span>{`${date.getFullYear()} / ${date.getMonth() + 1}`}</span>
                <button onClick={() => changeMonth(1)}>Next Month</button>
                <button onClick={() => changeYear(1)}>Next Year</button>
            </header>
            <table>
                {/* Render a table for the calendar */}
                <thead>
                    <tr>
                        <th>Sun</th>
                        <th>Mon</th>
                        <th>Tue</th>
                        <th>Wed</th>
                        <th>Thu</th>
                        <th>Fri</th>
                        <th>Sat</th>
                    </tr>
                </thead>
                <tbody>
                    {/* We'll need to write logic to correctly distribute the days in the table rows */}
                    {/* For simplicity, we're just listing the days here */}
                    {daysArray.map((day) => (
                        <td key={day}>{day}</td>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Calendar;
