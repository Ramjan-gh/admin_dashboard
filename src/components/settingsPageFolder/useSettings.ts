import { useState, useEffect, useCallback, ChangeEvent } from "react";
import { toast } from "sonner";
import { Organization, Holiday, Discount } from "../types";
import { authFetch } from ".././authutils";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";
const TIERS_TABLE_URL = `${BASE_URL}/rest/v1/membership_tiers`;

const ORG_TABLE_URL = `${BASE_URL}/rest/v1/rpc/get_organization`;
const SCHEDULE_TABLE_URL = `${BASE_URL}/rest/v1/business_schedule`;
const DISCOUNTS_TABLE_URL = `${BASE_URL}/rest/v1/rpc/get_discount_codes`;
const MEDIA_TABLE_URL = `${BASE_URL}/rest/v1/media`; // Added for custom banner bypassing

// --- Interfaces ---

interface NewHolidayState {
  id?: string;
  p_date: string;
  p_is_open: boolean;
  p_notes: string;
}

interface NewDiscountState {
  id?: string;
  p_code: string;
  p_discount_type: "percentage" | "fixed";
  p_discount_value: string;
  p_valid_from: string;
  p_valid_until: string;
  p_max_uses: number | null;
  p_is_active: boolean;
}

export type MembershipTier = {
  id: string;
  name: string;
  min_points: number;
  discount_percentage: number;
  points_multiplier: number;
  badge_color: string;
  description: string;
  reward_interval: number | null;
};

interface ApiResponse {
  success: boolean;
  message: string;
}

interface MediaItem {
  id: string | number;
  file_url: string;
  media_type: string;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useSettings(onSessionExpired: () => void) {
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [galleryLoading, setGalleryLoading] = useState(false);
  const [tiersLoading, setTiersLoading] = useState(false);
  const [gallery, setGallery] = useState<MediaItem[]>([]);

  const [orgData, setOrgData] = useState<Organization | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [banners, setBanners] = useState<MediaItem[]>([]);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);

  const initialHoliday: NewHolidayState = { p_date: "", p_is_open: false, p_notes: "" };
  const initialDiscount: NewDiscountState = {
    p_code: "", p_discount_type: "percentage", p_discount_value: "",
    p_valid_from: "", p_valid_until: "", p_max_uses: null, p_is_active: true,
  };

  const [newHoliday, setNewHoliday] = useState<NewHolidayState>(initialHoliday);
  const [newDiscount, setNewDiscount] = useState<NewDiscountState>(initialDiscount);

  // Shorthand helpers
  const getBaseHeaders = useCallback(() => ({
    "Content-Type": "application/json",
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
  }), []);

  const rpc = useCallback((method: string, body?: any) =>
    authFetch(
      `${BASE_URL}/rest/v1/rpc/${method}`,
      { method: "POST", headers: getBaseHeaders(), body: body ? JSON.stringify(body) : undefined },
      onSessionExpired,
    ),
    [getBaseHeaders, onSessionExpired]);

