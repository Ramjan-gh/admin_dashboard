import React from "react";
import {
  Trash2,
  Calendar,
  Users,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Pencil,
} from "lucide-react";
import { toast } from "sonner";
import { ApiResponse } from "../../types";

export function DiscountCard({
  discount: d,
  copiedId,
  setCopiedId,
  onEdit,
  onDelete,
  onToggle,
}: any) {
  const isExpired = new Date(d.valid_until) < new Date();
  const isPaused = !d.is_active;

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    toast.success("Code copied to clipboard!");
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleWithToast = async (
    id: string,
    currentStatus: boolean,
    code: string,
  ) => {
    try {
      const response = (await onToggle(id, currentStatus)) as ApiResponse;
      if (response?.success === false) {
        toast.error(response.message || "Operation failed");
        return;
      }
      currentStatus
        ? toast.error(`${code} paused`, { icon: "⏸️" })
        : toast.success(`${code} is LIVE!`, { icon: "🚀" });
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div
      className={`group relative flex flex-col sm:flex-row rounded-2xl sm:rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
        isExpired
          ? "bg-red-50/30 border-red-100"
          : isPaused
          ? "bg-gray-50 border-gray-200"
          : "bg-white border-blue-100"
      }`}
    >
      {/* Dynamic Ticket Banner (Top on Mobile, Left on Desktop) */}
      <div
        className={`w-full sm:w-28 md:w-32 flex sm:flex-col items-center justify-between sm:justify-center border-b-2 sm:border-b-0 sm:border-r-2 border-dashed p-3 sm:px-4 ${
          isExpired
            ? "bg-red-100/40 border-red-200"
            : isPaused
            ? "bg-gray-200/40 border-gray-300"
            : "bg-blue-600 border-blue-700"
        }`}
      >
        <div className="flex flex-col sm:items-center">
          <span
            className={`text-xl sm:text-2xl font-black leading-tight ${
              isPaused || isExpired ? "text-gray-700" : "text-white"
            }`}
          >
            {d.discount_value}
            {d.discount_type === "percentage" ? "%" : ""}
          </span>
          <span
            className={`text-[9px] sm:text-[10px] font-black uppercase tracking-wider ${
              isPaused || isExpired ? "text-gray-500" : "text-blue-100"
            }`}
          >
            {d.discount_type === "percentage" ? "Discount" : "Taka Off"}
          </span>
        </div>
        
        {/* Subtle separator mark for visual flair on mobile views */}
        <span className="sm:hidden text-[10px] font-bold px-2 py-0.5 rounded bg-black/5 text-gray-500 border border-black/5 uppercase">
          Value
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start sm:gap-1.5">
          {/* Header Identity Row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`font-mono text-lg sm:text-xl font-bold uppercase tracking-wide ${
                isPaused || isExpired ? "text-gray-500" : "text-gray-800"
              }`}
            >
              {d.code}
            </span>
            <button
              onClick={() => copyToClipboard(d.code, d.id)}
              className="text-gray-400 hover:text-blue-500 p-1 rounded transition-colors active:scale-95"
              title="Copy code"
            >
              {copiedId === d.id ? (
                <Check className="w-3.5 h-3.5 text-green-500" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
            
            {/* Live / Paused Status pill */}
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${
                isExpired ? "bg-red-100" : d.is_active ? "bg-green-100" : "bg-gray-200"
              }`}
            >
              {d.is_active && !isExpired ? (
                <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
              ) : (
                <AlertCircle
                  className={`w-2.5 h-2.5 ${isExpired ? "text-red-600" : "text-gray-600"}`}
                />
              )}
              <span
                className={`text-[8px] font-black uppercase tracking-wide ${
                  isExpired ? "text-red-700" : d.is_active ? "text-green-700" : "text-gray-700"
                }`}
              >
                {isExpired ? "Expired" : d.is_active ? "Live" : "Paused"}
              </span>
            </div>
          </div>

          {/* Action Row Container */}
          <div className="flex items-center gap-1.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => onEdit(d)}
              className="p-2 sm:p-1.5 bg-white text-blue-500 border border-blue-100 rounded-lg sm:rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm flex-1 sm:flex-initial flex justify-center"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleToggleWithToast(d.id, d.is_active, d.code)}
              className={`px-3 py-2 sm:py-1.5 rounded-lg sm:rounded-xl transition-all border font-black text-[10px] uppercase tracking-wider flex-2 sm:flex-initial text-center ${
                d.is_active ? "bg-blue-500 text-white border-blue-600" : "bg-green-600 text-white border-green-700"
              }`}
            >
              {d.is_active ? "Pause" : "Go Live"}
            </button>
            <button
              onClick={() => onDelete(d.id)}
              className="p-2 sm:p-1.5 bg-white text-red-500 border border-red-100 rounded-lg sm:rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm flex-1 sm:flex-initial flex justify-center"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Footer Metrics Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 pt-1 border-t border-gray-100/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50/80 text-blue-500 shrink-0">
              <Users className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                Usage
              </p>
              <p className="text-xs font-bold text-gray-700 truncate">
                {d.current_uses} / {d.max_uses || "∞"}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-50/80 text-blue-500 shrink-0">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-0.5">
                Validity
              </p>
              <p className="text-[10px] font-bold text-gray-700 truncate">
                {new Date(d.valid_from).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })}{" "}
                —{" "}
                {new Date(d.valid_until).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "2-digit",
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}