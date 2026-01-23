import React, { useState } from "react";
import { Ticket } from "lucide-react";
import { Toaster } from "sonner";
import { DiscountSettingsProps } from "../../types";
import { DiscountForm } from "./DiscountForm";
import { DiscountList } from "./DiscountList";

export function DiscountSettings({
  discounts,
  newDiscount,
  setNewDiscount,
  handleAddDiscount,
  handleDeleteDiscount,
  handleToggleDiscountStatus,
}: DiscountSettingsProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleEditClick = (discount: any) => {
    setNewDiscount({
      id: discount.id,
      p_code: discount.code,
      p_discount_type: discount.discount_type,
      p_discount_value: discount.discount_value.toString(),
      p_max_uses: discount.max_uses,
      p_valid_from: discount.valid_from.split("T")[0],
      p_valid_until: discount.valid_until.split("T")[0],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  return (
    <div className="flex flex-col gap-8 animate-in fade-in duration-500">
      <Toaster position="top-right" richColors closeButton />

      <DiscountForm
        newDiscount={newDiscount}
        setNewDiscount={setNewDiscount}
        onAdd={handleAddDiscount}
        onReset={resetForm}
      />

      <DiscountList
        discounts={discounts}
        copiedId={copiedId}
        setCopiedId={setCopiedId}
        onEdit={handleEditClick}
        onDelete={handleDeleteDiscount}
        onToggle={handleToggleDiscountStatus}
      />
    </div>
  );
}
