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
  const isBooked = slot.status === "booked";

  return (
    <div
      className={`p-4 rounded-lg border-2 transition relative ${getStatusColor(
        slot.status
      )} flex flex-col justify-between h-36 md:h-32 w-full gap-2`}
    >
      {/* Top Section: Structured to handle top-right floating buttons on mobile natively */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 pr-20 sm:pr-0">
        <div className="text-sm font-semibold tracking-tight whitespace-nowrap">
          {formatTime(slot.start_time)} - {formatTime(slot.end_time)}
        </div>
        <span
          className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full whitespace-nowrap ${
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

      {/* Middle Section: Clean height distribution for booking details */}
      <div className="flex-1 flex flex-col justify-center min-h-[1.5rem]">
        {isBooked && (
          <div className="text-xs">
            <p className="truncate font-medium text-gray-900 max-w-[160px] sm:max-w-full">
              {slot.full_name}
            </p>
            <p className="opacity-70 font-mono tracking-wider text-[10px] sm:text-xs">{slot.booking_code}</p>
          </div>
        )}
      </div>

      {/* Bottom Section: Clean Price display (Buttons fly up on mobile) */}
      <div className="flex justify-between items-center mt-auto pt-1 border-t border-black/5">
        <p className="text-sm font-black text-gray-900">৳{slot.price}</p>

        {/* Action Controls Container */}
        <div className="absolute top-3 right-3 flex gap-1.5 sm:relative sm:top-0 sm:right-0 sm:flex sm:gap-2">
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
            className={`p-1.5 sm:p-2 border rounded-md transition-all active:scale-95 shadow-sm sm:shadow-none ${
              isMaintenance
                ? "bg-orange-500 border-orange-600 text-white hover:bg-orange-600"
                : "bg-white/90 border-gray-200 text-gray-500 hover:text-orange-500 hover:border-orange-200 hover:bg-orange-50"
            }`}
          >
            <Ban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          {/* Delete Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete(slot.slot_id);
            }}
            className="p-1.5 sm:p-2 bg-white/90 border border-red-200 text-red-500 rounded-md hover:bg-red-500 hover:text-white active:scale-95 transition-all shadow-sm sm:shadow-none"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}