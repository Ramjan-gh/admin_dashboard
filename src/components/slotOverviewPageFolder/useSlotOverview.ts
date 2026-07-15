import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { Field } from "../types";
import { authFetch } from "../authutils";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

export type SlotStatus = "available" | "booked" | "maintenance";

export type OverviewSlotRow = {
  slotId: string;
  shiftId: string;
  shiftName: string;
  startTime: string;
  endTime: string;
  shiftColorIndex: number;
};

export type OverviewCell = {
  status: SlotStatus;
  bookingCode: string | null;
  fullName: string | null;
  price?: number;
};

interface ApiSlotDate {
  date: string;
  price: number;
  status: SlotStatus;
  full_name: string | null;
  booking_code: string | null;
  maintenance_id: string | null;
}

interface ApiSlot {
  slot_id: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  dates: ApiSlotDate[];
}

type ShiftGroup = {
  shift_id: string;
  shift_name: string;
  slots: ApiSlot[];
};

function addMonths(date: Date, months: number): Date {
  const result = new Date(date);
  result.setMonth(result.getMonth() + months);
  return result;
}

function toISODate(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDefaultRange() {
  const from = new Date();
  const to = addMonths(from, 1);
  return { from: toISODate(from), to: toISODate(to) };
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

export function useSlotOverview(onSessionExpired: () => void) {
  // Computed once; only used as the initial useState value below.
  const defaultRange = useMemo(() => getDefaultRange(), []);

  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [dateFrom, setDateFrom] = useState(defaultRange.from);
  const [dateTo, setDateTo] = useState(defaultRange.to);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const [rows, setRows] = useState<OverviewSlotRow[]>([]);
  const [cells, setCells] = useState<Record<string, OverviewCell>>({});

  // Keep the latest onSessionExpired without letting it change `post`'s
  // identity on every render (callers often pass an inline function).
  const onSessionExpiredRef = useRef(onSessionExpired);
  useEffect(() => {
    onSessionExpiredRef.current = onSessionExpired;
  }, [onSessionExpired]);

  const getHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    }),
    [],
  );

  const post = useCallback(
    (path: string, body?: Record<string, unknown>) =>
      authFetch(
        `${BASE_URL}/rest/v1/rpc/${path}`,
        {
          method: "POST",
          headers: getHeaders(),
          body: body ? JSON.stringify(body) : undefined,
        },
        () => onSessionExpiredRef.current(),
      ),
    [getHeaders],
  );

  const fetchFields = useCallback(async () => {
    try {
      const res = await post("get_fields");
      const data: Field[] = await res.json();
      setFields(data);
      // Functional update: only fill in a default if nothing is selected yet,
      // without needing selectedFieldId as a dependency of this callback.
      setSelectedFieldId((current) => current || (data[0]?.id ?? ""));
    } catch (err) {
      console.error("Fetch fields error:", err);
    }
  }, [post]);

  const fetchOverview = useCallback(async () => {
    if (!selectedFieldId || !dateFrom || !dateTo) return;
    if (dateFrom > dateTo) return;

    setLoading(true);
    try {
      const res = await post("get_slots_with_booking_details", {
        p_field_id: selectedFieldId,
        p_start_date: dateFrom,
        p_end_date: dateTo,
      });
      const data: ShiftGroup[] = await res.json();

      const dateSet = new Set<string>();
      const newRows: OverviewSlotRow[] = [];
      const newCells: Record<string, OverviewCell> = {};

      data.forEach((group, shiftColorIndex) => {
        group.slots.forEach((slot) => {
          newRows.push({
            slotId: slot.slot_id,
            shiftId: group.shift_id,
            shiftName: group.shift_name,
            startTime: formatTime(slot.start_time),
            endTime: formatTime(slot.end_time),
            shiftColorIndex,
          });

          slot.dates.forEach((d) => {
            dateSet.add(d.date);
            newCells[`${slot.slot_id}_${d.date}`] = {
              status: d.status,
              bookingCode: d.booking_code,
              fullName: d.full_name,
              price: d.price,
            };
          });
        });
      });

      setDates(Array.from(dateSet).sort());
      setRows(newRows);
      setCells(newCells);
    } catch (err) {
      console.error("Fetch overview error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedFieldId, dateFrom, dateTo, post]);

  // Fields only need to be fetched once on mount now that `post` and
  // `fetchFields` no longer change identity on every field selection.
  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  useEffect(() => {
    fetchOverview();
  }, [fetchOverview]);

  const selectedField = useMemo(
    () => fields.find((f) => f.id === selectedFieldId) ?? null,
    [fields, selectedFieldId],
  );

  return {
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
    refresh: fetchOverview,
  };
}