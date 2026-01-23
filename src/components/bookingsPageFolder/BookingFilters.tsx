import { Search, Filter, X, ChevronDown, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

// Types
import { FilterProps } from "../types";

// Define a local interface for the Field object based on your API response
interface Field {
  id: string;
  name: string;
}

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

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

  // State for dynamic fields
  const [fields, setFields] = useState<Field[]>([]);
  const [isLoadingFields, setIsLoadingFields] = useState(false);
  const [fetchError, setFetchError] = useState(false);

  const payments = ["All Payments", "fully_paid", "partially_paid"];

  // Fetch fields from API with Auth Headers
  useEffect(() => {
    const fetchFields = async () => {
      setIsLoadingFields(true);
      setFetchError(false);
      try {
        const response = await fetch(`${BASE_URL}/rest/v1/rpc/get_fields`, {
          method: "POST", // RPC calls in PostgREST/Supabase usually require POST
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        setFields(data);
      } catch (error) {
        console.error("Error fetching fields:", error);
        setFetchError(true);
      } finally {
        setIsLoadingFields(false);
      }
    };

    fetchFields();
  }, []);

  // Helper to find the display name of the selected field ID
  const selectedFieldName =
    fields.find((f) => f.id === fieldFilter)?.name || "All Fields";

  return (
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
          {/* Date Filter */}
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            className="border p-2 rounded-lg outline-none focus:ring-2 focus:ring-purple-100"
          />

          {/* Dynamic Fields Dropdown */}
          <div className="relative">
            <button
              onClick={() => setFieldDropdownOpen(!fieldDropdownOpen)}
              disabled={isLoadingFields}
              className="flex items-center gap-4 px-4 py-2 border rounded-lg bg-white min-w-[160px] justify-between disabled:opacity-50"
            >
              <span className="truncate max-w-[120px]">
                {isLoadingFields ? "Loading..." : selectedFieldName}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${fieldDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {fieldDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 bg-white border rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {fetchError ? (
                  <div className="p-4 text-xs text-red-500 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" /> Failed to load fields
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => {
                        setFieldFilter("");
                        setFieldDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors border-b sticky top-0 bg-white font-medium"
                    >
                      All Fields
                    </button>
                    {fields.map((field) => (
                      <button
                        key={field.id}
                        onClick={() => {
                          setFieldFilter(field.name);
                          setFieldDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-purple-50 transition-colors text-sm"
                      >
                        {field.name}
                      </button>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Payment Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => setPaymentDropdownOpen(!paymentDropdownOpen)}
              className="flex items-center gap-4 px-4 py-2 border rounded-lg bg-white min-w-[160px] justify-between"
            >
              <span className="capitalize">
                {paymentStatus
                  ? paymentStatus.replace("_", " ")
                  : "All Payments"}
              </span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${paymentDropdownOpen ? "rotate-180" : ""}`}
              />
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
            className="px-4 py-2 border rounded-lg text-red-600 hover:bg-red-50 flex items-center gap-2 transition-colors ml-auto"
          >
            <X className="w-4 h-4" /> Clear All
          </button>
        </div>
      )}
    </div>
  );
}
