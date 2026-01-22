import { useState, useEffect, useCallback } from "react";
// --- Types ---
import { Slot, Shift, Field } from "../types";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";



export function useSlots() {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  }), []);

  const fetchFields = async () => {
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_fields`, {
        method: "POST",
        headers: getHeaders(),
      });
      const data = await res.json();
      setFields(data);
      if (data.length > 0 && !selectedFieldId) setSelectedFieldId(data[0].id);
    } catch (err) {
      console.error("Fetch fields error:", err);
    }
  };

  const fetchSlots = useCallback(async () => {
    if (!selectedFieldId || !selectedDate) return;
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_slots_with_booking_details`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ p_field_id: selectedFieldId, p_booking_date: selectedDate }),
      });
      const data = await res.json();
      setShifts(data.map((g: any) => ({ shift_id: g.shift_id, shift_name: g.shift_name })));
      setSlots(data.flatMap((group: any) =>
        group.slots.map((slot: any) => ({
          ...slot,
          field_id: selectedFieldId,
          shift_id: group.shift_id,
          type: group.shift_name,
        }))
      ));
    } finally {
      setLoading(false);
    }
  }, [selectedFieldId, selectedDate, getHeaders]);

  useEffect(() => { fetchFields(); }, []);
  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  const handleUpdateShift = async (payload: any) => {
    const res = await fetch(`${BASE_URL}/rest/v1/rpc/update_shift`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) fetchSlots();
    return res;
  };

  const handleAddSlot = async (payload: any) => {
    const res = await fetch(`${BASE_URL}/rest/v1/rpc/add_slot`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(payload),
    });
    if (res.ok) fetchSlots();
    return res;
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure?")) return;
    const res = await fetch(`${BASE_URL}/rest/v1/rpc/delete_slot`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ p_slot_id: slotId }),
    });
    if (res.ok) fetchSlots();
  };

  const handleAddShift = async (shiftData: any) => {
    const res = await fetch(`${BASE_URL}/rest/v1/rpc/add_shift`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(shiftData),
    });
    if (res.ok) fetchSlots();
    return res;
  };

  const handleDeleteShift = async (shiftId: string) => {
    if (!confirm("Delete this shift and all its slots permanently?")) return;
    const res = await fetch(`${BASE_URL}/rest/v1/rpc/delete_shift`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ p_shift_id: shiftId }),
    });
    if (res.ok) fetchSlots();
  };

  const handleToggleMaintenance = async (slot: Slot) => {
    const isMaintenance = slot.status === "maintenance";
    const endpoint = isMaintenance ? "remove_slot_from_maintenance" : "reserve_slot_for_maintenance";
    const body = isMaintenance 
      ? { p_maintenance_id: (slot as any).maintenance_id } 
      : { p_slot_id: slot.slot_id, p_date: selectedDate };

    const res = await fetch(`${BASE_URL}/rest/v1/rpc/${endpoint}`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(body),
    });
    if (res.ok) fetchSlots();
  };

  return {
    fields, selectedFieldId, setSelectedFieldId, selectedDate, setSelectedDate,
    slots, shifts, loading, handleUpdateShift, handleAddSlot, handleDeleteSlot,
    handleAddShift, handleDeleteShift, handleToggleMaintenance, fetchSlots
  };
}