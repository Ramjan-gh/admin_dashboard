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
      className={`group relative flex rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${isExpired ? "bg-red-50/30 border-red-100" : isPaused ? "bg-gray-50 border-gray-200" : "bg-white border-purple-100"}`}
    >
      {/* Left Banner */}
      <div
        className={`w-32 flex flex-col items-center justify-center border-r-2 border-dashed px-4 ${isExpired ? "bg-red-100/50 border-red-200" : isPaused ? "bg-gray-200/50 border-gray-300" : "bg-purple-600 border-purple-700"}`}
      >
        <span
          className={`text-2xl font-black ${isPaused || isExpired ? "text-gray-600" : "text-white"}`}
        >
          {d.discount_value}
          {d.discount_type === "percentage" ? "%" : ""}
        </span>
        <span
          className={`text-[10px] font-bold uppercase ${isPaused || isExpired ? "text-gray-500" : "text-purple-100"}`}
        >
          {d.discount_type === "percentage" ? "Discount" : "Taka Off"}
        </span>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-5">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-xl font-bold uppercase ${isPaused || isExpired ? "text-gray-500" : "text-gray-800"}`}
            >
              {d.code}
            </span>
            <button
              onClick={() => copyToClipboard(d.code, d.id)}
              className="text-gray-300 hover:text-purple-500"
            >
              {copiedId === d.id ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3" />
              )}
            </button>
            <div
              className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md ${isExpired ? "bg-red-100" : d.is_active ? "bg-green-100" : "bg-gray-200"}`}
            >
              {d.is_active && !isExpired ? (
                <CheckCircle2 className="w-3 h-3 text-green-600" />
              ) : (
                <AlertCircle
                  className={`w-3 h-3 ${isExpired ? "text-red-600" : "text-gray-600"}`}
                />
              )}
              <span
                className={`text-[8px] font-black uppercase ${isExpired ? "text-red-700" : d.is_active ? "text-green-700" : "text-gray-700"}`}
              >
                {isExpired ? "Expired" : d.is_active ? "Live" : "Paused"}
              </span>
            </div>
          </div>

          <div className="flex gap-1.5">
            <button
              onClick={() => onEdit(d)}
              className="p-1.5 bg-white text-blue-500 border border-blue-100 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleToggleWithToast(d.id, d.is_active, d.code)}
              className={`px-3 py-1.5 rounded-xl transition-all border font-bold text-[10px] uppercase ${d.is_active ? "bg-amber-500 text-white" : "bg-green-600 text-white"}`}
            >
              {d.is_active ? "Pause" : "Go Live"}
            </button>
            <button
              onClick={() => onDelete(d.id)}
              className="p-1.5 bg-white text-red-500 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-400">
              <Users className="w-3 h-3" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">
                Usage
              </p>
              <p className="text-xs font-bold text-gray-700">
                {d.current_uses} / {d.max_uses || "∞"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-400">
              <Calendar className="w-3 h-3" />
            </div>
            <div>
              <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">
                Validity
              </p>
              <p className="text-[9px] font-bold text-gray-700">
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
