// Calendar.jsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Button } from "./Button";
import { format } from "date-fns";

export const Calendar = ({ 
  selectedDate, 
  onDateChange, 
  label = "Select a date",
  minDate = null,
  disablePast = true
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Safely handle undefined/null dates
  const displayDate = selectedDate || new Date();

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="datepicker" className="text-sm font-medium">
        {label}
      </label>
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full justify-start text-left font-normal"
      >
        {format(displayDate, "PPP")}
      </Button>
      {isOpen && (
        <DatePicker
          id="datepicker"
          selected={selectedDate}
          onChange={(date) => {
            onDateChange(date);
            setIsOpen(false);
          }}
          className="border rounded px-3 py-2 mt-1"
          dateFormat="yyyy-MM-dd"
          minDate={disablePast ? minDate : null}
          inline
          onClickOutside={() => setIsOpen(false)}
          popperPlacement="bottom-start"
        />
      )}
    </div>
  );
};