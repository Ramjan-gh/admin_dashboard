import React from "react";
import { Ticket } from "lucide-react";
import { DiscountCard } from "./DiscountCard";

export function DiscountList({
  discounts,
  copiedId,
  setCopiedId,
  onEdit,
  onDelete,
  onToggle,
}: any) {
  return (
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
          discounts.map((d: any) => (
            <DiscountCard
              key={d.id}
              discount={d}
              copiedId={copiedId}
              setCopiedId={setCopiedId}
              onEdit={onEdit}
              onDelete={onDelete}
              onToggle={onToggle}
            />
          ))
        )}
      </div>
    </div>
  );
}
