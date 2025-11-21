import { useState, ChangeEvent } from "react";

type UseDateTimePickerResult = {
  value: string;
  epoch: number | null;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

export function useDateTimePicker(): UseDateTimePickerResult {
  const [value, setValue] = useState("");
  const [epoch, setEpoch] = useState<number | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);

    // HTML datetime-local is "YYYY-MM-DDTHH:mm"
    const local = e.target.value;
    if (local) {
      const dateObj = new Date(local); // Browser parses local datetime
      setEpoch(dateObj.getTime()); // Returns milliseconds since epoch
    } else {
      setEpoch(null);
    }
  };

  return { value, epoch, handleChange };
}
