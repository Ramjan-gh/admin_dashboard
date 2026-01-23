import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { toast } from "sonner";
import { Organization, Holiday, Discount } from "../types";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

// --- Interfaces for Form States ---
interface NewHolidayState {
  id?: string; // Presence of ID determines Edit vs Add
  p_date: string;
  p_is_open: boolean;
  p_notes: string;
}

interface NewDiscountState {
  id?: string; // Presence of ID determines Edit vs Add
  p_code: string;
  p_discount_type: "percentage" | "fixed";
  p_discount_value: string;
  p_valid_from: string;
  p_valid_until: string;
  p_max_uses: number | null;
  p_is_active: boolean;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

export function useSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannerLoading, setBannerLoading] = useState(false);

  // Data States
  const [orgData, setOrgData] = useState<Organization | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [banners, setBanners] = useState<{ id: any; file_url: string; media_type: string }[]>([]);

  // Initial States (for resetting forms)
  const initialHoliday: NewHolidayState = { p_date: "", p_is_open: false, p_notes: "" };
  const initialDiscount: NewDiscountState = {
    p_code: "",
    p_discount_type: "percentage",
    p_discount_value: "",
    p_valid_from: "",
    p_valid_until: "",
    p_max_uses: null,
    p_is_active: true,
  };

  const [newHoliday, setNewHoliday] = useState<NewHolidayState>(initialHoliday);
  const [newDiscount, setNewDiscount] = useState<NewDiscountState>(initialDiscount);

  const getHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
  }), []);

  const fetchBanners = useCallback(async () => {
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_banners`, { headers: getHeaders() });
      if (res.ok) setBanners(await res.json());
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  }, [getHeaders]);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getHeaders();
      const [orgRes, scheduleRes, discountRes] = await Promise.all([
        fetch(`${BASE_URL}/rest/v1/rpc/get_organization`, { headers }).then(res => res.json()),
        fetch(`${BASE_URL}/rest/v1/rpc/get_business_schedule`, { headers }).then(res => res.json()),
        fetch(`${BASE_URL}/rest/v1/rpc/get_discount_codes`, { headers }).then(res => res.json()),
      ]);

      if (orgRes && orgRes[0]) setOrgData(orgRes[0]);
      if (Array.isArray(scheduleRes)) setHolidays(scheduleRes);
      if (Array.isArray(discountRes)) setDiscounts(discountRes);
      await fetchBanners();
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }, [getHeaders, fetchBanners]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // --- ORGANIZATION SETTINGS ---
  const handleUpdateOrg = async () => {
    if (!orgData) return;
    try {
      const response = await fetch(`${BASE_URL}/rest/v1/rpc/update_organization`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          p_name: orgData.name,
          p_description: orgData.description,
          p_logo_url: orgData.logo_url,
          p_emails: Array.isArray(orgData.emails) ? orgData.emails : orgData.emails.split(",").map(e => e.trim()),
          p_phone_numbers: Array.isArray(orgData.phone_numbers) ? orgData.phone_numbers : orgData.phone_numbers.split(",").map(p => p.trim()),
          p_address_text: orgData.address_text,
          p_address_google_maps_url: orgData.address_google_maps_url,
          p_facebook_url: orgData.facebook_url,
          p_instagram_url: orgData.instagram_url,
          p_tiktok_url: orgData.tiktok_url,
          p_whatsapp_url: orgData.whatsapp_url,
        }),
      });
      if (response.ok) {
        setHasChanges(false);
        toast.success("Organization updated successfully");
        fetchAllData();
      }
    } catch (error) {
      toast.error("Failed to update organization");
    }
  };

  // --- BUSINESS SCHEDULE / HOLIDAYS ---
  const handleAddSchedule = async () => {
    if (!newHoliday.p_date) return toast.error("Date is required");
    if (!newHoliday.p_notes?.trim()) return toast.error("Note cannot be empty");

    try {
      const isEditing = !!newHoliday.id;
      // Using update_business_schedule for edits, add_business_schedule for new
      const rpcName = isEditing ? 'update_business_schedule' : 'add_business_schedule';
      
      const payload = isEditing 
        ? { p_id: newHoliday.id, p_date: newHoliday.p_date, p_is_open: newHoliday.p_is_open, p_notes: newHoliday.p_notes }
        : { p_date: newHoliday.p_date, p_is_open: newHoliday.p_is_open, p_notes: newHoliday.p_notes };

      const res = await fetch(`${BASE_URL}/rest/v1/rpc/${rpcName}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        toast.success(isEditing ? "Schedule updated!" : "Schedule added successfully");
        setNewHoliday(initialHoliday);
        fetchAllData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save schedule");
      }
    } catch (error) {
      toast.error("A network error occurred.");
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!window.confirm("Delete this schedule?")) return;
    const res = await fetch(`${BASE_URL}/rest/v1/rpc/delete_business_schedule`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ p_id: id }),
    });
    if (res.ok) {
      toast.success("Schedule deleted");
      fetchAllData();
    }
  };

  // --- DISCOUNT CODES ---
  const handleAddDiscount = async () => {
    if (!newDiscount.p_code.trim()) return toast.error("Discount code is required");
    try {
      const isEditing = !!newDiscount.id;
      const rpcName = isEditing ? 'update_discount' : 'add_discount';

      const payload = {
        ...(isEditing && { p_id: newDiscount.id }),
        p_code: newDiscount.p_code,
        p_discount_type: newDiscount.p_discount_type,
        p_discount_value: parseFloat(newDiscount.p_discount_value),
        p_valid_from: newDiscount.p_valid_from,
        p_valid_until: newDiscount.p_valid_until,
        p_max_uses: newDiscount.p_max_uses,
        p_is_active: newDiscount.p_is_active
      };

      const res = await fetch(`${BASE_URL}/rest/v1/rpc/${rpcName}`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const result = Array.isArray(data) ? data[0] : data;

      if (!res.ok || result?.success === false) {
        toast.error(result?.message || "Failed to save discount.");
        return;
      }

      toast.success(isEditing ? "Discount updated!" : "Discount added successfully!");
      setNewDiscount(initialDiscount);
      fetchAllData();
    } catch (error) {
      toast.error("A network error occurred.");
    }
  };

  const handleToggleDiscountStatus = async (id: string, currentStatus: boolean): Promise<ApiResponse> => {
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/update_discount`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ p_id: id, p_is_active: !currentStatus }),
      });
      
      if (res.ok) {
        fetchAllData();
        return { success: true, message: "Status updated successfully" };
      }
      return { success: false, message: "Failed to update status" };
    } catch (error) {
      return { success: false, message: "Network error occurred" };
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    if (!window.confirm("Delete this discount code?")) return;
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/delete_discount`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ p_id: id }),
      });
      if (res.ok) {
        toast.success("Discount deleted");
        fetchAllData();
      }
    } catch (error) {
      toast.error("Error deleting discount");
    }
  };

  // --- MEDIA UPLOADS ---
  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orgData) return;
    const accessToken = localStorage.getItem("sb-access-token");
    if (!accessToken) return toast.error("Login required");

    setLoading(true);
    const fileName = `logo-${Date.now()}.${file.name.split(".").pop()}`;
    const uploadUrl = `${BASE_URL}/storage/v1/object/media/logo/${fileName}`;

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, Authorization: `Bearer ${accessToken}`, "Content-Type": file.type },
        body: file,
      });
      if (response.ok) {
        const publicUrl = `${BASE_URL}/storage/v1/object/media/logo/${fileName}`;
        setOrgData({ ...orgData, logo_url: publicUrl });
        setHasChanges(true);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBannerUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const accessToken = localStorage.getItem("sb-access-token");
    if (!accessToken) return toast.error("Login required");

    setBannerLoading(true);
    const fileName = `banner-${Date.now()}.${file.name.split(".").pop()}`;
    const uploadUrl = `${BASE_URL}/storage/v1/object/media/banners/${fileName}`;

    try {
      const storageRes = await fetch(uploadUrl, {
        method: "POST",
        headers: { 
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, 
          Authorization: `Bearer ${accessToken}`, 
          "Content-Type": file.type 
        },
        body: file,
      });

      if (!storageRes.ok) throw new Error("Failed to upload image to storage");

      const publicUrl = `${BASE_URL}/storage/v1/object/public/media/banners/${fileName}`;
      const dbRes = await fetch(`${BASE_URL}/rest/v1/rpc/add_media`, {
        method: "POST",
        headers: { ...getHeaders(), Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ 
          p_use_case: "banner", 
          p_media_type: "image", 
          p_file_url: publicUrl 
        }),
      });

      if (dbRes.ok) {
        toast.success("Banner uploaded successfully!");
        fetchBanners();
      } else {
        throw new Error("Failed to save banner details to database");
      }
    } catch (error: any) {
      toast.error(error.message || "An error occurred during banner upload");
    } finally {
      setBannerLoading(false);
    }
  };

  const handleDeleteBanner = async (banner: { id: any; file_url: string }): Promise<void> => {
    if (!confirm("Are you sure you want to delete this banner?")) return;
    
    const accessToken = localStorage.getItem("sb-access-token");
    if (!accessToken) {
      toast.error("Login required");
      return;
    }

    try {
      const dbRes = await fetch(`${BASE_URL}/rest/v1/rpc/delete_media_by_id`, {
        method: "POST",
        headers: { ...getHeaders(), Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ p_media_id: banner.id }),
      });

      if (dbRes.ok) {
        setBanners((prev) => prev.filter((b) => b.id !== banner.id));
        toast.success("Banner deleted successfully");
      } else {
        const errorData = await dbRes.json();
        toast.error(errorData.message || "Failed to delete banner");
      }
    } catch (error) {
      toast.error("Failed to delete banner");
    }
  };

  return {
    activeTab, setActiveTab, hasChanges, setHasChanges, loading, orgData, setOrgData,
    holidays, discounts, newHoliday, setNewHoliday, newDiscount, setNewDiscount,
    banners, bannerLoading, handleUpdateOrg, handleAddSchedule, handleDeleteSchedule,
    handleAddDiscount, handleDeleteDiscount, handleToggleDiscountStatus, handleLogoUpload,
    handleBannerUpload, handleDeleteBanner
  };
}