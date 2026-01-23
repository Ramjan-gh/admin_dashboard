import React, { useState } from "react";
import {
  Trash2,
  Calendar,
  Users,
  Ticket,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  Pencil,
  X,
} from "lucide-react";
import { toast, Toaster } from "sonner";
import { ApiResponse, DiscountSettingsProps } from "../types";

export function DiscountSettings({
  discounts,
  newDiscount,
  setNewDiscount,
  handleAddDiscount,
  handleDeleteDiscount,
  handleToggleDiscountStatus,
}: DiscountSettingsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Helper to load existing data into the top form for editing
  const handleEditClick = (discount: any) => {
    setNewDiscount({
      id: discount.id, // Now valid after type update
      p_code: discount.code,
      p_discount_type: discount.discount_type,
      p_discount_value: discount.discount_value.toString(),
      p_max_uses: discount.max_uses,
      p_valid_from: discount.valid_from.split("T")[0],
      p_valid_until: discount.valid_until.split("T")[0],
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
    toast.info(`Editing coupon: ${discount.code}`);
  };

  // Helper to clear form back to "Create" mode
  const resetForm = () => {
    setNewDiscount({
      p_code: "",
      p_discount_type: "percentage",
      p_discount_value: "",
      p_max_uses: null,
      p_valid_from: "",
      p_valid_until: "",
    });
  };

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
      const response = (await handleToggleDiscountStatus(
        id,
        currentStatus,
      )) as ApiResponse;

      if (response && response.success === false) {
        toast.error(response.message || "Operation failed", {
          description:
            "The discount code might have been removed or is invalid.",
        });
        return;
      }

      if (currentStatus) {
        toast.error(`${code} has been paused`, {
          icon: "⏸️",
          style: { borderRadius: "12px", fontWeight: "bold" },
        });
      } else {
        toast.success(`${code} is now LIVE!`, {
          icon: "🚀",
          style: { borderRadius: "12px", fontWeight: "bold" },
        });
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <Toaster position="top-right" richColors closeButton />

      {/* CREATE / UPDATE SECTION */}
      <div
        className={`bg-white p-6 rounded-2xl border shadow-sm ring-1 transition-all duration-500 ${newDiscount.id ? "border-purple-500 ring-purple-100" : "border-purple-100 ring-purple-50"}`}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div
              className={`p-2 rounded-lg transition-colors ${newDiscount.id ? "bg-purple-600" : "bg-gray-800"}`}
            >
              <Ticket className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
              {newDiscount.id ? "Update Discount" : "Create New Discount"}
            </h3>
          </div>

          {newDiscount.id && (
            <button
              onClick={resetForm}
              className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-all"
            >
              <X className="w-3 h-3" /> CANCEL EDIT
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-5 items-end">
          <div className="lg:col-span-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
              Code
            </label>
            <input
              type="text"
              placeholder="PROMO20"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:bg-white outline-none uppercase font-mono transition-all"
              value={newDiscount.p_code}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, p_code: e.target.value })
              }
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
              Type
            </label>
            <div className="flex p-1 bg-gray-100 rounded-xl h-[42px]">
              <button
                type="button"
                onClick={() =>
                  setNewDiscount({
                    ...newDiscount,
                    p_discount_type: "percentage",
                  })
                }
                className={`flex-1 rounded-lg text-xs font-bold transition-all ${newDiscount.p_discount_type === "percentage" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500"}`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewDiscount({ ...newDiscount, p_discount_type: "fixed" })
                }
                className={`flex-1 rounded-lg text-xs font-bold transition-all ${newDiscount.p_discount_type === "fixed" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500"}`}
              >
                Tk
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
              Value
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={newDiscount.p_discount_value}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  p_discount_value: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
              Max Uses
            </label>
            <input
              type="number"
              placeholder="∞"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none"
              value={newDiscount.p_max_uses || ""}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  p_max_uses: e.target.value ? parseInt(e.target.value) : null,
                })
              }
            />
          </div>

          <div className="lg:col-span-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
              Valid From
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              value={newDiscount.p_valid_from}
              onChange={(e) =>
                setNewDiscount({ ...newDiscount, p_valid_from: e.target.value })
              }
            />
          </div>

          <div className="lg:col-span-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
              Valid Until
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
              value={newDiscount.p_valid_until}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  p_valid_until: e.target.value,
                })
              }
            />
          </div>

          <button
            onClick={handleAddDiscount}
            className={`w-full h-[42px] rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-white ${
              newDiscount.id
                ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100"
                : "bg-gray-900 hover:bg-purple-600"
            }`}
          >
            {newDiscount.id ? "Update" : "Create"}
          </button>
        </div>
      </div>

      {/* LIST SECTION */}
      <div className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Coupon Library</h3>
            <p className="text-xs text-gray-400">
              Manage your active and scheduled promotions
            </p>
          </div>
          <span className="text-[10px] bg-purple-100 px-3 py-1 rounded-full font-bold text-purple-600">
            {discounts.length} CODES
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {discounts.length === 0 ? (
            <div className="lg:col-span-2 text-center py-16 bg-white rounded-3xl border-2 border-dashed border-gray-100">
              <Ticket className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 font-medium">
                No discount codes found.
              </p>
            </div>
          ) : (
            discounts.map((d) => {
              const isExpired = new Date(d.valid_until) < new Date();
              const isPaused = !d.is_active;

              return (
                <div
                  key={d.id}
                  className={`group relative flex rounded-3xl border transition-all duration-300 overflow-hidden shadow-sm hover:shadow-md ${
                    isExpired
                      ? "bg-red-50/30 border-red-100"
                      : isPaused
                        ? "bg-gray-50 border-gray-200 grayscale-[0.2]"
                        : "bg-white border-purple-100"
                  }`}
                >
                  <div
                    className={`w-32 flex flex-col items-center justify-center border-r-2 border-dashed px-4 transition-colors ${
                      isExpired
                        ? "bg-red-100/50 border-red-200"
                        : isPaused
                          ? "bg-gray-200/50 border-gray-300"
                          : "bg-purple-600 border-purple-700"
                    }`}
                  >
                    <span
                      className={`text-2xl font-black ${isPaused || isExpired ? "text-gray-600" : "text-white"}`}
                    >
                      {d.discount_value}
                      {d.discount_type === "percentage" ? "%" : ""}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-tighter text-center ${isPaused || isExpired ? "text-gray-500" : "text-purple-100"}`}
                    >
                      {d.discount_type === "percentage"
                        ? "Discount"
                        : "Taka Off"}
                    </span>
                  </div>

                  <div className="flex-1 p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`font-mono text-xl font-bold uppercase leading-none tracking-tight ${isPaused || isExpired ? "text-gray-500" : "text-gray-800"}`}
                          >
                            {d.code}
                          </span>
                          <button
                            onClick={() => copyToClipboard(d.code, d.id)}
                            className="text-gray-300 hover:text-purple-500 transition-colors"
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
                              {isExpired
                                ? "Expired"
                                : d.is_active
                                  ? "Live"
                                  : "Paused"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-1.5">
                        {/* UPDATE BUTTON */}
                        <button
                          onClick={() => handleEditClick(d)}
                          className="p-1.5 bg-white text-blue-500 border border-blue-100 rounded-xl hover:bg-blue-500 hover:text-white transition-all shadow-sm active:scale-95"
                          title="Edit Discount"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() =>
                            handleToggleWithToast(d.id, d.is_active, d.code)
                          }
                          className={`px-3 py-1.5 rounded-xl transition-all shadow-sm active:scale-95 border font-bold text-[10px] uppercase ${
                            d.is_active
                              ? "bg-amber-500 text-white border-amber-600 hover:bg-amber-600"
                              : "bg-green-600 text-white border-green-700 hover:bg-green-700"
                          }`}
                        >
                          {d.is_active ? "Pause" : "Go Live"}
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(d.id)}
                          className="p-1.5 bg-white text-red-500 border border-red-100 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${isPaused ? "bg-gray-200 text-gray-500" : "bg-purple-50 text-purple-400"}`}
                        >
                          <Users className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">
                            Usage
                          </p>
                          <p
                            className={`text-xs font-bold ${isPaused ? "text-gray-500" : "text-gray-700"}`}
                          >
                            {d.current_uses} / {d.max_uses || "∞"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div
                          className={`p-1.5 rounded-lg ${isPaused ? "bg-gray-200 text-gray-500" : "bg-purple-50 text-purple-400"}`}
                        >
                          <Calendar className="w-3 h-3" />
                        </div>
                        <div>
                          <p className="text-[9px] font-bold text-gray-400 uppercase leading-none">
                            Validity Range
                          </p>
                          <p
                            className={`text-[9px] font-bold whitespace-nowrap ${isExpired ? "text-red-500" : "text-gray-700"}`}
                          >
                            {new Date(d.valid_from).toLocaleDateString(
                              undefined,
                              { month: "short", day: "numeric" },
                            )}
                            <span className="mx-1 text-gray-300">—</span>
                            {new Date(d.valid_until).toLocaleDateString(
                              undefined,
                              {
                                month: "short",
                                day: "numeric",
                                year: "2-digit",
                              },
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
