import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Plus, Clock } from "lucide-react";
import { ChevronDown } from "lucide-react";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

// ================= TYPES =================
type Field = {
  id: string;
  name: string;
  icon_url: string;
};

type Slot = {
  slot_id: string;
  field_id: string;
  start_time: string;
  end_time: string;
  price: number;
  type: string; // shift/type
  status: "available" | "booked" | "maintenance";
  booking_code: string | null;
  full_name: string | null;
};

type AddSlotResponse = Slot & {
  success: boolean;
  message?: string;
  slot_id: string; // ensure slot_id exists
  price?: number;
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

  // modal state
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
  const [blockModalOpen, setBlockModalOpen] = useState(false);
  const [updating, setUpdating] = useState(false);

  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Add Slot modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newStartTime, setNewStartTime] = useState("10:00");
  const [newEndTime, setNewEndTime] = useState("11:30");
  const [newType, setNewType] = useState("Shift-A"); // default, can be overridden
  const [adding, setAdding] = useState(false);

  const selectedField = fields.find((f) => f.id === selectedFieldId);

  // ================= FETCH FIELDS =================
  useEffect(() => {
    fetch(`${BASE_URL}/rest/v1/rpc/get_fields`, {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
        Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data: Field[]) => {
        setFields(data);
        if (data.length > 0) setSelectedFieldId(data[0].id);
      });
  }, []);

  // ================= FETCH SLOTS =================
  useEffect(() => {
    if (!selectedFieldId || !selectedDate) return;

    const fetchSlots = async () => {
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
        const data: Slot[] = await res.json();
        setSlots(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSlots();
  }, [selectedFieldId, selectedDate]);

  // ================= BLOCK SLOT =================
  const blockSlot = async () => {
    if (!selectedSlot) return;

    try {
      setUpdating(true);

      const res = await fetch(`${BASE_URL}/rest/v1/rpc/hold_slot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${
            import.meta.env.VITE_SUPABASE_ANON_KEY || ""
          }`,
        },
        body: JSON.stringify({
          p_field_id: selectedSlot.field_id,
          p_slot_id: selectedSlot.slot_id,
          p_booking_date: selectedDate,
          p_session_id: crypto.randomUUID(),
          p_hold_duration_minutes: 90,
          p_type: "maintenance",
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to block slot");
      }

      setSlots((prev) =>
        prev.map((s) =>
          s.slot_id === selectedSlot.slot_id
            ? { ...s, status: data.type || "blocked" }
            : s
        )
      );

      setBlockModalOpen(false);
      setSelectedSlot(null);
      alert(data.message || "Slot blocked successfully");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to block slot");
    } finally {
      setUpdating(false);
    }
  };

  // ================= ADD SLOT =================
  const addSlot = async () => {
    if (!selectedField) return;

    if (!newStartTime || !newEndTime || !newType) {
      alert("Please fill all fields");
      return;
    }

    if (newStartTime >= newEndTime) {
      alert("End time must be after start time");
      return;
    }

    try {
      setAdding(true);

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
          p_field_id: selectedField.id,
          p_start_time: newStartTime + ":00",
          p_end_time: newEndTime + ":00",
          p_type: newType,
        }),
      });

      const data: AddSlotResponse = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to add slot");
      }


      // Add to slots grouped by type
      setSlots((prev) => [
        ...prev,
        {
          slot_id: data.slot_id,
          field_id: selectedField.id,
          start_time: newStartTime + ":00",
          end_time: newEndTime + ":00",
          type: newType,
          price: data.price ?? 0,
          status: "available",
          booking_code: null,
          full_name: null,
        },
      ]);

      setAddModalOpen(false);
      setNewStartTime("10:00");
      setNewEndTime("11:30");
      setNewType("Shift-A");

      alert("Slot added successfully!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to add slot");
    } finally {
      setAdding(false);
    }
  };

  // ================= HELPERS =================
  const getStatusColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-purple-100 border-purple-300 text-purple-700";
      case "maintenance":
        return "bg-red-100 border-red-300 text-red-700";
      case "available":
        return "bg-green-50 border-green-200 text-green-700 hover:bg-green-100 cursor-pointer";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const formatTime = (t: string) => t.slice(0, 5);

  // Group slots by type (shift)
  const slotsByShift = slots.reduce<Record<string, Slot[]>>((acc, slot) => {
    if (!acc[slot.type]) acc[slot.type] = [];
    acc[slot.type].push(slot);
    return acc;
  }, {});

  // ================= UI =================
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Slot & Schedule Management</h1>
          <p className="text-gray-500">Manage availability and bookings</p>
        </div>
        <button
          onClick={() => setAddModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg"
        >
          <Plus className="w-5 h-5" /> Add Slot
        </button>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-xl p-4 border">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Date picker */}
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

          {/* Field dropdown */}
          <div className="relative">
            <label className="text-sm text-gray-600 mb-1 block">
              Select Field
            </label>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white w-full justify-between mt-1"
            >
              <span className="text-gray-700">
                {selectedField?.name || "Select Field"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {dropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                {fields.map((f) => (
                  <li
                    key={f.id}
                    onClick={() => {
                      setSelectedFieldId(f.id);
                      setDropdownOpen(false);
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

      {/* Slots grouped by shift */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-center py-10">Loading slots...</p>
        ) : (
          Object.keys(slotsByShift).map((shift) => (
            <div key={shift}>
              <h3 className="font-semibold mb-2 text-lg">{shift}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {slotsByShift[shift].map((slot) => (
                  <div
                    key={slot.slot_id}
                    onClick={() => {
                      if (slot.status === "available") {
                        setSelectedSlot(slot);
                        setBlockModalOpen(true);
                      }
                    }}
                    className={`p-4 rounded-lg border-2 transition cursor-pointer ${getStatusColor(
                      slot.status
                    )} flex flex-col justify-between`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="text-sm font-semibold">
                        {formatTime(slot.start_time)} -{" "}
                        {formatTime(slot.end_time)}
                      </div>
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
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
                        <p className="truncate">{slot.full_name}</p>
                        <p className="opacity-70">{slot.booking_code}</p>
                      </div>
                    )}

                    <p className="text-xs mt-2 font-medium">৳{slot.price}</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* BLOCK MODAL */}
      {blockModalOpen && selectedSlot && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Block Slot</h3>
            <p className="text-sm text-gray-600 mb-4">
              Block slot{" "}
              <b>
                {formatTime(selectedSlot.start_time)} -{" "}
                {formatTime(selectedSlot.end_time)}
              </b>{" "}
              for maintenance?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setBlockModalOpen(false)}
                className="px-4 py-2 rounded-lg border bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                disabled={updating}
                onClick={blockSlot}
                className="px-4 py-2 rounded-lg border bg-red-200"
              >
                {updating ? "Blocking..." : "Block Slot"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ADD SLOT MODAL */}
      {addModalOpen && selectedField && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add New Slot</h3>

            <p className="text-sm text-gray-600 mb-2">
              Field: <b>{selectedField.name}</b>
            </p>

            <div className="mb-3">
              <label className="text-sm text-gray-600 block mb-1">
                Start Time
              </label>
              <input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            </div>

            <div className="mb-3">
              <label className="text-sm text-gray-600 block mb-1">
                End Time
              </label>
              <input
                type="time"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
                className="border p-2 rounded-lg w-full"
              />
            </div>

            <div className="mb-3 relative">
              <label className="text-sm text-gray-600 block mb-1">
                Shift/Type
              </label>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white w-full justify-between mt-1"
              >
                <span className="text-gray-700">
                  {newType || "Select Shift"}
                </span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>

              {dropdownOpen && (
                <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {[...new Set(slots.map((s) => s.type))].map((shift) => (
                    <li
                      key={shift}
                      onClick={() => {
                        setNewType(shift);
                        setDropdownOpen(false);
                      }}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {shift}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => setAddModalOpen(false)}
                className="px-4 py-2 rounded-lg border bg-gray-100 cursor-pointer"
              >
                Cancel
              </button>

              <button
                disabled={adding}
                onClick={addSlot}
                className="px-4 py-2 rounded-lg border bg-blue-200"
              >
                {adding ? "Adding..." : "Add Slot"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
