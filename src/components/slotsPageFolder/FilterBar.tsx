import { Calendar as CalendarIcon, ChevronDown } from "lucide-react";

// Type 
import { FilterBarProps } from "../types";

export function FilterBar({
  selectedDate,
  setSelectedDate,
  fields,
  selectedField,
  fieldDropdownOpen,
  setFieldDropdownOpen,
  onSelectField,
}: FilterBarProps) {
  return (
    <div className="bg-white rounded-xl p-4 border relative">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-600">Select Date</label>
          <div className="flex items-center gap-2 mt-1">
            <CalendarIcon className="w-5 h-5 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border p-2 rounded-lg w-full"
            />
          </div>
        </div>

        <div className="relative">
          <label className="text-sm text-gray-600 mb-1 block">
            Select Field
          </label>
          <button
            onClick={() => setFieldDropdownOpen(!fieldDropdownOpen)}
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 bg-white w-full justify-between mt-1"
          >
            <span className="text-gray-700">
              {selectedField?.name || "Select Field"}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>

          {fieldDropdownOpen && (
            <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
              {fields.map((f) => (
                <li
                  key={f.id}
                  onClick={() => onSelectField(f.id)}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  {f.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
