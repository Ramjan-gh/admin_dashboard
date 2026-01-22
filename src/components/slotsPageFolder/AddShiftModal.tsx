import { useState } from "react";

// Types 
import { AddShiftModalProps } from "../types";

export function AddShiftModal({
  isOpen,
  onClose,
  onAdd,
  fieldId,
  loading,
}: AddShiftModalProps) {
  const [name, setName] = useState("New Shift");
  const [prices, setPrices] = useState({
    sunday: 500,
    monday: 500,
    tuesday: 500,
    wednesday: 500,
    thursday: 600,
    friday: 700,
    saturday: 700,
  });

  if (!isOpen) return null;

  const handleSubmit = () => {
    onAdd({
      p_name: name,
      p_field_id: fieldId,
      p_price_sunday: prices.sunday,
      p_price_monday: prices.monday,
      p_price_tuesday: prices.tuesday,
      p_price_wednesday: prices.wednesday,
      p_price_thursday: prices.thursday,
      p_price_friday: prices.friday,
      p_price_saturday: prices.saturday,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md space-y-4 shadow-2xl overflow-y-auto max-h-[90vh]">
        <h2 className="text-xl font-bold">Create New Shift</h2>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-gray-600">
            Shift Name
          </label>
          <input
            className="border p-2 rounded w-full"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {Object.keys(prices).map((day) => (
            <div key={day} className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase text-gray-400">
                {day}
              </label>
              <input
                type="number"
                className="border p-2 rounded w-full text-sm"
                value={(prices as any)[day]}
                onChange={(e) =>
                  setPrices({ ...prices, [day]: parseInt(e.target.value) })
                }
              />
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded font-semibold disabled:bg-blue-300"
          >
            {loading ? "Creating..." : "Create Shift"}
          </button>
        </div>
      </div>
    </div>
  );
}
