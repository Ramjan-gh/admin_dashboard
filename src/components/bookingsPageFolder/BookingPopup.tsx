import { useState } from "react";
import { X } from "lucide-react";
import ClientBookingWrapper from "./clientBooking/src/ClientBookingWrapper";
import { BookingConfirmation } from "./clientBooking/src/components/BookingConfirmation"; 

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingPopup({ isOpen, onClose }: Props) {
  // Store the payload configuration returned by onBookingComplete
  const [confirmedData, setConfirmedData] = useState<any | null>(null);

  if (!isOpen) return null;

  const handleBookingSuccess = (payload: any) => {
    setConfirmedData(payload);
  };

  const handleFullClose = () => {
    setConfirmedData(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-[95vw] h-[95vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 flex justify-between items-center bg-blue-500 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">
            {confirmedData ? "Receipt Summary" : "Create New Booking"}
          </h2>
          <button
            onClick={handleFullClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Dynamic Window Container */}
        <div className="flex-1 overflow-auto bg-gray-50 scrollbar-none">
          {confirmedData ? (
            <div className="py-2">
              {/* Deliver the whole animated confirmation view matching the dataset schema */}
              <BookingConfirmation directBookingData={confirmedData} />
              
              {/* Sticky exit button below structural receipt layout */}
              <div className="flex justify-center mt-2 mb-8 print:hidden">
                <button
                  onClick={handleFullClose}
                  className="px-10 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition shadow-md"
                >
                  Done & Close Window
                </button>
              </div>
            </div>
          ) : (
            <ClientBookingWrapper onBookingComplete={handleBookingSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}