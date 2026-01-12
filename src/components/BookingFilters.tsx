import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useState } from "react";

interface FilterProps {
  search: string;
  setSearch: (val: string) => void;
  bookingDate: string;
  setBookingDate: (val: string) => void;
  fieldFilter: string;
  setFieldFilter: (val: string) => void;
  paymentStatus: string;
  setPaymentStatus: (val: string) => void;
  onClear: () => void;
}

export function BookingFilters({
  search,
  setSearch,
  bookingDate,
  setBookingDate,
  fieldFilter,
  setFieldFilter,
  paymentStatus,
  setPaymentStatus,
  onClear,
}: FilterProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [fieldDropdownOpen, setFieldDropdownOpen] = useState(false);
  const [paymentDropdownOpen, setPaymentDropdownOpen] = useState(false);

  const fields = ["All Fields", "Football", "Cricket", "Badminton"];
  const payments = ["All Payments", "fully_paid", "partially_paid"];

  return (
    <div className="bg-white rounded-xl p-4 border space-y-4 shadow-sm">
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-8 -translate-y-1/2 w-5 h-5 text-gray-400" />
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
              {fieldFilter || "All Fields"} <ChevronDown className="w-4 h-4" />
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
              {paymentStatus ? paymentStatus.replace("_", " ") : "All Payments"}{" "}
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
            onClick={onClear}
            className="px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors"
          >
            <X className="w-4 h-4" /> Clear All
          </button>
        </div>
      )}
    </div>
  );
}
