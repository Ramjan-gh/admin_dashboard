import { useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { FilterBar } from "./slotsPageFolder/FilterBar";
import { SlotCard } from "./slotsPageFolder/SlotCard";
import { AddSlotModal } from "./slotsPageFolder/AddSlotModal";
import { AddShiftModal } from "./slotsPageFolder/AddShiftModal";
import { UpdateShiftModal } from "./slotsPageFolder/UpdateShiftModal";
import { useSlots } from "./slotsPageFolder/useSlots";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
  onSessionExpired: () => void;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function SlotsPage({ onSessionExpired }: Props) {
  const {
    fields,
    selectedFieldId,
    setSelectedFieldId,
    selectedDate,
    setSelectedDate,
    slots,
    shifts,
    loading,
    handleUpdateShift,
    handleAddSlot,
    handleDeleteSlot,
    handleAddShift,
    handleDeleteShift,
    handleToggleMaintenance,
  } = useSlots(onSessionExpired);

  // --- UI State ---
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [addSlotModalOpen, setAddSlotModalOpen] = useState(false);
  const [addShiftModalOpen, setAddShiftModalOpen] = useState(false);
  const [updateShiftModalOpen, setUpdateShiftModalOpen] = useState(false);

  const [modalShiftId, setModalShiftId] = useState<string | null>(null);
  const [selectedShiftForEdit, setSelectedShiftForEdit] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [modalStartTime, setModalStartTime] = useState("10:00");
  const [modalEndTime, setModalEndTime] = useState("11:00");

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // --- UI Helpers ---
  const formatTime = (t: string) => t.slice(0, 5);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "border-green-300 bg-green-50 hover:bg-green-100";
      case "booked":
        return "border-orange-300 bg-orange-50";
      case "maintenance":
        return "border-red-300 bg-red-50";
      default:
        return "";
    }
  };

  // --- UI Event Wrappers ---
  const onAddSlotSubmit = async (shiftId: string) => {
    setIsProcessing(true);
    try {
      await handleAddSlot({
        p_shift_id: shiftId,
        p_start_time: modalStartTime + ":00",
        p_end_time: modalEndTime + ":00",
      });
      setAddSlotModalOpen(false);
    } catch (error) {
      console.error("Submission error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const onAddShiftSubmit = async (data: any) => {
    setIsProcessing(true);
    try {
      await handleAddShift(data);
      setAddShiftModalOpen(false);
    } catch (error) {
      console.error("Shift submission error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      {/* Top Header Section: Stacks on mobile, stays clean on PC */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Slot Management</h1>
          <p className="text-gray-500 text-sm">
            Manage field availability and shifts
          </p>
        </div>
        <button
          onClick={() => setAddShiftModalOpen(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg active:scale-95 transition-all shadow-sm font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Shift</span>
        </button>
      </div>

      <FilterBar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        fields={fields}
        selectedField={selectedField}
        fieldDropdownOpen={fieldDropdownOpen}
        setFieldDropdownOpen={setFieldDropdownOpen}
        onSelectField={(id) => {
          setSelectedFieldId(id);
          setFieldDropdownOpen(false);
        }}
      />

      <div className="space-y-6 mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading availability...</p>
          </div>
        ) : (
          shifts.map((shift) => (
            <div
              key={shift.shift_id}
              className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100"
            >
              {/* Shift Control Strip: Wraps beautifully on mobile screens */}
              <div className="flex flex-wrap gap-3 mb-4 justify-between items-center border-b border-gray-100 pb-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <h3 className="font-bold text-base sm:text-lg text-gray-700">
                    {shift.shift_name}
                  </h3>
                  <div className="flex items-center">
                    <button
                      onClick={() => {
                        setSelectedShiftForEdit({
                          id: shift.shift_id,
                          name: shift.shift_name,
                        });
                        setUpdateShiftModalOpen(true);
                      }}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-gray-50 rounded-md transition-colors"
                      title="Edit Shift"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteShift(shift.shift_id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-50 rounded-md transition-colors"
                      title="Delete Shift"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setModalShiftId(shift.shift_id);
                    setAddSlotModalOpen(true);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-xs sm:text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Plus className="w-4 h-4" /> Add Slot
                </button>
              </div>

              {/* 🚀 THE FIXED GRID SYSTEM: Full width on tiny mobile, 2 columns on mobile layout, scales up cleanly on PC */}
              <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {slots
                  .filter((s) => s.shift_id === shift.shift_id)
                  .map((slot) => (
                    <SlotCard
                      key={slot.slot_id}
                      slot={slot}
                      onDelete={handleDeleteSlot}
                      onToggleMaintenance={() => handleToggleMaintenance(slot)}
                      formatTime={formatTime}
                      getStatusColor={getStatusColor}
                    />
                  ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      <UpdateShiftModal
        isOpen={updateShiftModalOpen}
        onClose={() => setUpdateShiftModalOpen(false)}
        onUpdate={handleUpdateShift}
        shift={selectedShiftForEdit}
        loading={isProcessing}
      />

      <AddSlotModal
        isOpen={addSlotModalOpen}
        onClose={() => setAddSlotModalOpen(false)}
        onAdd={(sid: string) => {
          onAddSlotSubmit(sid);
        }}
        shiftName={shifts.find((s) => s.shift_id === modalShiftId)?.shift_name}
        loading={isProcessing}
        shiftId={modalShiftId}
        startTime={modalStartTime}
        setStartTime={setModalStartTime}
        endTime={modalEndTime}
        setEndTime={setModalEndTime}
      />

      <AddShiftModal
        isOpen={addShiftModalOpen}
        onClose={() => setAddSlotModalOpen(false)}
        onAdd={onAddShiftSubmit}
        fieldId={selectedFieldId}
        loading={isProcessing}
      />
    </div>
  );
}