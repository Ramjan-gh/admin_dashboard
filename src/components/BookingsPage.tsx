import { useEffect, useState } from "react";
import { Search, Filter, Plus, Eye, X } from "lucide-react";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

// ================= TYPES =================
type ApiItem = {
  result: {
    field: { field_name: string; icon_url: string };
    slots: { booking_date: string; start_time: string; end_time: string }[];
    booking: {
      id: string;
      booking_code: string;
      full_name: string;
      phone_number: string;
      email: string;
      payment_method: string;
      payment_status: string;
      total_amount: number;
      status: string;
    };
  };
};

type Booking = {
  id: string;
  bookingCode: string;
  customer: string;
  phone: string;
  email: string;
  dateISO: string;
  dateDisplay: string;
  time: string;
  sport: string;
  payment: string;
  amount: number;
  status: string;
};

// ================= COMPONENT =================
export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🔹 Filters
  const [search, setSearch] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  // 🔹 Pagination
  const limit = 50; // show more by default
  const [offset, setOffset] = useState(0);

  // ================= FETCH =================
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

      const text = await res.text();
      const data: ApiItem[] = JSON.parse(text);

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
            amount: booking.total_amount,
            status: booking.payment_status,
          };
        })
        // Sort by booking date/time
        .sort((a, b) => (a.dateISO > b.dateISO ? 1 : -1));

      setBookings(mapped);
    } catch (err) {
      console.error("API error:", err);
    } finally {
      setLoading(false);
    }
  };

  // ================= UI HELPERS =================
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "pending":
      case "partially_paid":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // ================= UI =================
  return (
    <div className="p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-xl">Bookings Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg">
          <Plus className="w-5 h-5" /> Add Booking
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl p-4 border space-y-4">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, name, phone"
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>

          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-2 border rounded-lg flex gap-2"
          >
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>

        {filterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t">
            {/* Booking Date */}
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="border p-2 rounded"
            />

            {/* Sport */}
            <select
              onChange={(e) => setFieldFilter(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Fields</option>
              <option value="Football">Football</option>
              <option value="Cricket">Cricket</option>
              <option value="Badminton">Badminton</option>
            </select>

            {/* Payment */}
            <select
              onChange={(e) => setPaymentStatus(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">All Payments</option>
              <option value="confirmed">Confirmed</option>
              <option value="pending">Pending</option>
              <option value="partially_paid">Partially Paid</option>
            </select>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Code</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Date & Time</th>
              <th className="px-4 py-3 text-left">Sport</th>
              <th className="px-4 py-3 text-left">Payment</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={8} className="text-center py-6">
                  Loading...
                </td>
              </tr>
            )}

            {!loading &&
              bookings.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 text-purple-600">{b.bookingCode}</td>
                  <td className="px-4 py-3">
                    <p>{b.customer}</p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{b.dateDisplay}</p>
                    <p className="text-xs text-gray-500">{b.time}</p>
                  </td>
                  <td className="px-4 py-3">{b.sport}</td>
                  <td className="px-4 py-3">{b.payment}</td>
                  <td className="px-4 py-3">৳{b.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        b.status
                      )}`}
                    >
                      {b.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => setSelectedBooking(b)}>
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {/* Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/50 flex justify-end">
          <div className="w-full max-w-md bg-white p-6">
            <button onClick={() => setSelectedBooking(null)} className="mb-4">
              <X />
            </button>
            <h2 className="text-lg">{selectedBooking.customer}</h2>
            <p>{selectedBooking.dateDisplay}</p>
            <p>{selectedBooking.time}</p>
            <p className="mt-2">৳{selectedBooking.amount}</p>
          </div>
        </div>
      )}
    </div>
  );
}
