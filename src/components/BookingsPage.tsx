import { useEffect, useState } from "react";
import { Search, Filter, Plus, Eye, X, ChevronDown } from "lucide-react";

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
      final_amount: number;
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

type BookingDetails = {
  field: { icon_url: string; field_name: string; background_image_url: string };
  slots: {
    slot_id: string;
    end_time: string;
    slot_price: number;
    start_time: string;
    booking_date: string;
    duration_minutes: number;
  }[];
  booking: {
    id: string;
    email: string;
    status: string;
    full_name: string;
    created_at: string;
    paid_amount: number;
    booking_code: string;
    final_amount: number;
    phone_number: string;
    total_amount: number;
    special_notes: string;
    payment_method: string;
    payment_status: string;
    discount_amount: number;
  };
};

// ================= COMPONENT =================
export function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [details, setDetails] = useState<BookingDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [bookingDate, setBookingDate] = useState("");
  const [fieldFilter, setFieldFilter] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);

  const limit = 10;
  const [offset, setOffset] = useState(0);

  const fields = ["All Fields", "Football", "Cricket", "Badminton"];
  const payments = ["All Payments", "fully_paid", "partially_paid"];

  // ================= FETCH LIST =================
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "fully_paid":
        return "bg-green-100 text-green-700";
      case "partially_paid":
        return "bg-orange-100 text-orange-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const clearAllFilters = () => {
    setSearch("");
    setBookingDate("");
    setFieldFilter("");
    setPaymentStatus("");
    setOffset(0);
  };

  // Helper to close modal and reset data
  const closeModal = () => {
    setSelectedBooking(null);
    setDetails(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Bookings Management</h1>
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
              className="w-full pl-10 pr-10 py-2 border rounded-lg"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="px-4 py-2 border rounded-lg flex gap-2"
          >
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>

        {filterOpen && (
          <div className="relative pt-4 border-t flex gap-4 flex-wrap">
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="border p-2 rounded-lg"
            />

            <div className="relative">
              <button
                onClick={() => setFieldDropdownOpen(!fieldDropdownOpen)}
                className="flex items-center gap-4 px-4 py-2 border rounded-lg bg-white"
              >
                {fieldFilter || "All Fields"}{" "}
                <ChevronDown className="w-4 h-4" />
              </button>
              {fieldDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  {fields.map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFieldFilter(f === "All Fields" ? "" : f);
                        setFieldDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      {f}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
                className="flex items-center gap-4 px-4 py-2 border rounded-lg bg-white"
              >
                {paymentStatus
                  ? paymentStatus.replace("_", " ")
                  : "All Payments"}{" "}
                <ChevronDown className="w-4 h-4" />
              </button>
              {paymentDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-lg z-50">
                  {payments.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPaymentStatus(p === "All Payments" ? "" : p);
                        setPaymentDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-50"
                    >
                      {p.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={clearAllFilters}
              className="px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-sm text-gray-600">
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
          <tbody className="text-sm">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-10">
                  Loading...
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr key={b.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-purple-600">
                    {b.bookingCode}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium">{b.customer}</p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </td>
                  <td className="px-4 py-3">
                    <p>{b.dateDisplay}</p>
                    <p className="text-xs text-gray-500">{b.time}</p>
                  </td>
                  <td className="px-4 py-3">{b.sport}</td>
                  <td className="px-4 py-3 capitalize">{b.payment}</td>
                  <td className="px-4 py-3 font-semibold">৳{b.amount}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        b.status
                      )}`}
                    >
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        fetchBookingDetails(b.bookingCode);
                      }}
                      className="p-2 hover:bg-blue-50 rounded-full transition"
                    >
                      <Eye className="w-4 h-4 text-blue-600" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
          disabled={offset === 0}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => setOffset((prev) => prev + limit)}
          disabled={bookings.length < limit}
          className="px-4 py-2 border rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* 🔹 Detailed Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[100] transition-opacity">
          {/* Clickable Backdrop to close */}
          <div className="absolute inset-0" onClick={closeModal}></div>

          <div className="w-full max-w-md bg-white h-full overflow-y-auto p-6 relative shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            {detailsLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="text-gray-500">Loading details...</p>
              </div>
            ) : details ? (
              <div className="flex-1 space-y-6 pb-20">
                {" "}
                {/* pb-20 makes room for the bottom button */}
                <div className="relative h-32 rounded-xl overflow-hidden mt-4">
                  <img
                    src={details.field.background_image_url}
                    className="w-full h-full object-cover"
                    alt="field"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-end p-4">
                    <h2 className="text-white text-xl font-bold">
                      {details.field.field_name}
                    </h2>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">
                      Booking Code
                    </p>
                    <p className="text-lg font-mono font-bold text-purple-700">
                      {details.booking.booking_code}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(
                      details.booking.payment_status
                    )}`}
                  >
                    {details.booking.payment_status.replace("_", " ")}
                  </span>
                </div>
                <div className="space-y-4">
                  <h3 className="font-bold border-b pb-1 text-sm">
                    Customer Info
                  </h3>
                  <div className="grid grid-cols-2 gap-y-3 text-sm">
                    <div>
                      <p className="text-gray-400 text-xs">Name</p>
                      <p>{details.booking.full_name}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs">Phone</p>
                      <p>{details.booking.phone_number}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-400 text-xs">Email</p>
                      <p>{details.booking.email}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold border-b pb-1 text-sm">
                    Slot Details
                  </h3>
                  {details.slots.map((s, idx) => (
                    <div
                      key={idx}
                      className="bg-blue-50 p-3 rounded-lg flex justify-between text-sm"
                    >
                      <div>
                        <p className="font-semibold">
                          {new Date(s.booking_date).toLocaleDateString()}
                        </p>
                        <p className="text-blue-600">
                          {s.start_time.slice(0, 5)} - {s.end_time.slice(0, 5)}
                        </p>
                      </div>
                      <p className="font-bold">৳{s.slot_price}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>Total</span>
                    <span>৳{details.booking.final_amount}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Paid</span>
                    <span>- ৳{details.booking.paid_amount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2">
                    <span>Due</span>
                    <span className="text-red-600">
                      ৳
                      {details.booking.final_amount -
                        details.booking.paid_amount}
                    </span>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Bottom Close Button */}
            <div className="sticky bottom-0 left-0 right-0 bg-white pt-4 border-t mt-auto">
              <button
                onClick={closeModal}
                className="w-full py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
