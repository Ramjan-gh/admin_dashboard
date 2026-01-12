import { useEffect, useState } from "react";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { FilterBar } from "./slots/FilterBar";
import { SlotCard } from "./slots/SlotCard";
import { AddSlotModal } from "./slots/AddSlotModal";
import { AddShiftModal } from "./slots/AddShiftModal";
import { UpdateShiftModal } from "./UpdateShiftModal";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

// TYPES
type Field = { id: string; name: string; icon_url: string };
type Slot = {
  shift_id: string;
  slot_id: string;
  field_id: string;
  start_time: string;
  end_time: string;
  price: number;
  type: string;
  status: "available" | "booked" | "maintenance";
  booking_code: string | null;
  full_name: string | null;
};
type ShiftGroup = {
  shift_id: string;
  shift_name: string;
  slots: Omit<Slot, "type" | "field_id">[];
};
type Shift = { shift_id: string; shift_name: string };

export function SlotsPage() {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [shifts, setShifts] = useState<Shift[]>([]);

  // ADD SLOT MODAL STATE
  const [addSlotModalOpen, setAddSlotModalOpen] = useState(false);
  const [modalShiftId, setModalShiftId] = useState<string | null>(null);
  const [modalStartTime, setModalStartTime] = useState("10:00");
  const [modalEndTime, setModalEndTime] = useState("11:00");
  const [addingSlot, setAddingSlot] = useState(false);

  // ADD SHIFT MODAL STATE
  const [addShiftModalOpen, setAddShiftModalOpen] = useState(false);
  const [creatingShift, setCreatingShift] = useState(false);

  // UPDATE SHIFT MODAL STATE
  const [updateShiftModalOpen, setUpdateShiftModalOpen] = useState(false);
  const [selectedShiftForEdit, setSelectedShiftForEdit] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [isUpdatingShift, setIsUpdatingShift] = useState(false);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // HELPERS
  const formatTime = (t: string) => t.slice(0, 5);
  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "border-green-300 bg-green-50 hover:bg-green-100";
      case "booked":
        return "border-purple-300 bg-purple-50";
      case "maintenance":
        return "border-red-300 bg-red-50";
      default:
        return "";
    }
  };

  // API CALLS
  const fetchFields = async () => {
    const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_fields`, {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    setFields(data);
    if (data.length > 0) setSelectedFieldId(data[0].id);
  };

  const fetchSlots = async () => {
    if (!selectedFieldId || !selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch(
        `${BASE_URL}/rest/v1/rpc/get_slots_with_booking_details`,
        {
          method: "POST",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_field_id: selectedFieldId,
            p_booking_date: selectedDate,
          }),
        }
      );
      const data: ShiftGroup[] = await res.json();
      setShifts(
        data.map((g) => ({ shift_id: g.shift_id, shift_name: g.shift_name }))
      );
      setSlots(
        data.flatMap((group) =>
          group.slots.map((slot) => ({
            ...slot,
            field_id: selectedFieldId,
            shift_id: group.shift_id,
            type: group.shift_name,
          }))
        )
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateShift = async (payload: any) => {
    setIsUpdatingShift(true);
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/update_shift`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setUpdateShiftModalOpen(false);
        fetchSlots();
      } else {
        const error = await res.json();
        alert(error.message || "Failed to update shift");
      }
    } catch (err) {
      alert("Network error.");
    } finally {
      setIsUpdatingShift(false);
    }
  };

  const handleAddSlot = async (shiftId: string) => {
    setAddingSlot(true);
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/add_slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          p_end_time: modalEndTime + ":00",
          p_shift_id: shiftId,
          p_start_time: modalStartTime + ":00",
        }),
      });
      const data = await res.json();
      if (data.success || res.ok) {
        setAddSlotModalOpen(false);
        fetchSlots();
      } else {
        alert(data.message);
      }
    } finally {
      setAddingSlot(false);
    }
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!slotId || !confirm("Are you sure you want to delete this slot?"))
      return;
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/delete_slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ p_slot_id: slotId }),
      });
      if (!res.ok) {
        const errorData = await res.json();
        alert("Error: " + (errorData.message || "Failed to delete"));
        return;
      }
      fetchSlots();
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleAddShift = async (shiftData: any) => {
    setCreatingShift(true);
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/add_shift`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(shiftData),
      });

      // 1. Parse the response body first
      const data = await res.json();

      if (res.ok) {
        // 2. Check if the API returned a success flag or if it's a straight success
        if (data.success !== false) {
          // Show the success message from API (e.g., "Shift created successfully")
          alert(data.message || "Shift created successfully");
          setAddShiftModalOpen(false);
          fetchSlots();
        } else {
          // Handle case where res is 200/201 but the logic failed (custom error)
          alert(data.message || "Failed to create shift");
        }
      } else {
        // 3. Handle HTTP errors (400, 401, 500 etc.) using the API's error message
        alert(data.message || "Failed to create shift");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    } finally {
      setCreatingShift(false);
    }
  };

  const handleDeleteShift = async (shiftId: string) => {
    if (
      !shiftId ||
      !confirm("Delete this shift and all its slots permanently?")
    )
      return;

    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/delete_shift`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ p_shift_id: shiftId }),
      });

      const data = await res.json(); // Parse the JSON response

      if (res.ok && data.success !== false) {
        // If the request was successful and data.success is not explicitly false
        fetchSlots();
      } else {
        // Display the specific message from your JSON response
        // Fallback to a default message if data.message is missing
        alert(data.message || "Error deleting shift.");
      }
    } catch (err) {
      alert("Network error.");
    }
  };

  const handleToggleMaintenance = async (slot: Slot) => {
    const isMaintenance = slot.status === "maintenance";

    // Decide which RPC to call based on current status
    const endpoint = isMaintenance
      ? "remove_slot_from_maintenance"
      : "reserve_slot_for_maintenance";

    // Prepare body based on your API requirements
    // Note: Ensure your 'get_slots_with_booking_details' returns 'maintenance_id'
    const body = isMaintenance
      ? { p_maintenance_id: (slot as any).maintenance_id }
      : { p_slot_id: slot.slot_id, p_date: selectedDate };

    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      // Notify user with the message from your API
      if (res.ok) {
        // If the API returns success: true, refresh the list
        if (data.success !== false) {
          alert(data.message || "Operation successful");
          fetchSlots();
        } else {
          // If success is false, show the error message from the API
          alert(`Issue: ${data.message}`);
        }
      } else {
        alert(data.message || "Failed to contact server");
      }
    } catch (err) {
      alert("Network error. Please try again.");
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);
  useEffect(() => {
    fetchSlots();
  }, [selectedFieldId, selectedDate]);

  return (
    <div className="p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Slot Management</h1>
          <p className="text-gray-500 text-sm">
            Manage field availability and shifts
          </p>
        </div>
        <button
          onClick={() => setAddShiftModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md"
        >
          <Plus className="w-5 h-5" />{" "}
          <span className="font-medium">Add Shift</span>
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

      <div className="space-y-8 relative z-10 mt-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
            <p>Loading availability...</p>
          </div>
        ) : (
          shifts.map((shift) => {
            const currentShiftSlots = slots.filter(
              (s) => s.shift_id === shift.shift_id
            );
            return (
              <div
                key={shift.shift_id}
                className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 mb-6"
              >
                <div className="flex mb-3 justify-between items-center border-b border-gray-100 pb-2">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-lg text-gray-700">
                      {shift.shift_name}
                    </h3>
                    <div className="flex items-center gap-4 border p-2 rounded-lg">
                      <button
                        onClick={() => {
                          setSelectedShiftForEdit({
                            id: shift.shift_id,
                            name: shift.shift_name,
                          });
                          setUpdateShiftModalOpen(true);
                        }}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteShift(shift.shift_id)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
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
                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-sm font-semibold hover:bg-blue-600 hover:text-white transition-all"
                  >
                    <Plus className="w-4 h-4" /> Add Slot
                  </button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {currentShiftSlots.length > 0 ? (
                    currentShiftSlots.map((slot) => (
                      <SlotCard
                        key={slot.slot_id}
                        slot={slot}
                        onDelete={handleDeleteSlot}
                        onToggleMaintenance={() =>
                          handleToggleMaintenance(slot)
                        }
                        formatTime={formatTime}
                        getStatusColor={getStatusColor}
                      />
                    ))
                  ) : (
                    <div className="col-span-full py-10 border-2 border-dashed border-gray-100 rounded-xl flex flex-col items-center justify-center text-gray-400 text-sm italic">
                      No slots added to this shift yet.
                    </div>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODALS */}
      <UpdateShiftModal
        isOpen={updateShiftModalOpen}
        onClose={() => setUpdateShiftModalOpen(false)}
        onUpdate={handleUpdateShift}
        shift={selectedShiftForEdit}
        loading={isUpdatingShift}
      />

      <AddSlotModal
        isOpen={addSlotModalOpen}
        onClose={() => setAddSlotModalOpen(false)}
        onAdd={handleAddSlot}
        shiftName={shifts.find((s) => s.shift_id === modalShiftId)?.shift_name}
        startTime={modalStartTime}
        setStartTime={setModalStartTime}
        endTime={modalEndTime}
        setEndTime={setModalEndTime}
        loading={addingSlot}
        shiftId={modalShiftId || ""}
      />

      <AddShiftModal
        isOpen={addShiftModalOpen}
        onClose={() => setAddShiftModalOpen(false)}
        onAdd={handleAddShift}
        fieldId={selectedFieldId}
        loading={creatingShift}
      />
    </div>
  );
}
