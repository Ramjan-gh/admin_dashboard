import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { Slot, Shift, Field } from "../types";
import { authFetch } from ".././Authutils";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

export function useSlots(onSessionExpired: () => void) {
  const [fields, setFields] = useState<Field[]>([]);
  const [selectedFieldId, setSelectedFieldId] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);

  const getHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }), []);

  // Shorthand for POST via authFetch
  const post = useCallback((path: string, body?: any) =>
    authFetch(
      `${BASE_URL}/rest/v1/rpc/${path}`,
      { method: "POST", headers: getHeaders(), body: body ? JSON.stringify(body) : undefined },
      onSessionExpired,
    ),
    [getHeaders, onSessionExpired]);

  const fetchFields = useCallback(async () => {
    try {
      const res = await post("get_fields");
      const data = await res.json();
      setFields(data);
      if (data.length > 0 && !selectedFieldId) setSelectedFieldId(data[0].id);
    } catch (err) {
      console.error("Fetch fields error:", err);
    }
  }, [post, selectedFieldId]);

  const fetchSlots = useCallback(async () => {
    if (!selectedFieldId || !selectedDate) return;
    setLoading(true);
    try {
      const res = await post("get_slots_with_booking_details", {
        p_field_id: selectedFieldId,
        p_booking_date: selectedDate,
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
  }, [selectedFieldId, selectedDate, post]);

  useEffect(() => { fetchFields(); }, [fetchFields]);
  useEffect(() => { fetchSlots(); }, [fetchSlots]);

  // --- API Handlers ---

  const handleUpdateShift = async (payload: any) => {
    const execution = (async () => {
      const res = await post("update_shift", payload);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to update shift");
      fetchSlots();
      return data;
    })();
    toast.promise(execution, {
      loading: "Updating shift...",
      success: (data) => data.message || "Shift updated successfully",
      error: (err) => err.message,
    });
    return execution;
  };

  const handleAddSlot = async (payload: any) => {
    const execution = (async () => {
      const res = await post("add_slot", payload);
      const data = await res.json();
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to add slot");
      fetchSlots();
      return data;
    })();
    toast.promise(execution, {
      loading: "Adding slot...",
      success: (data) => data.message || "Slot added successfully",
      error: (err) => err.message,
    });
    return execution;
  };

  const handleDeleteSlot = async (slotId: string) => {
    if (!confirm("Are you sure?")) return;
    const execution = (async () => {
      const res = await post("delete_slot", { p_slot_id: slotId });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to delete slot");
      fetchSlots();
      return data;
    })();
    toast.promise(execution, {
      loading: "Deleting slot...",
      success: (data) => data.message || "Slot deleted",
      error: (err) => err.message,
    });
    return execution;
  };

  const handleAddShift = async (shiftData: any) => {
    const execution = (async () => {
      const res = await post("add_shift", shiftData);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to add shift");
      fetchSlots();
      return data;
    })();
    toast.promise(execution, {
      loading: "Creating new shift...",
      success: (data) => data.message || "Shift created successfully",
      error: (err) => err.message,
    });
    return execution;
  };

  const handleDeleteShift = async (shiftId: string) => {
    if (!confirm("Delete this shift and all its slots permanently?")) return;
    const execution = (async () => {
      const res = await post("delete_shift", { p_shift_id: shiftId });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Failed to delete shift");
      fetchSlots();
      return data;
    })();
    toast.promise(execution, {
      loading: "Deleting shift...",
      success: (data) => data.message || "Shift deleted successfully",
      error: (err) => err.message,
    });
    return execution;
  };

  const handleToggleMaintenance = async (slot: Slot) => {
    const isMaintenance = slot.status === "maintenance";
    const execution = (async () => {
      const endpoint = isMaintenance
        ? "remove_slot_from_maintenance"
        : "reserve_slot_for_maintenance";
      const body = isMaintenance
        ? { p_maintenance_id: (slot as any).maintenance_id }
        : { p_slot_id: slot.slot_id, p_date: selectedDate };
      const res = await post(endpoint, body);
      const data = await res.json().catch(() => ({}));
      if (!res.ok || data.success === false) throw new Error(data.message || "Maintenance update failed");
      fetchSlots();
      return data;
    })();
    toast.promise(execution, {
      loading: isMaintenance ? "Removing from maintenance..." : "Setting maintenance...",
      success: (data) => data.message || "Status updated",
      error: (err) => err.message,
    });
    return execution;
  };

  return {
    fields, selectedFieldId, setSelectedFieldId, selectedDate, setSelectedDate,
    slots, shifts, loading, handleUpdateShift, handleAddSlot, handleDeleteSlot,
    handleAddShift, handleDeleteShift, handleToggleMaintenance, fetchSlots,
  };
}