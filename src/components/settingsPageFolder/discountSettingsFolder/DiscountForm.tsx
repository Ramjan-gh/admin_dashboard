import React from "react";
import { Ticket, X } from "lucide-react";

export function DiscountForm({
  newDiscount,
  setNewDiscount,
  onAdd,
  onReset,
}: any) {
  return (
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
            onClick={onReset}
            className="flex items-center gap-1 text-[10px] font-bold text-red-500 hover:bg-red-50 px-2 py-1 rounded-lg transition-all"
          >
            <X className="w-3 h-3" /> CANCEL EDIT
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-5 items-end">
        {/* Code Input */}
        <div className="lg:col-span-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase mb-1.5 block ml-1">
            Code
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:bg-white outline-none uppercase font-mono transition-all"
            value={newDiscount.p_code}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, p_code: e.target.value })
            }
          />
        </div>

        {/* Type Switch */}
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
              {" "}
              %{" "}
            </button>
            <button
              type="button"
              onClick={() =>
                setNewDiscount({ ...newDiscount, p_discount_type: "fixed" })
              }
              className={`flex-1 rounded-lg text-xs font-bold transition-all ${newDiscount.p_discount_type === "fixed" ? "bg-white text-purple-600 shadow-sm" : "text-gray-500"}`}
            >
              {" "}
              Tk{" "}
            </button>
          </div>
        </div>

        {/* Value, Max Uses, and Dates (Simplified for brevity) */}
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
            From
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
            Until
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs"
            value={newDiscount.p_valid_until}
            onChange={(e) =>
              setNewDiscount({ ...newDiscount, p_valid_until: e.target.value })
            }
          />
        </div>

        <button
          onClick={onAdd}
          className={`w-full h-[42px] rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2 text-white ${newDiscount.id ? "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100" : "bg-gray-900 hover:bg-purple-600"}`}
        >
          {newDiscount.id ? "Update" : "Create"}
        </button>
      </div>
    </div>
  );
}
