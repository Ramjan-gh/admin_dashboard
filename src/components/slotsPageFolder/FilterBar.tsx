import { Calendar as CalendarIcon } from "lucide-react";
import { FieldSelectorGrid } from "../slotOverviewPageFolder/FieldSelectorGrid";
import { FilterBarProps } from "../types";

export function FilterBar({
  selectedDate,
  setSelectedDate,
  fields,
  selectedField,
  onSelectField,
  // These are destructured here to prevent unused variable errors in case 
  // they are still being passed down by the parent component.
  fieldDropdownOpen,
  setFieldDropdownOpen,
}: FilterBarProps) {

  return (
    <div className="bg-white rounded-xl p-4 border">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        
        {/* 1. Date Picker (Takes up 1 column on medium screens) */}
        <div className="md:col-span-1">
          <label className="text-sm font-semibold text-gray-600 block mb-2">
            Select Date
          </label>
          <div className="relative flex items-center w-full">
            <CalendarIcon className="w-5 h-5 text-gray-400 absolute left-3 pointer-events-none" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-250 pl-10 pr-3 py-2.5 rounded-lg w-full text-sm font-medium text-gray-700 bg-white hover:border-gray-300 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* 2. Field Selector Grid (Takes up remaining 2 columns, permanently visible) */}
        <div className="md:col-span-2">
          <label className="text-sm font-semibold text-gray-600 block mb-2">
            Select Field
          </label>
          <FieldSelectorGrid
            fields={fields}
            selectedFieldId={selectedField?.id || ""}
            onSelect={onSelectField}
          />
        </div>

      </div>
    </div>
  );
}