  const storagePost = useCallback((path: string, file: File) =>
    authFetch(
      `${BASE_URL}/storage/v1/object/media/${path}`,
      { method: "POST", headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY, "Content-Type": file.type }, body: file },
      onSessionExpired,
    ),
    [onSessionExpired]);

  const storageDelete = useCallback((path: string) =>
    authFetch(
      `${BASE_URL}/storage/v1/object/media/${path}`,
      { method: "DELETE", headers: { apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } },
      onSessionExpired,
    ),
    [onSessionExpired]);

  // --- Fetchers ---

  // Bypassed RPC logic for Banners
  const fetchBanners = useCallback(async () => {
    try {
      const res = await authFetch(
        `${MEDIA_TABLE_URL}?use_case=eq.banner&select=id,file_url,media_type&order=created_at.desc`,
        { method: "GET", headers: getBaseHeaders() },
        onSessionExpired,
      );
      if (res.ok) setBanners(await res.json());
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  }, [getBaseHeaders, onSessionExpired]);

  const fetchGallery = useCallback(async () => {
    try {
      const res = await authFetch(
        `${BASE_URL}/rest/v1/media?use_case=eq.gallery&select=id,file_url,media_type&order=created_at.desc`,
        { method: "GET", headers: getBaseHeaders() },
        onSessionExpired,
      );
      if (res.ok) setGallery(await res.json());
    } catch (err) {
      console.error("Error fetching gallery:", err);
    }
  }, [getBaseHeaders, onSessionExpired]);

  const fetchMembershipTiers = useCallback(async () => {
    try {
      // 1. Strip out ALL order query parameters from the network layer completely. 
      // This strips the sorting command away from PostgREST so it cannot throw a 400 error.
      const res = await authFetch(
        `${BASE_URL}/rest/v1/membership_tiers?select=*`, 
        { 
          method: "GET", 
          headers: getBaseHeaders() 
        },
        onSessionExpired
      );
      
      if (res.ok) {
        const data = await res.json();
        
        const mappedData = Array.isArray(data) ? data.map((tier: any) => ({
          id: tier.id ?? tier.p_id,
          name: tier.name ?? tier.p_name,
          min_points: Number(tier.min_points ?? tier.p_min_points ?? 0),
          discount_percentage: Number(tier.discount_percentage ?? tier.p_discount_percentage ?? 0),
          points_multiplier: Number(tier.points_multiplier ?? tier.p_points_multiplier ?? 1),
          badge_color: tier.badge_color ?? tier.p_badge_color ?? "#6B46C1",
          description: tier.description ?? tier.p_description ?? "",
          reward_interval: tier.reward_interval !== undefined ? tier.reward_interval : (tier.p_reward_interval ?? null),
        })) : [];

        // 2. Perform a safe client-side fallback sort directly on the mapped array values
        const safelySortedData = mappedData.sort((a, b) => a.min_points - b.min_points);

        setTiers(safelySortedData);
      } else {
        const errLog = await res.json().catch(() => null);
        console.error("Supabase direct query rejection payload:", errLog);
      }
    } catch (err) {
      console.error("Error fetching membership tiers:", err);
    }
  }, [getBaseHeaders, onSessionExpired]);
  

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Complete RPC bypass architecture
      const [orgRes, scheduleRes, discountRes] = await Promise.all([
        authFetch(`${ORG_TABLE_URL}?select=*&limit=1`, { method: "GET", headers: getBaseHeaders() }, onSessionExpired).then((r) => r.json()),
        authFetch(`${SCHEDULE_TABLE_URL}?select=*`, { method: "GET", headers: getBaseHeaders() }, onSessionExpired).then((r) => r.json()),
        authFetch(`${DISCOUNTS_TABLE_URL}?select=*`, { method: "GET", headers: getBaseHeaders() }, onSessionExpired).then((r) => r.json()),
      ]);

      if (orgRes) setOrgData(orgRes);
      if (Array.isArray(scheduleRes)) setHolidays(scheduleRes);
      if (Array.isArray(discountRes)) setDiscounts(discountRes);

      await Promise.all([
        fetchBanners(),
        fetchGallery(),
        fetchMembershipTiers()
      ]);
    } catch (error) {
      console.error("Error fetching settings via raw tables:", error);
    } finally {
      setLoading(false);
    }
  }, [getBaseHeaders, onSessionExpired, fetchBanners, fetchGallery, fetchMembershipTiers]);

  useEffect(() => { fetchAllData(); }, [fetchAllData]);

  // --- Organization ---

  const handleUpdateOrg = async () => {
    if (!orgData) return;
    try {
      const response = await rpc("update_organization", {
        p_name: orgData.name,
        p_description: orgData.description,
        p_logo_url: orgData.logo_url,
        p_emails: Array.isArray(orgData.emails) ? orgData.emails : orgData.emails.split(",").map((e) => e.trim()),
        p_phone_numbers: Array.isArray(orgData.phone_numbers) ? orgData.phone_numbers : orgData.phone_numbers.split(",").map((p) => p.trim()),
        p_address_text: orgData.address_text,
        p_address_google_maps_url: orgData.address_google_maps_url,
        p_facebook_url: orgData.facebook_url,
        p_instagram_url: orgData.instagram_url,
        p_tiktok_url: orgData.tiktok_url,
        p_whatsapp_url: orgData.whatsapp_url,
        p_points_exchange_rate: orgData.points_exchange_rate,
      });
      if (response.ok) {
        setHasChanges(false);
        toast.success("Organization updated successfully");
        fetchAllData();
      }
    } catch {
      toast.error("Failed to update organization");
    }
  };

  // --- Holidays / Schedule ---

  const handleAddSchedule = async () => {
    if (!newHoliday.p_date) return toast.error("Date is required");
    if (!newHoliday.p_notes?.trim()) return toast.error("Note cannot be empty");

    try {
      const isEditing = !!newHoliday.id;
      const payload = isEditing
        ? { p_id: newHoliday.id, p_date: newHoliday.p_date, p_is_open: newHoliday.p_is_open, p_notes: newHoliday.p_notes }
        : { p_date: newHoliday.p_date, p_is_open: newHoliday.p_is_open, p_notes: newHoliday.p_notes };

      const res = await rpc(isEditing ? "update_business_schedule" : "add_business_schedule", payload);
      if (res.ok) {
        toast.success(isEditing ? "Schedule updated!" : "Schedule added successfully");
        setNewHoliday(initialHoliday);
        fetchAllData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to save schedule");
      }
    } catch {
      toast.error("A network error occurred.");
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!window.confirm("Delete this schedule?")) return;
    const res = await rpc("delete_business_schedule", { p_id: id });
    if (res.ok) { toast.success("Schedule deleted"); fetchAllData(); }
  };

  // --- Discounts ---

  const handleAddDiscount = async () => {
    if (!newDiscount.p_code.trim()) return toast.error("Discount code is required");
    try {
      const isEditing = !!newDiscount.id;
      const payload = {
        ...(isEditing && { p_id: newDiscount.id }),
        p_code: newDiscount.p_code,
        p_discount_type: newDiscount.p_discount_type,
        p_discount_value: parseFloat(newDiscount.p_discount_value),
        p_valid_from: newDiscount.p_valid_from,
        p_valid_until: newDiscount.p_valid_until,
        p_max_uses: newDiscount.p_max_uses,
        p_is_active: newDiscount.p_is_active,
      };

      const res = await rpc(isEditing ? "update_discount" : "add_discount", payload);
      const data = await res.json();
      const result = Array.isArray(data) ? data[0] : data;

      if (!res.ok || result?.success === false) {
        toast.error(result?.message || "Failed to save discount.");
        return;
      }

      toast.success(isEditing ? "Discount updated!" : "Discount added successfully!");
      setNewDiscount(initialDiscount);
      fetchAllData();
    } catch {
      toast.error("A network error occurred.");
    }
  };

  const handleToggleDiscountStatus = async (id: string, currentStatus: boolean): Promise<ApiResponse> => {
    try {
      const res = await rpc("update_discount", { p_id: id, p_is_active: !currentStatus });
      if (res.ok) { fetchAllData(); return { success: true, message: "Status updated successfully" }; }
      return { success: false, message: "Failed to update status" };
    } catch {
      return { success: false, message: "Network error occurred" };
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    if (!window.confirm("Delete this discount code?")) return;
    try {
      const res = await rpc("delete_discount", { p_id: id });
      if (res.ok) { toast.success("Discount deleted"); fetchAllData(); }
    } catch {
      toast.error("Error deleting discount");
    }
  };

  // --- Points & Tiers Actions ---

  const handleCreateTier = async (tier: Omit<MembershipTier, "id">) => {
    setTiersLoading(true);
    try {
      const dbPayload = {
        name: tier.name || "New Tier",
        min_points: Number(tier.min_points ?? 0) || 0,
        discount_percentage: Number(tier.discount_percentage ?? 0) || 0,
        points_multiplier: Number(tier.points_multiplier ?? 1) || 1,
        badge_color: tier.badge_color || "#6B46C1",
        description: tier.description || "",
        reward_interval: tier.reward_interval,
      };

      const headers = {
        ...getBaseHeaders(),
        "Prefer": "return=representation",
      };

      const res = await authFetch(
        TIERS_TABLE_URL,
        {
          method: "POST",
          headers: headers,
          body: JSON.stringify(dbPayload),
        },
        onSessionExpired
      );
      
      if (res.ok) {
        toast.success("Membership tier created successfully!");
        await fetchMembershipTiers();
      } else {
        const errorJson = await res.json().catch(() => null);
        console.error("🔴 SUPABASE REJECTION REASON:", errorJson);
        toast.error(`Failed to build tier: ${errorJson?.message || "Invalid Data Structure"}`);
      }
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("Network interface breakdown during creation.");
    } finally {
      setTiersLoading(false);
    }
  };

  const handleUpdateTier = async (id: string, updates: Partial<MembershipTier>) => {
    setTiersLoading(true);
    try {
      const dbPayload = {
        discount_percentage: updates.discount_percentage,
        points_multiplier: updates.points_multiplier,
      };

      const res = await authFetch(
        `${TIERS_TABLE_URL}?id=eq.${id}`,
        {
          method: "PATCH",
          headers: getBaseHeaders(),
          body: JSON.stringify(dbPayload),
        },
        onSessionExpired
      );
      if (res.ok) {
        toast.success("Membership tier updated successfully!");
        await fetchMembershipTiers();
      } else {
        toast.error("Failed to adjust tier updates.");
      }
    } catch {
      toast.error("Network interface error occurred during modification.");
    } finally {
      setTiersLoading(false);
    }
  };

  const handleDeleteTier = async (id: string) => {
    setTiersLoading(true);
    try {
      const res = await authFetch(
        `${TIERS_TABLE_URL}?id=eq.${id}`,
        {
          method: "DELETE",
          headers: getBaseHeaders(),
        },
        onSessionExpired
      );
      if (res.ok) {
        toast.success("Membership tier cleared away successfully.");
        await fetchMembershipTiers();
      } else {
        toast.error("Failed to erase tier.");
      }
    } catch {
      toast.error("Network processing failure while deleting.");
    } finally {
      setTiersLoading(false);
    }
  };

  // --- Media Uploads ---

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orgData) return;

    setLoading(true);
    const fileName = `logo-${Date.now()}.${file.name.split(".").pop()}`;
    try {
      const response = await storagePost(`logo/${fileName}`, file);
      if (response.ok) {
        const publicUrl = `${BASE_URL}/storage/v1/object/public/media/logo/${fileName}`;
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

    setBannerLoading(true);
    const fileName = `banner-${Date.now()}.${file.name.split(".").pop()}`;
    try {
      const storageRes = await storagePost(`banners/${fileName}`, file);
      if (!storageRes.ok) throw new Error("Failed to upload image to storage");

      const publicUrl = `${BASE_URL}/storage/v1/object/public/media/banners/${fileName}`;
      const dbRes = await rpc("add_media", { p_use_case: "banner", p_media_type: "image", p_file_url: publicUrl });

      if (dbRes.ok) { toast.success("Banner uploaded successfully!"); fetchBanners(); }
      else throw new Error("Failed to save banner details to database");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during banner upload");
    } finally {
      setBannerLoading(false);
    }
  };

  const handleDeleteBanner = async (banner: MediaItem): Promise<void> => {
    if (!confirm("Are you sure you want to delete this banner?")) return;

    try {
      const dbRes = await rpc("delete_media_by_id", { p_media_id: banner.id });
      if (!dbRes.ok) throw new Error("Failed to delete record from database.");

      setBanners((prev) => prev.filter((b) => b.id !== banner.id));

      const filePath = banner.file_url.split("/public/media/")[1];
      if (filePath) {
        const storageRes = await storageDelete(filePath);
        if (!storageRes.ok) console.warn("Database record deleted, but file remained in storage bucket.");
      }

      toast.success("Banner deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete banner");
    }
  };

  // --- Gallery ---

  const handleGalleryUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setGalleryLoading(true);
    const fileName = `gallery-${Date.now()}.${file.name.split(".").pop()}`;
    try {
      const storageRes = await storagePost(`gallery/${fileName}`, file);
      if (!storageRes.ok) throw new Error("Failed to upload image to storage");

      const publicUrl = `${BASE_URL}/storage/v1/object/public/media/gallery/${fileName}`;
      const dbRes = await rpc("add_media", { p_use_case: "gallery", p_media_type: "image", p_file_url: publicUrl });

      if (dbRes.ok) { toast.success("Image uploaded successfully!"); fetchGallery(); }
      else throw new Error("Failed to save image details to database");
    } catch (error: any) {
      toast.error(error.message || "An error occurred during gallery upload");
    } finally {
      setGalleryLoading(false);
    }
  };

  const handleDeleteGalleryItem = async (item: MediaItem): Promise<void> => {
    if (!confirm("Are you sure you want to delete this image?")) return;

    try {
      const dbRes = await rpc("delete_media_by_id", { p_media_id: item.id });
      if (!dbRes.ok) throw new Error("Failed to delete record from database.");

      setGallery((prev) => prev.filter((g) => g.id !== item.id));
      const filePath = item.file_url.split("/public/media/")[1];
      if (filePath) await storageDelete(filePath);

      toast.success("Image deleted successfully");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to delete image");
    }
  };

  return {
    activeTab, setActiveTab, hasChanges, setHasChanges, loading, orgData, setOrgData,
    holidays, discounts, newHoliday, setNewHoliday, newDiscount, setNewDiscount,
    banners, bannerLoading, handleUpdateOrg, handleAddSchedule, handleDeleteSchedule,
    handleAddDiscount, handleDeleteDiscount, handleToggleDiscountStatus, handleLogoUpload,
    handleBannerUpload, handleDeleteBanner, gallery, galleryLoading,
    handleGalleryUpload, handleDeleteGalleryItem,
    tiers, tiersLoading, handleCreateTier, handleUpdateTier, handleDeleteTier
  };
}