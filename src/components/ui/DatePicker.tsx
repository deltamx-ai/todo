import { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format, parse } from "date-fns";

interface DatePickerProps {
  label?: string;
  value?: string;
  onChange: (date: string | null) => void;
  placeholder?: string;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Select date",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedDate = value ? parse(value, "yyyy-MM-dd", new Date()) : undefined;

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange(format(date, "yyyy-MM-dd"));
    } else {
      onChange(null);
    }
    setIsOpen(false);
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          type="text"
          readOnly
          value={value ? format(parse(value, "yyyy-MM-dd", new Date()), "MMM d, yyyy") : ""}
          placeholder={placeholder}
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
        />
        {isOpen && (
          <div className="absolute top-full mt-1 left-0 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-w-[calc(100vw-2rem)] overflow-auto">
            <DayPicker
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              disabled={{ before: new Date() }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
