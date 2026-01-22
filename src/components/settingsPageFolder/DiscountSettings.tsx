import React from "react";
import { Trash2 } from "lucide-react";

// Types 
import { DiscountSettingsProps } from "../types";



export function DiscountSettings({
  discounts,
  newDiscount,
  setNewDiscount,
  handleAddDiscount,
  handleDeleteDiscount,
  handleToggleDiscountStatus,
}: DiscountSettingsProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-300">
      {/* TOP SECTION: Create Discount Form */}
      <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
        <h3 className="text-sm font-bold text-purple-800 mb-4 uppercase tracking-wider">
          Create New Discount
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
          <div>
            <label className="text-[10px] font-bold text-purple-700 uppercase">
              Code
            </label>
            <input
              type="text"
              placeholder="PROMO20"
              className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none uppercase font-mono"
              value={newDiscount.p_code}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  p_code: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-700 uppercase">
              Type
            </label>
            <div className="flex mt-1 p-1 bg-purple-100 rounded-lg h-[42px]">
              <button
                type="button"
                onClick={() =>
                  setNewDiscount({
                    ...newDiscount,
                    p_discount_type: "percentage",
                  })
                }
                className={`flex-1 px-2 rounded-md text-xs font-bold transition-all ${
                  newDiscount.p_discount_type === "percentage"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-purple-500"
                }`}
              >
                %
              </button>
              <button
                type="button"
                onClick={() =>
                  setNewDiscount({
                    ...newDiscount,
                    p_discount_type: "fixed",
                  })
                }
                className={`flex-1 px-2 rounded-md text-xs font-bold transition-all ${
                  newDiscount.p_discount_type === "fixed"
                    ? "bg-white text-purple-700 shadow-sm"
                    : "text-purple-500"
                }`}
              >
                Tk
              </button>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-700 uppercase">
              Value
            </label>
            <input
              type="number"
              className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
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
            <label className="text-[10px] font-bold text-purple-700 uppercase">
              Valid From
            </label>
            <input
              type="date"
              className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg text-sm"
              value={newDiscount.p_valid_from}
              onChange={(e) =>
                setNewDiscount({
                  ...newDiscount,
                  p_valid_from: e.target.value,
                })
              }
            />
          </div>

          <div>
            <label className="text-[10px] font-bold text-purple-700 uppercase">
              Valid Until
            </label>
            <input
              type="date"
              className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg text-sm"
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
            className="bg-purple-600 text-white h-[42px] rounded-lg font-bold hover:bg-purple-700 transition-all shadow-md shadow-purple-200"
          >
            Create
          </button>
        </div>
      </div>

      {/* BOTTOM SECTION: Scrollable List */}
      <div className="space-y-2">
        <div className="flex justify-between items-center px-2">
          <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
            Active Coupons
          </h3>
          <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-bold text-gray-400">
            {discounts.length} CODES TOTAL
          </span>
        </div>

        {/* Scrollable Container */}
        <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {discounts.length === 0 ? (
              <div className="lg:col-span-3 text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed">
                <p className="text-gray-400 font-medium">
                  No discount codes available.
                </p>
              </div>
            ) : (
              discounts.map((d) => (
                <div
                  key={d.id}
                  className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-white shadow-sm hover:border-purple-200 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        d.is_active
                          ? "bg-green-500 animate-pulse"
                          : "bg-gray-300"
                      }`}
                    />
                    <div>
                      <span className="font-mono text-lg font-black text-purple-900 tracking-tighter uppercase">
                        {d.code}
                      </span>
                      <p className="text-xs text-gray-500 font-medium">
                        {d.discount_value}{" "}
                        {d.discount_type === "percentage" ? "%" : "Tk"} Off
                        <span
                          className={`ml-2 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${
                            d.is_active
                              ? "bg-green-50 text-green-600"
                              : "bg-gray-50 text-gray-400"
                          }`}
                        >
                          {d.is_active ? "Active" : "Paused"}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleToggleDiscountStatus(d.id, d.is_active)
                      }
                      className={`text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
                        d.is_active
                          ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                          : "bg-green-50 text-green-600 hover:bg-green-100"
                      }`}
                    >
                      {d.is_active ? "Pause" : "Live"}
                    </button>
                    <button
                      onClick={() => handleDeleteDiscount(d.id)}
                      className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
