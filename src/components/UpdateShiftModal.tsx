import { X } from "lucide-react";
import { useState, useEffect } from "react";

type UpdateShiftModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (data: any) => void;
  shift: { id: string; name: string } | null;
  loading: boolean;
};

export function UpdateShiftModal({
  isOpen,
  onClose,
  onUpdate,
  shift,
  loading,
}: UpdateShiftModalProps) {
  const [name, setName] = useState("");
  const [priceMon, setPriceMon] = useState(1550);
  const [priceTue, setPriceTue] = useState(1550);
  const [priceWed, setPriceWed] = useState(1600);

  useEffect(() => {
    if (shift) {
      setName(shift.name);
    }
  }, [shift]);

  if (!isOpen || !shift) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      p_shift_id: shift.id,
      p_name: name,
      p_price_monday: Number(priceMon),
      p_price_tuesday: Number(priceTue),
      p_price_wednesday: Number(priceWed),
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl rounded-lg">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-gray-800">Update Shift</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Shift Name
            </label>
            <input
              autoFocus
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Morning Shift"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">
                Mon Price
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                value={priceMon}
                onChange={(e) => setPriceMon(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">
                Tue Price
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                value={priceTue}
                onChange={(e) => setPriceTue(Number(e.target.value))}
              />
            </div>
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase">
                Wed Price
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:border-blue-500"
                value={priceWed}
                onChange={(e) => setPriceWed(Number(e.target.value))}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:opacity-50 shadow-md shadow-blue-200 transition-all"
            >
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
