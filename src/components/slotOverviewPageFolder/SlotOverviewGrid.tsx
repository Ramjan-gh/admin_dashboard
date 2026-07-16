import { Fragment, useMemo } from "react";
import { OverviewCell, OverviewSlotRow } from "./useSlotOverview";

const SHIFT_ROW_BG = [
  "bg-blue-50/80",
  "bg-amber-50/80",
  "bg-violet-50/80",
  "bg-teal-50/80",
  "bg-rose-50/80",
  "bg-indigo-50/80",
];

const STATUS_STYLES: Record<
  string,
  { cell: string; dot: string; label: string; short: string }
> = {
  available: {
    cell: "bg-green-100 border-green-200 text-green-800",
    dot: "bg-green-500",
    label: "Available",
    short: "A",
  },
  booked: {
    cell: "bg-orange-100 border-orange-200 text-orange-800",
    dot: "bg-orange-500",
    label: "Booked",
    short: "B",
  },
  maintenance: {
    cell: "bg-red-100 border-red-200 text-red-800",
    dot: "bg-red-500",
    label: "Maintenance",
    short: "M",
  },
};

type Props = {
  dates: string[];
  rows: OverviewSlotRow[];
  cells: Record<string, OverviewCell>;
};

function formatDateHeader(date: string, compact: boolean) {
  // Safe ISO parsing fallback for cross-browser engine safety
  const normalizedDate = date.includes("T") ? date : `${date}T00:00:00`;
  const d = new Date(normalizedDate);
  if (isNaN(d.getTime())) return date;

  if (compact) {
    return d.toLocaleDateString("en-US", { weekday: "narrow", day: "numeric" });
  }
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function SlotOverviewGrid({ dates, rows, cells }: Props) {
  const groupedRows = useMemo(() => {
    const groups: { shiftId: string; shiftName: string; colorIndex: number; slots: OverviewSlotRow[] }[] = [];
    let current: (typeof groups)[number] | null = null;

    for (const row of rows) {
      if (!current || current.shiftId !== row.shiftId) {
        current = {
          shiftId: row.shiftId,
          shiftName: row.shiftName,
          colorIndex: row.shiftColorIndex,
          slots: [],
        };
        groups.push(current);
      }
      current.slots.push(row);
    }
    return groups;
  }, [rows]);

  return (
    <div className="relative">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 mb-3 px-1">
        {Object.entries(STATUS_STYLES).map(([key, style]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs sm:text-sm">
            <span className={`w-2.5 h-2.5 rounded-full ${style.dot}`} />
            <span className="text-gray-600 font-medium">{style.label}</span>
          </div>
        ))}
        <span className="text-xs text-gray-400 hidden sm:inline">
          Scroll horizontally to see more dates
        </span>
      </div>

      {/* Scrollable grid container - ALWAYS stays mounted */}
      <div
        className="overflow-x-auto overflow-y-visible rounded-xl border border-gray-200 bg-white shadow-sm min-h-[200px]"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <table className="border-collapse min-w-full w-max">
          <thead>
            <tr>
              <th
                className="sticky left-0 z-20 bg-gray-100 border-b border-r border-gray-200 px-2 py-2 sm:px-3 sm:py-3 text-left text-[10px] sm:text-xs font-bold text-gray-600 uppercase tracking-wide min-w-[72px] sm:min-w-[100px]"
                style={{ boxShadow: "2px 0 4px -2px rgba(0,0,0,0.1)" }}
              >
                Slot
              </th>
              {dates.map((date) => (
                <th
                  key={date}
                  className="border-b border-r border-gray-200 px-1 py-2 sm:px-2 sm:py-3 text-center text-[10px] sm:text-xs font-semibold text-gray-600 min-w-[44px] sm:min-w-[72px] bg-gray-50"
                >
                  <span className="">{formatDateHeader(date, false)}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* FIX: Render the empty message INSIDE the table grid to protect layout stability */}
            {dates.length === 0 || rows.length === 0 ? (
              <tr>
                <td
                  colSpan={Math.max(dates.length + 1, 2)}
                  className="text-center py-16 text-sm text-gray-400 font-normal"
                >
                  No slots found for this field and date range.
                </td>
              </tr>
            ) : (
              groupedRows.map((group) => (
                <Fragment key={group.shiftId}>
                  <tr>
                    <td
                      colSpan={dates.length + 1}
                      className={`sticky left-0 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200 ${SHIFT_ROW_BG[group.colorIndex % SHIFT_ROW_BG.length]}`}
                    >
                      {group.shiftName}
                    </td>
                  </tr>
                  {group.slots.map((row) => (
                    <tr
                      key={row.slotId}
                      className={SHIFT_ROW_BG[row.shiftColorIndex % SHIFT_ROW_BG.length]}
                    >
                      <td
                        className="sticky left-0 z-10 border-b border-r border-gray-200 px-2 py-1.5 sm:px-3 sm:py-2 text-[10px] sm:text-xs font-semibold text-gray-800 whitespace-nowrap bg-inherit"
                        style={{ boxShadow: "2px 0 4px -2px rgba(0,0,0,0.08)" }}
                      >
                        <span>
                          {row.startTime} – {row.endTime}
                        </span>
                      </td>
                      {dates.map((date) => {
                        const cell = cells[`${row.slotId}_${date}`];
                        const status = cell?.status ?? "available";
                        const style = STATUS_STYLES[status] ?? STATUS_STYLES.available;
                        const title = cell?.fullName
                          ? `${style.label} — ${cell.fullName}${cell.bookingCode ? ` (${cell.bookingCode})` : ""}`
                          : style.label;

                        return (
                          <td
                            key={date}
                            className="border-b border-gray-100 p-0.5 sm:p-1"
                            title={title}
                          >
                            <div
                              className={`
                                flex items-center justify-center rounded-md border
                                min-h-[32px] sm:min-h-[40px] w-full
                                text-[9px] sm:text-[10px] font-bold uppercase
                                ${style.cell}
                              `}
                            >
                              <span className="sm:hidden">{style.short}</span>
                              <span className="hidden sm:inline truncate px-0.5">
                                {status === "booked" && cell?.bookingCode
                                  ? cell.bookingCode.slice(-4)
                                  : style.label.slice(0, 4)}
                              </span>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </Fragment>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}