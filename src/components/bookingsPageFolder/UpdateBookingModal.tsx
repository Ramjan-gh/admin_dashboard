import { useState, useEffect } from "react";
import { X, Calendar, Clock } from "lucide-react";

export function UpdateBookingModal({
  booking,
  onClose,
  onRefresh,
  updateBooking,
}: any) {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState<any[]>([]);
  const [availableSlots, setAvailableSlots] = useState<any[]>([]);

  // Initialize form data WITHOUT field_id (we'll set it after fields load)
  const [formData, setFormData] = useState({
    p_booking_id: booking.booking?.id ?? booking.id ?? "",
    p_full_name: booking.booking?.full_name ?? booking.customer ?? "",
    p_phone_number: booking.booking?.phone_number ?? booking.phone ?? "",
    p_email: booking.booking?.email ?? booking.email ?? "",
    p_payment_status:
      booking.booking?.payment_status ?? booking.status ?? "",
    p_paid_amount: booking.booking?.paid_amount ?? booking.amount ?? 0,
    p_payment_method:
      booking.booking?.payment_method ?? booking.payment ?? "cash",
    p_is_cancelled: booking.booking?.is_cancelled ?? false,
    p_total_players: booking.booking?.number_of_players ?? 0,
    p_notes: booking.booking?.special_notes ?? "",

    p_field_id: "", // Will be set after fields load
    p_booking_date: booking.slots?.[0]?.booking_date ?? "",
    p_slot_ids: booking.slots?.map((s: any) => s.slot_id).filter(Boolean) ?? [],
  });

  console.log("=== BOOKING DATA ===");
  console.log("Full booking:", booking);
  console.log("Field name:", booking.field?.field_name);
  console.log("===================");

  const supabaseHeaders = {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
    "Content-Type": "application/json",
  };

  // 1. Fetch available fields on mount
  useEffect(() => {
    const fetchFields = async () => {
      try {
        const res = await fetch(
          "https://himsgwtkvewhxvmjapqa.supabase.co/rest/v1/rpc/get_fields",
          {
            method: "POST",
            headers: supabaseHeaders,
          },
        );
        const data = await res.json();
        setFields(Array.isArray(data) ? data : []);
        console.log("🏟️ Fields loaded:", data);
      } catch (error) {
        console.error("Error fetching fields:", error);
        setFields([]);
      }
    };
    fetchFields();
  }, []);

  // 2. Auto-select field when fields are loaded
  useEffect(() => {
    if (
      fields.length > 0 &&
      booking.field?.field_name &&
      !formData.p_field_id
    ) {
      console.log("🔍 Looking for field:", booking.field.field_name);
      console.log(
        "📋 Available field names:",
        fields.map((f) => f.name),
      ); // Changed from f.field_name

      // Match by 'name' property instead of 'field_name'
      const matchingField = fields.find(
        (f) => f.name === booking.field.field_name,
      );

      if (matchingField) {
        console.log(
          "✅ Found matching field:",
          matchingField.name,
          "ID:",
          matchingField.id,
        );
        setFormData((prev) => ({
          ...prev,
          p_field_id: matchingField.id,
        }));
      } else {
        console.warn("⚠️ No exact match found, trying case-insensitive...");

        // Try case-insensitive match
        const matchingFieldCaseInsensitive = fields.find(
          (f) =>
            f.name?.toLowerCase() === booking.field.field_name?.toLowerCase(),
        );

        if (matchingFieldCaseInsensitive) {
          console.log(
            "✅ Found with case-insensitive match:",
            matchingFieldCaseInsensitive.name,
          );
          setFormData((prev) => ({
            ...prev,
            p_field_id: matchingFieldCaseInsensitive.id,
          }));
        } else {
          console.error("❌ Could not find matching field");
        }
      }
    }
  }, [fields, booking.field?.field_name]);

  // 3. Fetch available slots whenever field or date changes
  useEffect(() => {
    if (formData.p_field_id && formData.p_booking_date) {
      console.log(
        "🔄 Fetching slots for field:",
        formData.p_field_id,
        "date:",
        formData.p_booking_date,
      );

      const fetchSlots = async () => {
        try {
          const params = new URLSearchParams({
            p_field_id: formData.p_field_id,
            p_booking_date: formData.p_booking_date,
          });

          const res = await fetch(
            `https://himsgwtkvewhxvmjapqa.supabase.co/rest/v1/rpc/get_slots?${params.toString()}`,
            {
              method: "GET",
              headers: {
                apikey: supabaseHeaders.apikey,
                Authorization: supabaseHeaders.Authorization,
              },
            },
          );

          const data = await res.json();

          if (Array.isArray(data)) {
            const flattenedSlots = data.flatMap((shift: any) =>
              shift.slots.map((slot: any) => ({
                id: slot.slot_id,
                start_time: slot.start_time,
                end_time: slot.end_time,
                is_booked: slot.status === "booked",
              })),
            );
            setAvailableSlots(flattenedSlots);
            console.log("⏰ Slots loaded:", flattenedSlots.length);
          } else {
            setAvailableSlots([]);
          }
        } catch (error) {
          console.error("Error fetching slots:", error);
          setAvailableSlots([]);
        }
      };
      fetchSlots();
    }
  }, [formData.p_field_id, formData.p_booking_date]);

  useEffect(() => {
    if (formData.p_is_cancelled) {
      setFormData((prev) => ({
        ...prev,
        p_payment_status: "cancelled",
      }));
    }
  }, [formData.p_is_cancelled]);

  const toggleSlot = (slotId: string) => {
    setFormData((prev) => ({
      ...prev,
      p_slot_ids: prev.p_slot_ids.includes(slotId)
        ? prev.p_slot_ids.filter((id: string) => id !== slotId)
        : [...prev.p_slot_ids, slotId],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.p_slot_ids.length === 0) {
      alert("Please select at least one time slot");
      return;
    }

    // Only validate that the NEW booking date/time is not in the past
    const selectedDate = new Date(formData.p_booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);

    // Check if the selected date is before today
    if (selectedDate < today) {
      alert("Error: You cannot reschedule a booking to a past date.");
      return;
    }

    // If the date is today, check if the slot time has passed
    if (
      selectedDate.getTime() === today.getTime() &&
      formData.p_slot_ids.length > 0
    ) {
      // Get the earliest slot time from selected slots
      const earliestSlot = availableSlots
        .filter((slot) => formData.p_slot_ids.includes(slot.id))
        .sort((a, b) => a.start_time.localeCompare(b.start_time))[0];

      if (earliestSlot) {
        const [hours, minutes] = earliestSlot.start_time.split(":");
        const slotDateTime = new Date();
        slotDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        const now = new Date();

        if (slotDateTime < now) {
          alert("Error: The selected time slot has already passed.");
          return;
        }
      }
    }

    setLoading(true);

    const result = await updateBooking(formData);
    const response = Array.isArray(result) ? result[0] : result;

    if (response?.success) {
      alert(response.message || "Booking updated successfully");
      onRefresh();
      onClose();
    } else {
      alert(response?.message || "Failed to update booking");
    }

    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="font-bold text-xl text-gray-900">
              Reschedule & Update
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Booking Code: {booking.booking?.booking_code}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto">
          {/* Rescheduling Section */}
          <div className="space-y-4 bg-purple-50 p-4 rounded-xl border border-purple-100">
            <h3 className="text-sm font-bold text-purple-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Field & Date Selection
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Field
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-lg mt-1 bg-white text-gray-900"
                  value={formData.p_field_id}
                  onChange={(e) =>
                    setFormData({ ...formData, p_field_id: e.target.value })
                  }
                >
                  <option value="">Choose a Field</option>
                  {fields.map((f: any) => (
                    <option key={f.id} value={f.id}>
                      {f.name} {/* Changed from f.field_name || f.name */}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Date
                </label>
                <input
                  required
                  type="date"
                  className="w-full p-2 border rounded-lg mt-1 bg-white text-gray-900"
                  value={formData.p_booking_date}
                  onChange={(e) =>
                    setFormData({ ...formData, p_booking_date: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Slot Selection Grid */}
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase flex items-center gap-1">
                <Clock className="w-3 h-3" /> Select Available Slots
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {availableSlots.length > 0 ? (
                  availableSlots.map((slot: any) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => toggleSlot(slot.id)}
                      disabled={
                        slot.is_booked && !formData.p_slot_ids.includes(slot.id)
                      }
                      className={`p-2 text-[10px] font-bold rounded-lg border transition-all ${
                        formData.p_slot_ids.includes(slot.id)
                          ? "bg-purple-600 border-purple-600 text-white shadow-sm"
                          : "bg-white border-gray-200 text-gray-700"
                      } ${
                        slot.is_booked && !formData.p_slot_ids.includes(slot.id)
                          ? "opacity-40 cursor-not-allowed bg-gray-100"
                          : ""
                      }`}
                    >
                      {slot.start_time} - {slot.end_time}
                    </button>
                  ))
                ) : (
                  <p className="col-span-3 text-[10px] text-gray-400 italic py-2">
                    {formData.p_field_id && formData.p_booking_date
                      ? "No slots available for this selection."
                      : "Please select a field and date to load slots."}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Customer & Payment Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-gray-700">
              Customer & Payment
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Full Name
                </label>
                <input
                  required
                  className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                  value={formData.p_full_name}
                  onChange={(e) =>
                    setFormData({ ...formData, p_full_name: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Phone
                </label>
                <input
                  required
                  className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                  value={formData.p_phone_number}
                  onChange={(e) =>
                    setFormData({ ...formData, p_phone_number: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                  value={formData.p_email}
                  onChange={(e) =>
                    setFormData({ ...formData, p_email: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Payment Method
                </label>
                <select
                  className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                  value={formData.p_payment_method}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p_payment_method: e.target.value,
                    })
                  }
                >
                  <option value="cash">Cash</option>
                  <option value="bkash">Bkash</option>
                  <option value="online">Online</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Payment Status
                </label>
                <select
                  className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                  value={formData.p_payment_status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p_payment_status: e.target.value,
                    })
                  }
                >
                  <option value="partially_paid">Partially Paid</option>
                  <option value="fully_paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Amount Paid
                </label>
                <input
                  type="number"
                  step="0.01"
                  className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                  value={formData.p_paid_amount}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p_paid_amount: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Players & Notes Section */}
          <div className="space-y-4 bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-sm font-bold text-blue-700 flex items-center gap-2">
              Additional Details
            </h3>
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Players
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full p-2 border rounded-lg mt-1 text-gray-900 bg-white"
                  value={formData.p_total_players}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      p_total_players: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="col-span-3">
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Special Notes
                </label>
                <input
                  placeholder="e.g. Needs bibs, extra water..."
                  className="w-full p-2 border rounded-lg mt-1 text-gray-900 bg-white"
                  value={formData.p_notes}
                  onChange={(e) =>
                    setFormData({ ...formData, p_notes: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Cancellation Toggle */}
          <div className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl border border-orange-100">
            <input
              type="checkbox"
              id="is_cancelled"
              className="w-4 h-4 accent-orange-600"
              checked={formData.p_is_cancelled}
              onChange={(e) =>
                setFormData({ ...formData, p_is_cancelled: e.target.checked })
              }
            />
            <label
              htmlFor="is_cancelled"
              className="text-sm font-bold text-orange-700"
            >
              Mark Booking as Cancelled
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? "Processing..." : "Save All Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
