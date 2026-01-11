import { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronDown,
  Trash2,
} from "lucide-react";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

// ================= TYPES =================
type Field = {
  id: string;
  name: string;
  icon_url: string;
};

type Slot = {
  shift_id: string;
  slot_id: string;
  field_id: string;
  start_time: string;
  end_time: string;
  price: number;
  type: string; // shift name
  status: "available" | "booked" | "maintenance";
  booking_code: string | null;
  full_name: string | null;
};

type ShiftGroup = {
  shift_id: string;
  shift_name: string;
  slots: Omit<Slot, "type" | "field_id">[];
};

type Shift = {
  shift_id: string;
  shift_name: string;
};

// ================= COMPONENT =================
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

  // ================= ADD SLOT MODAL =================
  const [addSlotModalOpen, setAddSlotModalOpen] = useState(false);
  const [modalShiftId, setModalShiftId] = useState<string | null>(null);
  const [modalStartTime, setModalStartTime] = useState("10:00");
  const [modalEndTime, setModalEndTime] = useState("11:00");
  const [addingSlot, setAddingSlot] = useState(false);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // ================= HELPERS =================
  const formatTime = (t: string) => t.slice(0, 5);

  const getStatusColor = (status: Slot["status"]) => {
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

  const slotsByShift = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    if (!acc[slot.type]) acc[slot.type] = [];
    acc[slot.type].push(slot);
    return acc;
  }, {});

  // ================= FETCH FIELDS =================
  useEffect(() => {
    const fetchFields = async () => {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_fields`, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${
            import.meta.env.VITE_SUPABASE_ANON_KEY || ""
          }`,
          "Content-Type": "application/json",
        },
      });
      const data: Field[] = await res.json();
      setFields(data);
      if (data.length > 0) setSelectedFieldId(data[0].id);
    };
    fetchFields();
  }, []);

  // ================= FETCH SLOTS =================
  const fetchSlots = async () => {
    if (!selectedFieldId || !selectedDate) return;
    try {
      setLoading(true);
      const res = await fetch(
        `${BASE_URL}/rest/v1/rpc/get_slots_with_booking_details`,
        {
          method: "POST",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${
              import.meta.env.VITE_SUPABASE_ANON_KEY || ""
            }`,
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
        data.map((g) => ({
          shift_id: g.shift_id,
          shift_name: g.shift_name,
        }))
      );

      const flattened: Slot[] = data.flatMap((group) =>
        group.slots.map((slot) => ({
          ...slot,
          field_id: selectedFieldId,
          shift_id: group.shift_id,
          type: group.shift_name,
        }))
      );

      setSlots(flattened);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, [selectedFieldId, selectedDate]);

  // ================= ADD SLOT API =================
  const handleAddSlot = async (shiftId: string) => {
    if (!modalStartTime || !modalEndTime) {
      alert("Please select start and end time");
      return;
    }

    try {
      setAddingSlot(true);
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/add_slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${
            import.meta.env.VITE_SUPABASE_ANON_KEY || ""
          }`,
        },
        body: JSON.stringify({
          p_end_time: modalEndTime + ":00",
          p_shift_id: shiftId,
          p_start_time: modalStartTime + ":00",
        }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Slot added successfully!");
        setAddSlotModalOpen(false);
        fetchSlots();
      } else {
        alert(data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add slot");
    } finally {
      setAddingSlot(false);
    }
  };

  // ================= DELETE SLOT API =================
  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure you want to delete this slot?")) return;

    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/delete_slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${
            import.meta.env.VITE_SUPABASE_ANON_KEY || ""
          }`,
        },
        body: JSON.stringify({
          p_slot_id: slotId,
        }),
      });

      const data = await res.json();

      if (data.code === "23503") {
        alert(
          "Cannot delete: This slot has an active booking associated with it."
        );
        return;
      }

      fetchSlots();
    } catch (err) {
      console.error(err);
      alert("Failed to delete slot");
    }
  };

  // ================= UI =================
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Slot & Schedule Management</h1>
          <p className="text-gray-500">Manage availability and bookings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
          <Plus className="w-5 h-5" /> Add Shift
        </button>
      </div>

      {/* Controls - FIXED: added relative and z-20 to stay above the grid */}
      <div className="bg-white rounded-xl p-4 border relative z-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm text-gray-600">Select Date</label>
            <div className="flex items-center gap-2 mt-1">
              <CalendarIcon className="w-5 h-5 text-gray-400" />
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            </div>
          </div>

          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">
              Select Field
            </label>
            <button
              onClick={() => setFieldDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white w-full justify-between mt-1"
            >
              <span className="text-gray-700">
                {selectedField?.name || "Select Field"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {fieldDropdownOpen && (
              <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
                {fields.map((f) => (
                  <li
                    key={f.id}
                    onClick={() => {
                      setSelectedFieldId(f.id);
                      setFieldDropdownOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  >
                    {f.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Slots Grid - FIXED: added relative and z-10 to stay below controls */}
      <div className="space-y-6 relative z-10">
        {loading ? (
          <p className="text-center py-10">Loading slots...</p>
        ) : (
          Object.keys(slotsByShift).map((shift) => (
            <div key={shift}>
              <div className="flex mb-2 justify-between items-center">
                <h3 className="font-semibold mb-2 text-lg">{shift}</h3>
                <button
                  onClick={() => {
                    const foundShift = shifts.find(
                      (s) => s.shift_name === shift
                    );
                    const actualShiftId = foundShift?.shift_id;
                    if (!actualShiftId) {
                      alert(`Error: Could not find ID for ${shift}.`);
                      return;
                    }
                    setModalShiftId(actualShiftId);
                    setModalStartTime("10:00");
                    setModalEndTime("11:00");
                    setAddSlotModalOpen(true);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                >
                  <Plus className="w-5 h-5" /> Add Slot
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {slotsByShift[shift].map((slot) => (
                  <div
                    key={slot.slot_id}
                    className={`p-4 rounded-lg border-2 transition relative ${getStatusColor(
                      slot.status
                    )} flex flex-col justify-between h-32`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="text-sm font-semibold">
                        {formatTime(slot.start_time)} -{" "}
                        {formatTime(slot.end_time)}
                      </div>
                      <span
                        className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                          slot.status === "available"
                            ? "bg-green-100 text-green-700 border border-green-200"
                            : slot.status === "booked"
                            ? "bg-purple-100 text-purple-700 border border-purple-300"
                            : "bg-red-100 text-red-700 border border-red-300"
                        }`}
                      >
                        {slot.status.charAt(0).toUpperCase() +
                          slot.status.slice(1)}
                      </span>
                    </div>

                    {slot.status === "booked" && (
                      <div className="text-xs mt-1">
                        <p className="truncate font-medium">{slot.full_name}</p>
                        <p className="opacity-70">{slot.booking_code}</p>
                      </div>
                    )}

                    <div className="flex justify-between items-end mt-auto">
                      <p className="text-xs font-bold">৳{slot.price}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSlot(slot.slot_id);
                        }}
                        className="p-1.5 bg-white border border-red-200 text-red-500 rounded hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ================= ADD SLOT MODAL ================= */}
      {addSlotModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 w-80 space-y-4">
            <h2 className="text-lg font-semibold">Add Slot</h2>
            <p className="text-sm text-gray-600">
              Shift:{" "}
              {shifts.find((s) => s.shift_id === modalShiftId)?.shift_name}
            </p>

            <div className="flex flex-col gap-2">
              <label>Start Time</label>
              <input
                type="time"
                value={modalStartTime}
                onChange={(e) => setModalStartTime(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label>End Time</label>
              <input
                type="time"
                value={modalEndTime}
                onChange={(e) => setModalEndTime(e.target.value)}
                className="border p-2 rounded"
              />
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setAddSlotModalOpen(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Close
              </button>
              <button
                onClick={() => handleAddSlot(modalShiftId!)}
                className="px-4 py-2 bg-blue-500 text-white rounded"
                disabled={addingSlot}
              >
                {addingSlot ? "Adding..." : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
