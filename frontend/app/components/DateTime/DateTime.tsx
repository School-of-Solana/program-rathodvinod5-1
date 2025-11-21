import React from "react";
import { useDateTimePicker } from "./useDateTimePicker";

const DateTimePickerComponent = () => {
  const { value, epoch, handleChange } = useDateTimePicker();

  return (
    <div>
      <label htmlFor="datetime">Select date and time:</label>
      <input
        type="datetime-local"
        id="datetime"
        value={value}
        onChange={handleChange}
      />
      <p>Selected epoch: {epoch ?? "None"}</p>
    </div>
  );
};

export default DateTimePickerComponent;
