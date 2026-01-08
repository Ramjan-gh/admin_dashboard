import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
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
  const [shiftDropdownOpen, setShiftDropdownOpen] = useState(false);


  const [shifts, setShifts] = useState<Shift[]>([]);

  // Modal-specific field selection
  const [modalFieldId, setModalFieldId] = useState("");

  const selectedField = fields.find((f) => f.id === selectedFieldId);
  const modalSelectedField = fields.find((f) => f.id === modalFieldId);

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

      if (data.length > 0) {
        setSelectedFieldId(data[0].id);
        setModalFieldId(data[0].id);
      }
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

  // ================= UI =================
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1>Slot & Schedule Management</h1>
          <p className="text-gray-500">Manage availability and bookings</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
          <Plus className="w-5 h-5" /> Add Shift
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
              onClick={() => setFieldDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors bg-white w-full justify-between mt-1"
            >
              <span className="text-gray-700">
                {selectedField?.name || "Select Field"}
              </span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </button>

            {fieldDropdownOpen && (
              <ul className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-auto">
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

      {/* Slots Grid */}
      <div className="space-y-6">
        {loading ? (
          <p className="text-center py-10">Loading slots...</p>
        ) : (
          Object.keys(slotsByShift).map((shift) => (
            <div key={shift}>
              <div className="flex  mb-2 justify-between items-center">
                <h3 className="font-semibold mb-2 text-lg">{shift}</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg">
                  <Plus className="w-5 h-5" /> Add Slot
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {slotsByShift[shift].map((slot) => (
                  <div
                    key={slot.slot_id}
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
    </div>
  );
}
