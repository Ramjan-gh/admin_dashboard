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
} from "lucide-react";
import { DiscountSettingsProps } from "../types";

export function DiscountSettings({
  discounts,
  newDiscount,
  setNewDiscount,
  handleAddDiscount,
  handleDeleteDiscount,
  handleToggleDiscountStatus,
}: DiscountSettingsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      {/* CREATE SECTION - Minimal & Clean */}
      <div className="bg-white p-6 rounded-2xl border border-purple-100 shadow-sm ring-1 ring-purple-50">
        <div className="flex items-center gap-2 mb-6">
          <div className="p-2 bg-purple-600 rounded-lg">
            <Ticket className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">
            Create New Discount
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-5 items-end">
          {/* Code Input */}
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

          {/* Type Selector */}
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
                className={`flex-1 rounded-lg text-xs font-bold transition-all ${newDiscount.p_discount_type === "percentage" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewDiscount({ ...newDiscount, p_discount_type: "fixed" })
                }
                className={`flex-1 rounded-lg text-xs font-bold transition-all ${newDiscount.p_discount_type === "fixed" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
              >
                Tk
              </button>
            </div>
          </div>

          {/* Value */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
              Value
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
              value={newDiscount.p_discount_value}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  p_discount_value: e.target.value,
                })
              }
            />
          </div>

          {/* Max Uses */}
          <div>
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
              Max Uses
            </label>
            <input
              type="number"
              placeholder="∞"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white transition-all"
              value={newDiscount.p_max_uses || ""}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  p_max_uses: e.target.value ? parseInt(e.target.value) : null,
                })
              }
            />
          </div>

          {/* Dates */}
          <div className="lg:col-span-1">
            <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
              Valid From
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
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
              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
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
            className="w-full bg-gray-900 text-white h-[42px] rounded-xl font-bold hover:bg-purple-600 transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Create
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

              return (
                <div
                  key={d.id}
                  className="group relative flex bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-purple-200 transition-all duration-300 overflow-hidden"
                >
                  {/* Left Side: The "Value" Section */}
                  <div
                    className={`w-32 flex flex-col items-center justify-center border-r-2 border-dashed border-gray-100 px-4 transition-colors ${d.is_active ? "bg-purple-50/50" : "bg-gray-50"}`}
                  >
                    <span
                      className={`text-2xl font-black ${isExpired ? "text-gray-400" : "text-purple-600"}`}
                    >
                      {d.discount_value}
                      {d.discount_type === "percentage" ? "%" : ""}
                    </span>
                    <span className="text-[10px] font-bold text-purple-400 uppercase tracking-tighter text-center">
                      {d.discount_type === "percentage"
                        ? "Discount"
                        : "Taka Off"}
                    </span>

                    {/* Decorative Notch Circles */}
                    <div className="absolute -top-3 -right-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />
                    <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-gray-50 rounded-full border border-gray-100 shadow-inner" />
                  </div>

                  {/* Right Side: Info Section */}
                  <div className="flex-1 p-5">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xl font-bold text-gray-800 uppercase leading-none tracking-tight">
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
                          {d.is_active && !isExpired ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle
                              className={`w-4 h-4 ${isExpired ? "text-red-400" : "text-gray-300"}`}
                            />
                          )}
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-widest">
                          Created: {new Date(d.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() =>
                            handleToggleDiscountStatus(d.id, d.is_active)
                          }
                          className={`p-2 rounded-xl transition-all ${d.is_active ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"}`}
                        >
                          <span className="text-[10px] font-black uppercase px-1">
                            {d.is_active ? "Pause" : "Live"}
                          </span>
                        </button>
                        <button
                          onClick={() => handleDeleteDiscount(d.id)}
                          className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Stats & Metadata */}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400">
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
                        <div className="p-1.5 bg-gray-50 rounded-lg text-gray-400">
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

                    {/* Progress Bar for Usage */}
                    {d.max_uses && (
                      <div className="mt-4 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ${d.current_uses >= d.max_uses ? "bg-red-500" : "bg-purple-500"}`}
                          style={{
                            width: `${Math.min((d.current_uses / d.max_uses) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Visual Status "Tab" */}
                  {(!d.is_active || isExpired) && (
                    <div
                      className={`absolute top-0 right-0 px-3 py-1 text-[8px] font-black uppercase rounded-bl-xl ${isExpired ? "bg-red-100 text-red-500" : "bg-gray-100 text-gray-400"}`}
                    >
                      {isExpired ? "Expired" : "Paused"}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
