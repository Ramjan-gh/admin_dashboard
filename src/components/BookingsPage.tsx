import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Booking, BookingDetails, ApiItem } from "./types";
import { BookingFilters } from "./BookingFilters";
import { BookingsTable } from "./BookingsTable";
import { BookingDetailsDrawer } from "./BookingDetailsDrawer";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

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
      const mapped: Booking[] = data
        .map((item) => {
          const slot = item.result.slots[0];
          const booking = item.result.booking;
          return {
            id: booking.id,
            bookingCode: booking.booking_code,
            customer: booking.full_name,
            phone: booking.phone_number,
            email: booking.email,
            dateISO: slot.booking_date,
            dateDisplay: new Date(slot.booking_date).toDateString(),
            time: `${slot.start_time} - ${slot.end_time}`,
            sport: item.result.field.field_name,
            payment: booking.payment_method,
            amount: booking.final_amount,
            status: booking.payment_status,
          };
        })
        .sort((a, b) => (a.dateISO < b.dateISO ? 1 : -1));

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
    } catch (err) {
      console.error("Error fetching details:", err);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="p-4 lg:p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Bookings Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg transition-transform active:scale-95">
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

        <BookingsTable
          bookings={bookings}
          loading={loading}
          onView={(b) => {
            setSelectedBooking(b);
            fetchBookingDetails(b.bookingCode);
          }}
        />

        {/* Pagination */}
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
