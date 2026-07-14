import { useState, useEffect, useCallback, useMemo } from "react";
import { Field, Slot } from "../types";
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

export function getDatesInRange(from: string, to: string): string[] {
  const dates: string[] = [];
  const current = new Date(from + "T00:00:00");
  const end = new Date(to + "T00:00:00");
  if (current > end) return dates;

  while (current <= end) {
    dates.push(toISODate(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function formatTime(t: string) {
  return t.slice(0, 5);
}

type ShiftGroup = {
  shift_id: string;
  shift_name: string;
  slots: Slot[];
};

export function useSlotOverview(onSessionExpired: () => void) {
  const defaultRange = getDefaultRange();
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [dateFrom, setDateFrom] = useState(defaultRange.from);
  const [dateTo, setDateTo] = useState(defaultRange.to);
  const [loading, setLoading] = useState(false);
  const [dates, setDates] = useState<string[]>([]);
  const [rows, setRows] = useState<OverviewSlotRow[]>([]);
  const [cells, setCells] = useState<Record<string, OverviewCell>>({});

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
        onSessionExpired,
      ),
    [getHeaders, onSessionExpired],
  );

  const fetchFields = useCallback(async () => {
    try {
      const res = await post("get_fields");
      const data: Field[] = await res.json();
      setFields(data);
      if (data.length > 0 && !selectedFieldId) {
        setSelectedFieldId(data[0].id);
      }
    } catch (err) {
      console.error("Fetch fields error:", err);
    }
  }, [post, selectedFieldId]);

  const fetchOverview = useCallback(async () => {
    if (!selectedFieldId || !dateFrom || !dateTo) return;
    if (dateFrom > dateTo) return;

    const rangeDates = getDatesInRange(dateFrom, dateTo);
    if (rangeDates.length === 0) return;

    setLoading(true);
    try {
      const results = await Promise.all(
        rangeDates.map(async (date) => {
          const res = await post("get_slots_with_booking_details", {
            p_field_id: selectedFieldId,
            p_booking_date: date,
          });
          const data: ShiftGroup[] = await res.json();
          return { date, data };
        }),
      );

      const shiftColorMap = new Map<string, number>();
      let colorIndex = 0;
      const slotRowMap = new Map<string, OverviewSlotRow>();
      const newCells: Record<string, OverviewCell> = {};

      for (const { date, data } of results) {
        for (const group of data) {
          if (!shiftColorMap.has(group.shift_id)) {
            shiftColorMap.set(group.shift_id, colorIndex++);
          }
          const shiftColorIndex = shiftColorMap.get(group.shift_id)!;

          for (const slot of group.slots) {
            const slotId = slot.slot_id;
            if (!slotRowMap.has(slotId)) {
              slotRowMap.set(slotId, {
                slotId,
                shiftId: group.shift_id,
                shiftName: group.shift_name,
                startTime: formatTime(slot.start_time),
                endTime: formatTime(slot.end_time),
                shiftColorIndex,
              });
            }
            const key = `${slotId}_${date}`;
            newCells[key] = {
              status: slot.status as SlotStatus,
              bookingCode: slot.booking_code ?? null,
              fullName: slot.full_name ?? null,
            };
          }
        }
      }

      const sortedRows = Array.from(slotRowMap.values()).sort((a, b) => {
        if (a.shiftColorIndex !== b.shiftColorIndex) {
          return a.shiftColorIndex - b.shiftColorIndex;
        }
        return a.startTime.localeCompare(b.startTime);
      });

      setDates(rangeDates);
      setRows(sortedRows);
      setCells(newCells);
    } catch (err) {
      console.error("Fetch overview error:", err);
    } finally {
      setLoading(false);
    }
  }, [selectedFieldId, dateFrom, dateTo, post]);

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
