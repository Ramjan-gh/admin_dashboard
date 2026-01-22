import { Trash2, Ban } from "lucide-react";

// Type 
import { SlotCardProps } from "../types";

export function SlotCard({
  slot,
  onDelete,
  onToggleMaintenance,
  formatTime,
  getStatusColor,
}: SlotCardProps) {
  const isMaintenance = slot.status === "maintenance";

  return (
    <div
      className={`p-4 rounded-lg border-2 transition relative ${getStatusColor(
        slot.status
      )} flex flex-col justify-between h-32`}
    >
      <div className="flex justify-between items-start mb-1">
        <div className="text-sm font-semibold">
          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
        </div>
        <span
          className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
            slot.status === "available"
              ? "bg-green-100 text-green-700 border border-green-200"
              : slot.status === "booked"
              ? "bg-purple-100 text-purple-700 border border-purple-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {slot.status}
        </span>
      </div>

      {slot.status === "booked" && (
        <div className="text-xs mt-1">
          <p className="truncate font-medium">{slot.full_name}</p>
          <p className="opacity-70">{slot.booking_code}</p>
        </div>
      )}

      <div className="flex justify-between items-end mt-auto">
        <p className="text-xs font-bold">৳{slot.price}</p>

        <div className="flex gap-2">
          {/* Maintenance Toggle Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleMaintenance();
            }}
            title={
              isMaintenance ? "Remove from maintenance" : "Set to maintenance"
            }
            className={`p-1.5 border rounded transition-colors ${
              isMaintenance
                ? "bg-orange-500 border-orange-600 text-white hover:bg-orange-600"
                : "bg-white border-gray-200 text-gray-400 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50"
            }`}
          >
            <Ban className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(slot.slot_id);
            }}
            className="p-1.5 bg-white border border-red-200 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
