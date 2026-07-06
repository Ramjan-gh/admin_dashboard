import { Eye, Edit2, Ban, Clock } from "lucide-react";
// Types
import { TableProps } from "../types";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
    case "fully_paid":
      return "bg-blue-100 text-blue-700";
    case "partially_paid":
      return "bg-orange-100 text-orange-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "unpaid":
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const isBookingPast = (dateISO: string, time: string): boolean => {
  if (!dateISO || !time) return false;
  try {
    const startTime = time.split(" - ")[0];
    if (!startTime) return false;
    const bookingDateTime = new Date(`${dateISO}T${startTime}`);
    const now = new Date();
    return bookingDateTime < now;
  } catch (error) {
    console.error("Error parsing booking date/time:", error);
    return false;
  }
};

export function BookingsTable({ bookings, loading, onView, onEdit }: TableProps) {
  // Shared Loader State
  if (loading) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-20 text-center text-gray-500 text-sm">
        Loading bookings...
      </div>
    );
  }

  // Shared Empty State
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-xl border shadow-sm p-20 text-center text-gray-500 text-sm">
        No bookings found
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* 📱 MOBILE VIEW: Stacked Cards (visible below MD breakpoint) */}
      <div className="block md:hidden space-y-4">
        {bookings.map((b) => {
          const isCancelled = b.status === "cancelled";
          const isPast = isBookingPast(b.dateISO, b.time);
          const isEditable = !isCancelled && !isPast;

          return (
            <div
              key={b.id}
              className={`bg-white rounded-xl border shadow-sm p-4 transition-colors space-y-3 ${
                isCancelled ? "bg-red-50/20" : isPast ? "bg-gray-50/50" : ""
              }`}
            >
              {/* Header: Code & Badges */}
              <div className="flex items-center justify-between gap-2 border-b pb-2 border-gray-100">
                <span className="font-bold text-blue-500 tracking-wider text-base">
                  {b.bookingCode}
                </span>
                <div className="flex gap-1.5">
                  {isCancelled && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-black uppercase rounded-full">
                      <Ban className="w-3 h-3" /> CANCELLED
                    </span>
                  )}
                  {isPast && !isCancelled && (
                    <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-[9px] font-black uppercase rounded-full">
                      <Clock className="w-3 h-3" /> COMPLETED
                    </span>
                  )}
                  <span className={`px-2.5 py-0.5 text-[9px] font-bold uppercase rounded-full tracking-wide shadow-sm ${getStatusColor(b.status)}`}>
                    {b.status.replace("_", " ")}
                  </span>
                </div>
              </div>

              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm">
                <div>
                  <p className="text-xs text-gray-400 font-medium">Customer</p>
                  <p className={`font-semibold ${isCancelled ? "text-gray-400 line-through" : isPast ? "text-gray-600" : "text-gray-900"}`}>
                    {b.customer}
                  </p>
                  <p className="text-xs text-gray-500">{b.phone}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Sport</p>
                  <p className={`font-medium mt-0.5 ${isCancelled ? "text-gray-400" : isPast ? "text-gray-500" : "text-gray-600"}`}>
                    {b.sport}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Schedule</p>
                  <p className={`mt-0.5 ${isCancelled ? "text-gray-400" : isPast ? "text-gray-500" : "text-gray-700"}`}>
                    {b.dateDisplay}
                  </p>
                  <p className="text-xs text-gray-500">{b.time}</p>
                </div>

                <div>
                  <p className="text-xs text-gray-400 font-medium">Amount</p>
                  <p className={`text-base font-bold mt-0.5 ${isCancelled ? "text-gray-400" : isPast ? "text-gray-600" : "text-gray-900"}`}>
                    ৳{b.amount}
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(b);
                  }}
                  className="flex-1 max-w-[120px] flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-medium transition-all"
                >
                  <Eye className="w-3.5 h-3.5" /> View
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isEditable) onEdit(b);
                  }}
                  disabled={!isEditable}
                  className={`flex-1 max-w-[120px] flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium transition-all ${
                    isEditable
                      ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                  }`}
                >
                  <Edit2 className="w-3.5 h-3.5" /> Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 🖥️ DESKTOP VIEW: Traditional Table (visible from MD breakpoint up) */}
      <div className="hidden md:block bg-white rounded-xl border shadow-sm overflow-hidden">
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
            {bookings.map((b) => {
              const isCancelled = b.status === "cancelled";
              const isPast = isBookingPast(b.dateISO, b.time);
              const isEditable = !isCancelled && !isPast;

              return (
                <tr
                  key={b.id}
                  className={`hover:bg-gray-50/50 transition-colors ${
                    isCancelled ? "bg-red-50/30" : isPast ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-blue-500 tracking-wider">
                        {b.bookingCode}
                      </span>
                      {isCancelled && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-black uppercase rounded-full">
                          <Ban className="w-3 h-3" /> CANCELLED
                        </span>
                      )}
                      {isPast && !isCancelled && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-[9px] font-black uppercase rounded-full">
                          <Clock className="w-3 h-3" /> COMPLETED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`font-semibold ${isCancelled ? "text-gray-400 line-through" : isPast ? "text-gray-600" : "text-gray-900"}`}>
                      {b.customer}
                    </p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className={`${isCancelled ? "text-gray-400" : isPast ? "text-gray-500" : "text-gray-700"}`}>
                      {b.dateDisplay}
                    </p>
                    <p className="text-xs text-gray-500">{b.time}</p>
                  </td>
                  <td className={`px-6 py-4 font-medium ${isCancelled ? "text-gray-400" : isPast ? "text-gray-500" : "text-gray-600"}`}>
                    {b.sport}
                  </td>
                  <td className={`px-6 py-4 font-bold ${isCancelled ? "text-gray-400" : isPast ? "text-gray-600" : "text-gray-900"}`}>
                    ৳{b.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wide shadow-sm ${getStatusColor(b.status)}`}>
                      {b.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onView(b);
                        }}
                        className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isEditable) onEdit(b);
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          isEditable
                            ? "bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                        }`}
                        title={isCancelled ? "Cannot edit cancelled booking" : isPast ? "Cannot edit past booking" : "Edit Booking"}
                        disabled={!isEditable}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}