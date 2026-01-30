import { Eye, Edit2 } from "lucide-react";
// Types 
import { TableProps } from "../types";

export const getStatusColor = (status: string) => {
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



export function BookingsTable({ bookings, loading, onView, onEdit }: TableProps) {
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
                      b.status,
                    )}`}
                  >
                    {b.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => onView(b)}
                    className="p-2 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-lg transition-all"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onEdit(b)}
                    className="p-2 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
