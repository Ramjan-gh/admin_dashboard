import { Trash2, Ban } from "lucide-react";
import { Slot, SlotStatus } from "../types";

export interface SlotCardProps {
  slot?: Slot; // Optional to handle skeleton loading gracefully
  isLoading?: boolean;
  onDelete?: (slotId: string) => void;
  onToggleMaintenance?: () => void;
  formatTime?: (time: string) => string;
}

export function SlotCard({
  slot,
  isLoading = false,
  onDelete,
  onToggleMaintenance,
  formatTime,
}: SlotCardProps) {
  
  // --- SHIMMER SKELETON LOADING STATE ---
  if (isLoading || !slot) {
    return (
      <div className="relative overflow-hidden p-3.5 rounded-xl border border-slate-100 bg-white shadow-sm flex flex-col justify-between h-[104px] w-full">
        {/* Shimmer Light Layer */}
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-slate-100/70 to-transparent" />
        
        {/* Top Header Row Mock */}
        <div className="flex items-center justify-between">
          <div className="h-4.5 w-24 bg-slate-100 rounded-md" />
          <div className="h-4.5 w-14 bg-slate-100 rounded-md" />
        </div>
        
        {/* Center Metadata Mock */}
        <div className="h-3.5 w-32 bg-slate-50 rounded-md my-1" />
        
        {/* Bottom Footer Row Mock */}
        <div className="flex justify-between items-center pt-2 border-t border-slate-50/60">
          <div className="h-4.5 w-10 bg-slate-100 rounded-md" />
          <div className="flex gap-1.5">
            <div className="h-7 w-7 bg-slate-100 rounded-lg" />
            <div className="h-7 w-7 bg-slate-100 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  // --- CORE SLOT CARD COMPONENT ---
  const isMaintenance = slot.status === "maintenance";
  const isBooked = slot.status === "booked";

  const bgColors = {
    available: "bg-emerald-50/40 border-emerald-100/80 hover:bg-emerald-50/70",
    booked: "bg-purple-50/40 border-purple-100/80 hover:bg-purple-50/70",
    maintenance: "bg-amber-50/40 border-amber-100/80 hover:bg-amber-50/70",
  };

  const badgeColors = {
    available: "bg-emerald-100 text-emerald-800 border-emerald-200/50",
    booked: "bg-purple-100 text-purple-800 border-purple-200/50",
    maintenance: "bg-amber-100 text-amber-800 border-amber-200/50",
  };

  return (
    <div
      className={`p-3.5 rounded-xl border flex flex-col justify-between h-[104px] w-full transition-all duration-200 shadow-sm ${
        bgColors[slot.status] || "bg-slate-50 border-slate-200"
      }`}
    >
      {/* Top Header Row: Time & Status Badge */}
      <div className="flex items-center justify-between gap-2 min-w-0">
        <div className="text-xs font-bold text-slate-700 tracking-tight whitespace-nowrap bg-white px-2 py-0.5 rounded-md border border-slate-200/60 shadow-sm">
          {formatTime?.(slot.start_time) || slot.start_time} - {formatTime?.(slot.end_time) || slot.end_time}
        </div>
        <span
          className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border whitespace-nowrap select-none ${badgeColors[slot.status]}`}
        >
          {slot.status}
        </span>
      </div>

      {/* Center Metadata Row: Dynamic Booking Info */}
      <div className="min-w-0 h-4 flex items-center">
        {isBooked ? (
          <div className="flex items-center gap-1.5 text-xs w-full">
            <p className="truncate font-semibold text-slate-800 max-w-[120px]">
              {slot.full_name}
            </p>
            <p className="font-mono text-[10px] text-slate-400 truncate">
              #{slot.booking_code}
            </p>
          </div>
        ) : isMaintenance ? (
          <p className="text-[11px] text-amber-600 font-medium italic">Temporarily Offline</p>
        ) : (
          <p className="text-[11px] text-emerald-600 font-medium">Open for booking</p>
        )}
      </div>

      {/* Bottom Footer Row: Price & Actions */}
      <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-slate-200/40">
        <p className="text-sm font-extrabold text-slate-900">৳{slot.price}</p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleMaintenance?.();
            }}
            title={isMaintenance ? "Remove from maintenance" : "Set to maintenance"}
            className={`p-1.5 border rounded-lg transition-all active:scale-95 ${
              isMaintenance
                ? "bg-amber-500 border-amber-600 text-white hover:bg-amber-600"
                : "bg-white border-slate-200 text-slate-400 hover:text-amber-600 hover:border-amber-200 hover:bg-amber-50"
            }`}
          >
            <Ban className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete?.(slot.slot_id);
            }}
            className="p-1.5 bg-white border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-lg active:scale-95 transition-all"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}