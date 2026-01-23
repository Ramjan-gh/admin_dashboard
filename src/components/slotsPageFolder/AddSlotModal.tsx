// Types 
import { AddSlotModalProps } from "../types";

export function AddSlotModal({
  isOpen,
  onClose,
  onAdd,
  shiftName,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  loading,
  shiftId,
}: AddSlotModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
      <div className="bg-white rounded-lg p-6 w-80 space-y-4 shadow-2xl">
        <h2 className="text-lg font-semibold">Add Slot</h2>
        <p className="text-sm text-gray-600">Shift: {shiftName}</p>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase text-gray-500">
            Start Time
          </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium uppercase text-gray-500">
            End Time
          </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition"
          >
            Close
          </button>
          <button
            onClick={() => {
              if (shiftId) {
                onAdd(shiftId);
                onClose(); // Force the modal to close immediately
              }
            }}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}
