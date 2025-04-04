// CalendarPicker.jsx
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const Calendar = ({ selectedDate, onDateChange }) => {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="datepicker" className="text-sm font-medium">
        Select a date
      </label>
      <DatePicker
        id="datepicker"
        selected={selectedDate}
        onChange={onDateChange}
        className="border rounded px-3 py-2"
        dateFormat="yyyy-MM-dd"
        autoFocus
      />
    </div>
  );
};

export default Calendar;
