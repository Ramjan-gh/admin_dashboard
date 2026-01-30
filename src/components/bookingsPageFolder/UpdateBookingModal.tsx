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

  // Initialize form data by mapping the nested objects from the Drawer's data structure
  const [formData, setFormData] = useState({
    p_booking_id: booking.id || "",
    p_full_name: booking.customer || "",
    p_phone_number: booking.phone || "",
    p_email: booking.email || "", // Note: your log shows this as undefined
    p_payment_status: booking.status || "unpaid",
    p_paid_amount: booking.amount || 0,
    p_is_cancelled: booking.status === "cancelled",

    // We leave this empty initially; the useEffect above will fix it
    p_field_id: "",

    // Use dateISO as it's already in the required YYYY-MM-DD format
    p_booking_date: booking.dateISO || "",

    // If slot_ids aren't in the object, you might need to fetch them
    // or handle them via the slot selection UI
    p_slot_ids: booking.slot_ids || [],
  });

  console.log("Current Field ID in State:", formData.p_field_id);
  console.log(
    "Available Fields:",
    fields.map((f) => f.id),
  );
console.log("Current Booking Data:", booking);
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
            method: "POST", // RPCs generally use POST [cite: 127]
            headers: supabaseHeaders,
          },
        );
        const data = await res.json();
        // Ensure data is an array to prevent .map() errors
        setFields(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching fields:", error);
        setFields([]);
      }
    };
    fetchFields();
  }, []);

  // 2. Fetch available slots whenever field or date changes
  useEffect(() => {
    if (formData.p_field_id && formData.p_booking_date) {
      const fetchSlots = async () => {
        try {
          // FIX: Use GET method and pass parameters via URL query string
          const params = new URLSearchParams({
            p_field_id: formData.p_field_id,
            p_booking_date: formData.p_booking_date,
          });

          const res = await fetch(
            `https://himsgwtkvewhxvmjapqa.supabase.co/rest/v1/rpc/get_slots?${params.toString()}`,
            {
              method: "GET", // Changed from POST to GET
              headers: {
                apikey: supabaseHeaders.apikey,
                Authorization: supabaseHeaders.Authorization,
                // Content-Type is not needed for GET requests without a body
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

    // The documentation notes that past dates are rejected
    const selectedDate = new Date(formData.p_booking_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      alert("Error: You cannot reschedule a booking to a past date.");
      return;
    }

    setLoading(true);

    // Note: The API returns an array containing the result object
    const result = await updateBooking(formData);

    // Accessing the first element of the returned array as shown in your console log
    const response = Array.isArray(result) ? result[0] : result;

    if (response?.success) {
      alert(response.message || "Booking updated successfully"); // cite: 144
      onRefresh();
      onClose();
    } else {
      // This will now show "Cannot update to a date in the past" in the alert
      alert(response?.message || "Failed to update booking");
    }
    setLoading(false);
  };

  useEffect(() => {
    // Check if we have fields and a 'sport' name from the booking data
    if (fields.length > 0 && booking?.sport && !formData.p_field_id) {
      // Find the field object where the name matches the 'sport' property
      const matchingField = fields.find(
        (f) => (f.field_name || f.name) === booking.sport,
      );

      if (matchingField) {
        console.log("Match found! Setting field ID to:", matchingField.id);
        setFormData((prev) => ({
          ...prev,
          p_field_id: matchingField.id,
        }));
      } else {
        console.warn("No field found matching the name:", booking.sport);
      }
    }
  }, [fields, booking, formData.p_field_id]);

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
              Booking ID: {booking.id}
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
                      {f.field_name || f.name}
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
                      // ONLY disable if it's booked by someone else (not in our current p_slot_ids)
                      disabled={
                        slot.is_booked && !formData.p_slot_ids.includes(slot.id)
                      }
                      className={`p-2 text-[10px] font-bold rounded-lg border transition-all ${
                        formData.p_slot_ids.includes(slot.id)
                          ? "bg-purple-600 border-purple-600 text-white shadow-sm" // Selected/Current slots
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
                  className="w-full p-2 border rounded-lg mt-1 text-gray-900"
                  value={formData.p_email}
                  onChange={(e) =>
                    setFormData({ ...formData, p_email: e.target.value })
                  }
                />
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
                  <option value="unpaid">Unpaid</option>
                  <option value="partially_paid">Partially Paid</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-500 uppercase">
                  Amount Paid
                </label>
                <input
                  type="number"
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
