import { Calendar, RefreshCw } from "lucide-react";
import { useSlotOverview } from "./useSlotOverview";
import { FieldSelectorGrid } from "./FieldSelectorGrid";
import { SlotOverviewGrid } from "./SlotOverviewGrid";

type Props = {
  onSessionExpired: () => void;
};

export function SlotOverviewPage({ onSessionExpired }: Props) {
  const {
    fields,
    selectedFieldId,
    setSelectedFieldId,
    selectedField,
    dateFrom,
    setDateFrom,
    dateTo,
    setDateTo,
    dates,
    rows,
    cells,
    loading,
    refresh,
  } = useSlotOverview(onSessionExpired);

  const handleDateFromChange = (value: string) => {
    setDateFrom(value);
    if (value > dateTo) setDateTo(value);
  };

  const handleDateToChange = (value: string) => {
    setDateTo(value);
    if (value < dateFrom) setDateFrom(value);
  };

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Slot Overview
          </h1>
          <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
            Quick view of booked, available & maintenance slots
            {selectedField ? ` — ${selectedField.name}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 active:scale-95 transition-all disabled:opacity-50 w-full sm:w-auto touch-manipulation"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {/* Date range */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">Date Range</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">From</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => handleDateFromChange(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm touch-manipulation"
              />
            </div>
          </label>
          <label className="block">
            <span className="text-xs text-gray-500 mb-1 block">To</span>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                type="date"
                value={dateTo}
                onChange={(e) => handleDateToChange(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 w-full text-sm touch-manipulation"
              />
            </div>
          </label>
        </div>
        <p className="text-[11px] sm:text-xs text-gray-400 mt-2">
          {dates.length} day{dates.length !== 1 ? "s" : ""} selected
        </p>
      </div>

      {/* Field selector */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm mb-4">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Select Field
        </h2>
        <FieldSelectorGrid
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelect={setSelectedFieldId}
        />
      </div>

      {/* Grid */}
      <div className="bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm">
        <h2 className="text-sm font-semibold text-gray-700 mb-3">
          Availability Sheet
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2" />
            <p className="text-sm">Loading slot data...</p>
          </div>
        ) : (
          <SlotOverviewGrid dates={dates} rows={rows} cells={cells} />
        )}
      </div>
    </div>
  );
}
