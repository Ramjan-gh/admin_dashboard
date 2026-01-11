import { Trash2 } from "lucide-react";

interface SlotCardProps {
  slot: any;
  onDelete: (id: string) => void; // This must receive the slot_id
  formatTime: (t: string) => string;
  getStatusColor: (status: string) => string;
}

export function SlotCard({
  slot,
  onDelete,
  formatTime,
  getStatusColor,
}: SlotCardProps) {
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
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log("Delete button clicked for ID:", slot.slot_id);
            onDelete(slot.slot_id); // Ensure this is slot.slot_id
          }}
          className="p-1.5 bg-white border border-red-200 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
        >
          <Trash2 className="w-4 h-4 z-10" />
        </button>
      </div>
    </div>
  );
}
