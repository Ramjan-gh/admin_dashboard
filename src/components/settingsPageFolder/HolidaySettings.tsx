import React, { ChangeEvent } from "react";
import { Plus, Trash2 } from "lucide-react";
// Types 
import { HolidaySettingsProps } from "../types";



export function HolidaySettings({
  holidays,
  newHoliday,
  setNewHoliday,
  handleAddSchedule,
  handleDeleteSchedule,
}: HolidaySettingsProps) {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Add New Holiday Form */}
      <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Date
          </label>
          <input
            type="date"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={newHoliday.p_date}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewHoliday({ ...newHoliday, p_date: e.target.value })
            }
          />
        </div>
        <div>
          <label className="text-xs font-bold text-gray-500 uppercase">
            Note
          </label>
          <input
            type="text"
            placeholder="e.g. Eid-ul-Fitr"
            className="w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
            value={newHoliday.p_notes}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewHoliday({ ...newHoliday, p_notes: e.target.value })
            }
          />
        </div>
        <div className="flex items-center h-10">
          <input
            type="checkbox"
            id="isOpen"
            className="w-4 h-4 accent-purple-600 cursor-pointer"
            checked={newHoliday.p_is_open}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setNewHoliday({
                ...newHoliday,
                p_is_open: e.target.checked,
              })
            }
          />
          <label
            htmlFor="isOpen"
            className="ml-2 text-sm text-gray-700 cursor-pointer"
          >
            Open?
          </label>
        </div>
        <button
          onClick={handleAddSchedule}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors font-medium"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>

      {/* Holiday List */}
      <div className="divide-y border rounded-xl overflow-hidden bg-white">
        {holidays.length === 0 ? (
          <div className="p-8 text-center text-gray-400 italic">
            No holidays or special schedules added yet.
          </div>
        ) : (
          holidays.map((h) => (
            <div
              key={h.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
            >
              <div>
                <p className="font-semibold text-gray-900">
                  {h.notes || "No Title"}
                </p>
                <p className="text-sm text-gray-500">
                  {h.date} •{" "}
                  <span
                    className={
                      h.is_open ? "text-green-600" : "text-red-600 font-medium"
                    }
                  >
                    {h.is_open ? "Open" : "Closed"}
                  </span>
                </p>
              </div>
              <button
                onClick={() => handleDeleteSchedule(h.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                title="Delete Schedule"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
