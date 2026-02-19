import { X } from "lucide-react";
import ClientBookingWrapper from "./clientBooking/src/ClientBookingWrapper";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function BookingPopup({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-[95vw] h-[95vh] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 flex-shrink-0">
          <h2 className="text-xl font-bold text-white">Create New Booking</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
        </div>

        {/* Client Booking App */}
        <div className="flex-1 overflow-auto">
          <ClientBookingWrapper onBookingComplete={onClose} />
        </div>
      </div>
    </div>
  );
}
