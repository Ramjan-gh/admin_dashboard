import { Eye, Edit2, Ban, Clock } from "lucide-react"; // Add Clock icon
// Types
import { TableProps } from "../types";

export const getStatusColor = (status: string) => {
  switch (status) {
    case "paid":
    case "fully_paid":
      return "bg-green-100 text-green-700";
    case "partially_paid":
      return "bg-orange-100 text-orange-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "unpaid":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

// Helper function to check if booking is in the past
const isBookingPast = (dateISO: string, time: string): boolean => {
  if (!dateISO || !time) {
    console.log("❌ Missing date or time:", { dateISO, time });
    return false;
  }

  try {
    // Extract start time from "HH:MM:SS - HH:MM:SS" format
    const startTime = time.split(" - ")[0];
    if (!startTime) {
      console.log("❌ No start time found:", time);
      return false;
    }

    // Combine date and time
    const bookingDateTime = new Date(`${dateISO}T${startTime}`);
    const now = new Date();

    

    return bookingDateTime < now;
  } catch (error) {
    console.error("Error parsing booking date/time:", error);
    return false;
  }
};

export function BookingsTable({
  bookings,
  loading,
  onView,
  onEdit,
}: TableProps) {
  return (
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
              <td colSpan={7} className="text-center py-20 text-gray-500">
                Loading bookings...
              </td>
            </tr>
          ) : bookings.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-20 text-gray-500">
                No bookings found
              </td>
            </tr>
          ) : (
            bookings.map((b) => {
              const isCancelled = b.status === "cancelled";
              const isPast = isBookingPast(b.dateISO, b.time);
              const isEditable = !isCancelled && !isPast; // Can only edit if not cancelled and not past

              

              return (
                <tr
                  key={b.id}
                  className={`hover:bg-gray-50/50 transition-colors ${
                    isCancelled ? "bg-red-50/30" : isPast ? "bg-gray-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-purple-600 tracking-wider">
                        {b.bookingCode}
                      </span>
                      {isCancelled && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-red-100 text-red-700 text-[9px] font-black uppercase rounded-full">
                          <Ban className="w-3 h-3" />
                          CANCELLED
                        </span>
                      )}
                      {isPast && !isCancelled && (
                        <span className="flex items-center gap-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-[9px] font-black uppercase rounded-full">
                          <Clock className="w-3 h-3" />
                          COMPLETED
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`font-semibold ${
                        isCancelled
                          ? "text-gray-400 line-through"
                          : isPast
                            ? "text-gray-600"
                            : "text-gray-900"
                      }`}
                    >
                      {b.customer}
                    </p>
                    <p className="text-xs text-gray-500">{b.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p
                      className={`${
                        isCancelled
                          ? "text-gray-400"
                          : isPast
                            ? "text-gray-500"
                            : "text-gray-700"
                      }`}
                    >
                      {b.dateDisplay}
                    </p>
                    <p className="text-xs text-gray-500">{b.time}</p>
                  </td>
                  <td
                    className={`px-6 py-4 font-medium ${
                      isCancelled
                        ? "text-gray-400"
                        : isPast
                          ? "text-gray-500"
                          : "text-gray-600"
                    }`}
                  >
                    {b.sport}
                  </td>
                  <td
                    className={`px-6 py-4 font-bold ${
                      isCancelled
                        ? "text-gray-400"
                        : isPast
                          ? "text-gray-600"
                          : "text-gray-900"
                    }`}
                  >
                    ৳{b.amount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 text-[10px] font-bold uppercase rounded-full tracking-wide shadow-sm ${getStatusColor(
                        b.status,
                      )}`}
                    >
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
                          if (isEditable) {
                            onEdit(b);
                          }
                        }}
                        className={`p-2 rounded-lg transition-all ${
                          isEditable
                            ? "bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed opacity-50"
                        }`}
                        title={
                          isCancelled
                            ? "Cannot edit cancelled booking"
                            : isPast
                              ? "Cannot edit past booking"
                              : "Edit Booking"
                        }
                        disabled={!isEditable}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
