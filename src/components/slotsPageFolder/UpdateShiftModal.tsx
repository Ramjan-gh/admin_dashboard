import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { UpdateShiftModalProps } from "../types"


export function UpdateShiftModal({
  isOpen,
  onClose,
  onUpdate,
  shift,
  loading,
}: UpdateShiftModalProps) {
  const [name, setName] = useState("");
  const [prices, setPrices] = useState({
    monday: 1550,
    tuesday: 1550,
    wednesday: 1550,
    thursday: 1550,
    friday: 1550,
    saturday: 1600,
    sunday: 1600,
  });

  useEffect(() => {
    if (shift) {
      setName(shift.name);
    }
  }, [shift]);

  if (!isOpen || !shift) return null;

  const handlePriceChange = (day: keyof typeof prices, value: string) => {
    setPrices((prev) => ({ ...prev, [day]: Number(value) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      p_shift_id: shift.id,
      p_name: name,
      p_price_monday: prices.monday,
      p_price_tuesday: prices.tuesday,
      p_price_wednesday: prices.wednesday,
      p_price_thursday: prices.thursday,
      p_price_friday: prices.friday,
      p_price_saturday: prices.saturday,
      p_price_sunday: prices.sunday,
    });
  };

  const days: (keyof typeof prices)[] = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            Update Shift & Pricing
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Shift Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Shift Name
            </label>
            <input
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Pricing Grid */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Daily Pricing
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {days.map((day) => (
                <div key={day} className="space-y-1">
                  {/* Changed from shorthand to full name with capitalization */}
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    {day}
                  </label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg px-2 py-2 outline-none focus:border-blue-500 text-sm"
                    value={prices[day]}
                    onChange={(e) => handlePriceChange(day, e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-200 transition-all"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
