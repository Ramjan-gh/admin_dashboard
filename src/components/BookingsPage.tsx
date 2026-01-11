import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  Plus,
  Eye,
  X,
  ChevronDown,
  Calendar,
  Clock,
  CreditCard,
  User,
  FileText,
  Info,
  Users,
  Tag,
} from "lucide-react";

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
  field: {
    icon_url: string;
    field_name: string;
    background_image_url: string;
  };
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
    updated_at: string; // Added
    paid_amount: number;
    booking_code: string;
    final_amount: number;
    phone_number: string;
    total_amount: number;
    special_notes: string;
    payment_method: string;
    payment_status: string;
    discount_amount: number;
    discount_code: string; // Added
    no_of_players: number; // Added
  };
  discount_code: string;
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
      console.log("Fetched details:", data.discount_code);
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

  const closeModal = () => {
    setSelectedBooking(null);
    setDetails(null);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-semibold">Bookings Management</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg transition-transform active:scale-95">
          <Plus className="w-5 h-5" /> Add Booking
        </button>
      </div>

      {/* Search + Filters */}
      <div className="bg-white rounded-xl p-4 border space-y-4 shadow-sm">
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by code, name, phone"
              className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-purple-200 outline-none transition-all"
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
            className={`px-4 py-2 border rounded-lg flex gap-2 transition-colors ${
              filterOpen ? "bg-gray-100" : "bg-white"
            }`}
          >
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>

        {filterOpen && (
          <div className="relative pt-4 border-t flex gap-4 flex-wrap animate-in fade-in slide-in-from-top-2">
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-100"
            />
            <div className="relative">
              <button
                onClick={() => setFieldDropdownOpen(!fieldDropdownOpen)}
                className="flex items-center gap-4 px-4 py-2 border rounded-lg bg-white min-w-[140px] justify-between"
              >
                {fieldFilter || "All Fields"}{" "}
                <ChevronDown className="w-4 h-4" />
              </button>
              {fieldDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
                  {fields.map((f) => (
                    <button
                      key={f}
                      onClick={() => {
                        setFieldFilter(f === "All Fields" ? "" : f);
                        setFieldDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors"
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
                className="flex items-center gap-4 px-4 py-2 border rounded-lg bg-white min-w-[160px] justify-between"
              >
                {paymentStatus
                  ? paymentStatus.replace("_", " ")
                  : "All Payments"}{" "}
                <ChevronDown className="w-4 h-4" />
              </button>
              {paymentDropdownOpen && (
                <div className="absolute left-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50 overflow-hidden">
                  {payments.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        setPaymentStatus(p === "All Payments" ? "" : p);
                        setPaymentDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors uppercase text-xs font-semibold"
                    >
                      {p.replace("_", " ")}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
            >
              <X className="w-4 h-4" /> Clear All
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr className="text-sm text-gray-600">
              <th className="px-6 py-4 text-left font-semibold">Code</th>
              <th className="px-6 py-4 text-left font-semibold">Customer</th>
              <th className="px-6 py-4 text-left font-semibold">Date & Time</th>
              <th className="px-6 py-4 text-left font-semibold">Sport</th>
              <th className="px-6 py-4 text-left font-semibold">Amount</th>
              <th className="px-6 py-4 text-left font-semibold">Status</th>
              <th className="px-6 py-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={8} className="text-center py-20 text-gray-500">
                  Loading bookings...
                </td>
              </tr>
            ) : (
              bookings.map((b) => (
                <tr
                  key={b.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4 font-bold text-purple-600 tracking-wider">
                    {b.bookingCode}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-gray-900">{b.customer}</p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-gray-700">{b.dateDisplay}</p>
                    <p className="text-xs text-gray-500">{b.time}</p>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-600">
                    {b.sport}
                  </td>
                  <td className="px-6 py-4 font-bold text-gray-900">
                    ৳{b.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wide shadow-sm ${getStatusColor(
                        b.status
                      )}`}
                    >
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedBooking(b);
                        fetchBookingDetails(b.bookingCode);
                      }}
                      className="p-2 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
        <p className="text-sm text-gray-500">
          Showing {bookings.length} results
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setOffset((prev) => Math.max(prev - limit, 0))}
            disabled={offset === 0}
            className="px-4 py-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => setOffset((prev) => prev + limit)}
            disabled={bookings.length < limit}
            className="px-4 py-2 border rounded-lg disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* 🔹 Detailed Drawer */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[100] transition-opacity ">
          <div className="absolute inset-0" onClick={closeModal}></div>
          <div className=" bg-white h-full overflow-y-auto relative shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
            {detailsLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
                <p className="text-gray-500 font-medium">
                  Fetching secure data...
                </p>
              </div>
            ) : details ? (
              <div className="flex-1 flex flex-col">
                {/* Header Image */}
                <div className="relative h-48 flex-shrink-0">
                  <img
                    src={details.field.background_image_url}
                    className="w-full h-full object-cover"
                    alt="field"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                    <div className="flex items-center gap-3 mb-2">
                      {/* Field Icon Url */}
                      <img
                        src={details.field.icon_url}
                        className="w-8 h-8 rounded-full border border-white/50 object-cover bg-white"
                        alt="icon"
                      />
                      <span className="bg-white/20 backdrop-blur-md text-white text-[10px] w-fit px-2 py-0.5 rounded uppercase">
                        Venue Details
                      </span>
                    </div>
                    <h2 className="text-white text-2xl font-bold">
                      {details.field.field_name}
                    </h2>
                  </div>
                </div>

                <div className="p-6 space-y-8 pb-32">
                  {/* Status & Code */}
                  <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300 mb-3">
                    <div>
                      <p className="text-[10px] uppercase font-black text-gray-400">
                        Booking Code
                      </p>
                      <p className="text-xl font-mono font-black text-purple-700">
                        {details.booking.booking_code}
                      </p>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-black uppercase shadow-sm ${getStatusColor(
                          details.booking.payment_status
                        )}`}
                      >
                        {details.booking.payment_status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  {/* Customer Section */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <User className="w-4 h-4" />
                      <h3 className="font-bold uppercase text-xs tracking-widest">
                        Customer Profile
                      </h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-400 text-[10px] uppercase">
                          Name
                        </p>
                        <p className="font-bold text-gray-900">
                          {details.booking.full_name}
                        </p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-400 text-[10px] uppercase">
                          Phone
                        </p>
                        <p className="font-bold text-gray-900">
                          {details.booking.phone_number}
                        </p>
                      </div>
                      <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-400 text-[10px] uppercase">
                          Email Address
                        </p>
                        <p className="font-bold text-gray-900">
                          {details.booking.email}
                        </p>
                      </div>
                      {/* No of Players */}
                      <div className="col-span-2 bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded text-purple-600">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-[10px] uppercase">
                            Total Players
                          </p>
                          <p className="font-bold text-gray-900">
                            {details.booking.no_of_players || 0} Expected
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Schedule Details */}
                  <div className="space-y-4 mt-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <h3 className="font-bold uppercase text-xs tracking-widest">
                        Reserved Slots
                      </h3>
                    </div>
                    <div className="space-y-2 mb-4">
                      {details.slots.map((s, idx) => (
                        <div
                          key={idx}
                          className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex justify-between items-center"
                        >
                          <div className="flex items-center gap-3">
                            <div className="text-purple-600">
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900">
                                {new Date(s.booking_date).toLocaleDateString(
                                  "en-GB",
                                  {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                  }
                                )}
                              </p>
                              <p className="text-blue-600 text-xs font-semibold">
                                {s.start_time.slice(0, 5)} -{" "}
                                {s.end_time.slice(0, 5)} ({s.duration_minutes}{" "}
                                mins)
                              </p>
                            </div>
                          </div>
                          <p className="font-black text-gray-900">
                            ৳{s.slot_price}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center gap-2 text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <h3 className="font-bold uppercase text-xs tracking-widest">
                        Financial Summary
                      </h3>
                    </div>
                    <div className="bg-white border rounded-xl divide-y">
                      <div className="p-4 flex justify-between text-sm">
                        <span className="text-gray-500">Subtotal Amount</span>
                        <span className="font-semibold text-gray-900">
                          ৳{details.booking.total_amount}
                        </span>
                      </div>

                      {/* Discount Code & Amount */}
                      {details.booking.discount_amount > 0 && (
                        <div className="p-4 flex justify-between items-center text-sm bg-red-50/50">
                          <div className="flex items-center gap-2">
                            <Tag className="w-3 h-3 text-red-600" />
                            <span className="text-red-600 font-medium uppercase text-[10px]">
                              Discount ({details.discount_code})
                            </span>
                          </div>
                          <span className="font-bold text-red-600">
                            - ৳{details.booking.discount_amount}
                          </span>
                        </div>
                      )}

                      <div className="p-4 flex justify-between text-sm">
                        <span className="text-gray-500 font-medium uppercase text-[10px]">
                          Payment Method
                        </span>
                        <span className="font-bold text-gray-900 uppercase">
                          {details.booking.payment_method}
                        </span>
                      </div>
                      <div className="p-4 flex justify-between text-base bg-gray-50 font-black">
                        <span className="text-gray-900">Final Total</span>
                        <span className="text-purple-700">
                          ৳{details.booking.final_amount}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Special Notes */}
                  {details.booking.special_notes && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-400">
                        <FileText className="w-4 h-4" />
                        <h3 className="font-bold uppercase text-xs tracking-widest">
                          Special Notes
                        </h3>
                      </div>
                      <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl text-sm text-orange-800 italic font-medium">
                        "{details.booking.special_notes}"
                      </div>
                    </div>
                  )}

                  {/* Metadata (Created at / Updated at) */}
                  <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-gray-400 mb-2">
                      <Info className="w-3 h-3" />
                      <span className="text-[10px] font-bold uppercase">
                        System Info
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                      <span>CREATED ON</span>
                      <span>
                        {new Date(details.booking.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                      <span>LAST UPDATED</span>
                      <span>
                        {new Date(details.booking.updated_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                      <span>INTERNAL ID</span>
                      <span className="font-mono uppercase">
                        {details.booking.id.slice(0, 18)}...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {/* Sticky Action Footer */}
            <div className="sticky bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md p-6 border-t mt-auto flex flex-col gap-3">
              <div className="flex justify-between items-center px-2 mb-2">
                <p className="text-xs text-gray-500 font-bold uppercase">
                  Balance Remaining
                </p>
                <p className="text-xl font-black text-red-600">
                  ৳
                  {details
                    ? details.booking.final_amount - details.booking.paid_amount
                    : 0}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-full py-4 bg-black hover:bg-black text-white font-black uppercase tracking-widest rounded-2xl shadow-lg transition-all active:scale-95"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
