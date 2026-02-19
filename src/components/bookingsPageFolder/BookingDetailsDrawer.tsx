import {
  User,
  Users,
  Clock,
  Calendar,
  CreditCard,
  Tag,
  FileText,
  Ban,
  AlertTriangle,
} from "lucide-react";
import { getStatusColor } from "../bookingsPageFolder/BookingsTable";
// Types
import { DrawerProps } from "../types";

export function BookingDetailsDrawer({
  details,
  loading,
  onClose,
}: DrawerProps) {
  // Guard clause to prevent rendering if no details are present while not loading
  if (!details && !loading) return null;

  const isCancelled =
    details?.booking?.is_cancelled ||
    details?.booking?.payment_status === "cancelled";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-end z-[100]">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md h-full overflow-y-auto relative shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
            <p className="text-gray-500 font-medium">Fetching secure data...</p>
          </div>
        ) : (
          details && (
            <div className="flex-1 flex flex-col">
              {/* Header Image */}
              <div className="relative h-48 flex-shrink-0">
                <img
                  src={details?.field?.background_image_url ?? ""}
                  className="w-full h-full object-cover bg-gray-200"
                  alt="field"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={details?.field?.icon_url ?? ""}
                      className="w-8 h-8 rounded-full border border-white/50 object-cover bg-white"
                      alt="icon"
                    />
                    <span className="bg-white/20 backdrop-blur-md text-white text-[10px] w-fit px-2 py-0.5 rounded uppercase">
                      Venue Details
                    </span>
                    {isCancelled && (
                      <span className="flex items-center gap-1 bg-red-500 text-white text-[10px] font-black px-2 py-1 rounded uppercase">
                        <Ban className="w-3 h-3" />
                        CANCELLED
                      </span>
                    )}
                  </div>
                  <h2 className="text-white text-2xl font-bold">
                    {details?.field?.field_name ?? "Unknown Venue"}
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-8 pb-32">
                {/* Cancellation Warning Banner */}
                {isCancelled && (
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-red-900 text-sm">
                        This Booking Has Been Cancelled
                      </p>
                      <p className="text-red-700 text-xs mt-1">
                        This booking is no longer active. No charges apply.
                      </p>
                    </div>
                  </div>
                )}

                {/* Status & Code */}
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                  <div>
                    <p className="text-[10px] uppercase font-black text-gray-400">
                      Booking Code
                    </p>
                    <p
                      className={`text-xl font-mono font-black ${isCancelled ? "text-gray-400 line-through" : "text-purple-700"}`}
                    >
                      {details?.booking?.booking_code ?? "N/A"}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-black uppercase shadow-sm ${getStatusColor(
                      details?.booking?.payment_status ?? "",
                    )}`}
                  >
                    {details?.booking?.payment_status?.replace("_", " ") ??
                      "PENDING"}
                  </span>
                </div>

                {/* Customer Profile */}
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
                      <p
                        className={`font-bold ${isCancelled ? "text-gray-400" : "text-gray-900"}`}
                      >
                        {details?.booking?.full_name ?? "Guest"}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-400 text-[10px] uppercase">
                        Phone
                      </p>
                      <p
                        className={`font-bold ${isCancelled ? "text-gray-400" : "text-gray-900"}`}
                      >
                        {details?.booking?.phone_number ?? "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg">
                      <p className="text-gray-400 text-[10px] uppercase">
                        Email Address
                      </p>
                      <p
                        className={`font-bold ${isCancelled ? "text-gray-400" : "text-gray-900"}`}
                      >
                        {details?.booking?.email ?? "N/A"}
                      </p>
                    </div>
                    <div className="col-span-2 bg-gray-50 p-3 rounded-lg flex items-center gap-3">
                      <div
                        className={`p-2 rounded ${isCancelled ? "bg-gray-200 text-gray-400" : "bg-purple-100 text-purple-600"}`}
                      >
                        <Users className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-[10px] uppercase">
                          Total Players
                        </p>
                        <p
                          className={`font-bold ${isCancelled ? "text-gray-400" : "text-gray-900"}`}
                        >
                          {details?.booking?.number_of_players ?? 0} Expected
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule Details */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Clock className="w-4 h-4" />
                    <h3 className="font-bold uppercase text-xs tracking-widest">
                      Reserved Slots
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {details?.slots?.length ? (
                      details.slots.map((s, idx) => (
                        <div
                          key={idx}
                          className={`border p-4 rounded-xl flex justify-between items-center ${
                            isCancelled
                              ? "bg-gray-50 border-gray-200"
                              : "bg-blue-50/50 border-blue-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={
                                isCancelled
                                  ? "text-gray-400"
                                  : "text-purple-600"
                              }
                            >
                              <Calendar className="w-4 h-4" />
                            </div>
                            <div>
                              <p
                                className={`font-bold ${isCancelled ? "text-gray-400" : "text-gray-900"}`}
                              >
                                {s?.booking_date
                                  ? new Date(s.booking_date).toLocaleDateString(
                                      "en-GB",
                                      {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      },
                                    )
                                  : "N/A"}
                              </p>
                              <p
                                className={`text-xs font-semibold ${isCancelled ? "text-gray-400" : "text-blue-600"}`}
                              >
                                {s?.start_time?.slice(0, 5) ?? "00:00"} -{" "}
                                {s?.end_time?.slice(0, 5) ?? "00:00"} (
                                {s?.duration_minutes ?? 0} mins)
                              </p>
                            </div>
                          </div>
                          <p
                            className={`font-black ${isCancelled ? "text-gray-400 line-through" : "text-gray-900"}`}
                          >
                            ৳{s?.slot_price ?? 0}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-400 italic">
                        No slots reserved
                      </p>
                    )}
                  </div>
                </div>

                {/* Financial Summary */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-400">
                    <CreditCard className="w-4 h-4" />
                    <h3 className="font-bold uppercase text-xs tracking-widest">
                      Financial Summary
                    </h3>
                  </div>
                  <div className="bg-white border rounded-xl divide-y">
                    <div className="p-4 flex justify-between text-sm">
                      <span className="text-gray-500">Subtotal Amount</span>
                      <span
                        className={`font-semibold ${isCancelled ? "text-gray-400 line-through" : "text-gray-900"}`}
                      >
                        ৳{details?.booking?.total_amount ?? 0}
                      </span>
                    </div>
                    {(details?.booking?.discount_amount ?? 0) > 0 && (
                      <div className="p-4 flex justify-between items-center text-sm bg-red-50/50">
                        <div className="flex items-center gap-2">
                          <Tag className="w-3 h-3 text-red-600" />
                          <span className="text-red-600 font-medium uppercase text-[10px]">
                            Discount ({details?.discount_code ?? "NONE"})
                          </span>
                        </div>
                        <span
                          className={`font-bold text-red-600 ${isCancelled ? "line-through" : ""}`}
                        >
                          - ৳{details?.booking?.discount_amount}
                        </span>
                      </div>
                    )}
                    <div className="p-4 flex justify-between text-sm">
                      <span className="text-gray-500 font-medium uppercase text-[10px]">
                        Payment Method
                      </span>
                      <span className="font-bold text-gray-900 uppercase">
                        {details?.booking?.payment_method ?? "N/A"}
                      </span>
                    </div>
                    <div
                      className={`p-4 flex justify-between text-base font-black ${isCancelled ? "bg-gray-50" : "bg-gray-50"}`}
                    >
                      <span className="text-gray-900">Final Total</span>
                      <span
                        className={
                          isCancelled
                            ? "text-gray-400 line-through"
                            : "text-purple-700"
                        }
                      >
                        ৳{details?.booking?.final_amount ?? 0}
                      </span>
                    </div>

                    {/* ADD THIS SECTION - Paid Amount */}
                    <div className="p-4 flex justify-between text-sm bg-green-50">
                      <span className="text-gray-700 font-medium uppercase text-[10px]">
                        Amount Paid
                      </span>
                      <span
                        className={`font-bold ${isCancelled ? "text-gray-400" : "text-green-700"}`}
                      >
                        ৳{details?.booking?.paid_amount ?? 0}
                      </span>
                    </div>

                    {/* Balance Due */}
                    <div
                      className={`p-4 flex justify-between text-base font-black ${isCancelled ? "bg-gray-100" : "bg-red-50"}`}
                    >
                      <span className="text-gray-900">Balance Due</span>
                      <span
                        className={
                          isCancelled ? "text-gray-400" : "text-red-700"
                        }
                      >
                        ৳
                        {(details?.booking?.final_amount ?? 0) -
                          (details?.booking?.paid_amount ?? 0)}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Special Notes */}
                {details?.booking?.special_notes && (
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

                {/* System Info */}
                <div className="bg-gray-50 p-4 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-gray-400 mb-2">
                    <span className="text-[10px] font-bold uppercase">
                      System Info
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500">
                    <span>CREATED ON</span>
                    <span>
                      {details?.booking?.created_at
                        ? new Date(details.booking.created_at).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500">
                    <span>INTERNAL ID</span>
                    <span className="font-mono uppercase">
                      {details?.booking?.id?.slice(0, 18) ?? "N/A"}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Sticky Action Footer */}
              <div className="sticky bottom-0 bg-white/80 backdrop-blur-md p-6 border-t mt-auto">
                {!isCancelled && (
                  <div className="flex justify-between items-center mb-4">
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      Balance Remaining
                    </p>
                    <p className="text-xl font-black text-red-600">
                      ৳{" "}
                      {(details?.booking?.final_amount ?? 0) -
                        (details?.booking?.paid_amount ?? 0)}
                    </p>
                  </div>
                )}
                <button
                  onClick={onClose}
                  className="w-full py-4 bg-black text-white font-black uppercase rounded-2xl shadow-lg transition-all active:scale-95"
                >
                  Close Record
                </button>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
}
