import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Toaster } from "sonner";
import { Booking, BookingDetails, ApiItem } from "./types";
import { BookingFilters } from "./bookingsPageFolder/BookingFilters";
import { BookingsTable } from "./bookingsPageFolder/BookingsTable";
import { BookingDetailsDrawer } from "./bookingsPageFolder/BookingDetailsDrawer";
import { UpdateBookingModal } from "./bookingsPageFolder/UpdateBookingModal";
import { BookingPopup } from "./bookingsPageFolder/BookingPopup"; // ADD THIS
import { toast } from "sonner";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

export function BookingsPage() {
  const [showBookingPopup, setShowBookingPopup] = useState(false);
  const [editingBooking, setEditingBooking] = useState<BookingDetails | null>(
    null,
  );
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [editDetailsLoading, setEditDetailsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");
  const [offset, setOffset] = useState(0);
  const limit = 10;

  useEffect(() => {
    fetchBookings();
  }, [search, bookingDate, fieldFilter, paymentStatus, offset]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_bookings`, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${
            import.meta.env.VITE_SUPABASE_ANON_KEY || ""
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          p_limit: limit,
          p_offset: offset,
          p_booking_date: bookingDate || null,
          p_field_name: fieldFilter || null,
          p_payment_status: paymentStatus || null,
          p_search: search || null,
        }),
      });

      const data: ApiItem[] = await res.json();

      const mapped: Booking[] = data.map((item) => {
        const slots = item.result.slots || [];
        const slot = slots[0];
        const booking = item.result.booking;

        return {
          id: booking.id,
          bookingCode: booking.booking_code,
          customer: booking.full_name,
          phone: booking.phone_number,
          email: booking.email,
          dateISO: slot?.booking_date || "",
          dateDisplay: slot?.booking_date
            ? new Date(slot.booking_date).toDateString()
            : "No Date Set",
          time: slot ? `${slot.start_time} - ${slot.end_time}` : "No Time Set",
          sport: item.result.field.field_name,
          payment: booking.payment_method,
          amount: booking.final_amount,
          status: booking.payment_status,
        };
      });

      setBookings(mapped);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingDetails = async (code: string) => {
    try {
      setDetailsLoading(true);
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_booking_details`, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${
            import.meta.env.VITE_SUPABASE_ANON_KEY || ""
          }`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_booking_code: code }),
      });
      const data = await res.json();
      setDetails(data);
      return data;
    } catch (err) {
      console.error("Error fetching details:", err);
      return null;
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleEdit = async (booking: Booking) => {
    console.log("🔧 handleEdit called");

    // Close the view drawer
    setSelectedBooking(null);
    setDetails(null);

    setEditDetailsLoading(true);

    // Fetch details WITHOUT setting the details state
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_booking_details`, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ p_booking_code: booking.bookingCode }),
      });
      const fullDetails = await res.json();
      console.log("📦 Full details:", fullDetails);

      if (fullDetails) {
        console.log("✅ Setting editing booking");
        setEditingBooking(fullDetails);
      }
    } catch (err) {
      console.error("Error fetching details for edit:", err);
    }

    setEditDetailsLoading(false);
  };

  const updateBooking = async (payload: any) => {
    try {
      const requestBody = {
        p_booking_id: payload.p_booking_id,
        p_full_name: payload.p_full_name,
        p_phone_number: payload.p_phone_number,
        p_email: payload.p_email,
        p_field_id: payload.p_field_id,
        p_booking_date: payload.p_booking_date,
        p_slot_ids: payload.p_slot_ids,
        p_number_of_players: payload.p_total_players,
        p_special_notes: payload.p_notes,
        p_payment_status: payload.p_payment_status,
        p_paid_amount: Number(payload.p_paid_amount),
        p_is_cancelled: Boolean(payload.p_is_cancelled),
        p_discount_code_id: null,
        p_payment_method: payload.p_payment_method || "cash",
      };

      console.log("Request payload:", JSON.stringify(requestBody, null, 2));

      const res = await fetch(`${BASE_URL}/rest/v1/rpc/update_booking`, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Supabase error response:", errorText);
        throw new Error(`HTTP ${res.status}: ${errorText}`);
      }

      const data = await res.json();
      console.log("Success response:", data);
      return data;
    } catch (err) {
      console.error("Update error:", err);
      const error = err as Error;
      return [{ success: false, message: error.message || "Failed to update" }];
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Bookings Management</h1>
        <button
          onClick={() => setShowBookingPopup(true)} // CHANGE THIS
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg transition-transform active:scale-95"
        >
          <Plus className="w-5 h-5" /> Add Booking
        </button>
      </div>

      <div className="flex flex-col gap-6">
        <BookingFilters
          search={search}
          setSearch={setSearch}
          bookingDate={bookingDate}
          setBookingDate={setBookingDate}
          fieldFilter={fieldFilter}
          setFieldFilter={setFieldFilter}
          paymentStatus={paymentStatus}
          setPaymentStatus={setPaymentStatus}
          onClear={() => {
            setSearch("");
            setBookingDate("");
            setFieldFilter("");
            setPaymentStatus("");
            setOffset(0);
          }}
        />

        <BookingPopup
          isOpen={showBookingPopup}
          onClose={() => {
            setShowBookingPopup(false);
            toast.success("Booking created successfully!");
            fetchBookings(); // Refresh bookings list
          }}
        />

        <BookingsTable
          bookings={bookings}
          loading={loading}
          onView={(b) => {
            setSelectedBooking(b);
            fetchBookingDetails(b.bookingCode);
          }}
          onEdit={handleEdit} // Make sure this is handleEdit, not (b) => setEditingBooking(b)
        />

        {editingBooking && (
          <UpdateBookingModal
            booking={editingBooking}
            onClose={() => setEditingBooking(null)}
            onRefresh={fetchBookings}
            updateBooking={updateBooking}
          />
        )}

        {editDetailsLoading && (
          <div className="fixed inset-0 bg-black/50 z-[109] flex items-center justify-center">
            <div className="bg-white p-6 rounded-xl shadow-xl">
              <p className="text-gray-700">Loading booking details...</p>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
          <p className="text-sm text-gray-500">
            Showing {bookings.length} results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setOffset((p) => Math.max(p - limit, 0))}
              disabled={offset === 0}
              className="px-4 py-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={() => setOffset((p) => p + limit)}
              disabled={bookings.length < limit}
              className="px-4 py-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <BookingDetailsDrawer
        details={details}
        loading={detailsLoading}
        onClose={() => {
          setSelectedBooking(null);
          setDetails(null);
        }}
      />
    </div>
  );
}
