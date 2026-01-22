import { useState, useEffect, useCallback, ChangeEvent } from "react";
import {
  Save,
  Building,
  Calendar,
  Tag,
  Plus,
  Trash2,
  MapPin,
  Globe,
  Instagram,
  Facebook,
  MessageCircle,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

import { GeneralSettings } from "./settingsFolder/GeneralSettings";
import { HolidaySettings } from "./settingsFolder/HolidaySettings";
import { BannerSettings } from "./settingsFolder/BannerSettings";
import { DiscountSettings } from "./settingsFolder/DiscountSettings";
import { toast } from "sonner";


// --- Types & Interfaces ---
interface Organization {
  name: string;
  description: string;
  logo_url: string;
  emails: string | string[];
  phone_numbers: string | string[];
  address_text: string;
  address_google_maps_url: string;
  facebook_url: string;
  instagram_url: string;
  tiktok_url: string;
  whatsapp_url: string;
}

interface Holiday {
  id: string;
  date: string;
  notes: string;
  is_open: boolean;
}


interface Discount {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  is_active: boolean; 
}

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [hasChanges, setHasChanges] = useState(false);
  const [loading, setLoading] = useState(true);

  // Data States with proper types
  const [orgData, setOrgData] = useState<Organization | null>(null);
  const [holidays, setHolidays] = useState<Holiday[]>([]);
  const [discounts, setDiscounts] = useState<Discount[]>([]);

  // Form States
  const [newHoliday, setNewHoliday] = useState({
    p_date: "",
    p_is_open: false,
    p_notes: "",
  });
  const [newDiscount, setNewDiscount] = useState<{
    p_code: string;
    p_discount_type: "percentage" | "fixed"; // Explicit Union
    p_discount_value: string;
    p_valid_from: string;
    p_valid_until: string;
    p_max_uses: number | null;
    p_is_active: boolean;
  }>({
    p_code: "",
    p_discount_type: "percentage",
    p_discount_value: "",
    p_valid_from: "",
    p_valid_until: "",
    p_max_uses: null,
    p_is_active: true,
  });

  // Make sure this matches what your DB returns
  const [banners, setBanners] = useState<
    { id: any; file_url: string; media_type: string }[]
  >([]);
  const [bannerLoading, setBannerLoading] = useState(false);

  const getHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    }),
    [],
  );

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getHeaders();
      const [orgRes, scheduleRes, discountRes] = await Promise.all([
        fetch(`${BASE_URL}/rest/v1/rpc/get_organization`, { headers }).then(
          (res) => res.json(),
        ),
        fetch(`${BASE_URL}/rest/v1/rpc/get_business_schedule`, {
          headers,
        }).then((res) => res.json()),
        fetch(`${BASE_URL}/rest/v1/rpc/get_discount_codes`, { headers }).then(
          (res) => res.json(),
        ),
      ]);

      if (orgRes && orgRes[0]) setOrgData(orgRes[0]);
      if (Array.isArray(scheduleRes)) setHolidays(scheduleRes);
      if (Array.isArray(discountRes)) setDiscounts(discountRes);
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  }, [getHeaders]);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  // Fetch banners on mount
  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/get_banners`, {
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY || "",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY || ""}`,
        },
      });
      if (res.ok) {
        const data = await res.json();
        setBanners(data);
      }
    } catch (err) {
      console.error("Error fetching banners:", err);
    }
  };

  

  const handleUpdateOrg = async () => {
    if (!orgData) return; // Fixes "possibly null" error

    try {
      const response = await fetch(
        `${BASE_URL}/rest/v1/rpc/update_organization`,
        {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({
            p_name: orgData.name,
            p_description: orgData.description,
            p_logo_url: orgData.logo_url,
            p_emails: Array.isArray(orgData.emails)
              ? orgData.emails
              : orgData.emails.split(",").map((e) => e.trim()),
            p_phone_numbers: Array.isArray(orgData.phone_numbers)
              ? orgData.phone_numbers
              : orgData.phone_numbers.split(",").map((p) => p.trim()),
            p_address_text: orgData.address_text,
            p_address_google_maps_url: orgData.address_google_maps_url,
            p_facebook_url: orgData.facebook_url,
            p_instagram_url: orgData.instagram_url,
            p_tiktok_url: orgData.tiktok_url,
            p_whatsapp_url: orgData.whatsapp_url,
          }),
        },
      );
      if (response.ok) {
        setHasChanges(false);
        toast.success("Organization updated successfully");
        fetchAllData();
      }
    } catch (error) {
      toast.error("Failed to update organization");
    }
  };

  const handleAddSchedule = async () => {
    // 1. Client-side validation for empty notes
    if (!newHoliday.p_date) return toast.error("Date is required");
    if (!newHoliday.p_notes || newHoliday.p_notes.trim() === "") {
      return toast.error(
        "Note cannot be empty. Please provide a title for the holiday.",
      );
    }

    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/add_business_schedule`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(newHoliday),
      });

      // 2. Handle API Errors (e.g., duplicate date)
      if (!res.ok) {
        const errorData = await res.json();
        // This captures the "Business schedule for date... already exists" message
        toast.error(errorData.message || "Failed to add schedule");
        return;
      }

      // 3. Success logic
      toast.success("Schedule added successfully");
      // Clear form (optional)
      setNewHoliday({ p_date: "", p_is_open: false, p_notes: "" });
      fetchAllData();
    } catch (error) {
      console.error("Connection error:", error);
      toast.error("A network error occurred.");
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (!window.confirm("Delete this schedule?")) return;
    const res = await fetch(
      `${BASE_URL}/rest/v1/rpc/delete_business_schedule`,
      {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ p_id: id }),
      },
    );
    if (res.ok) fetchAllData();
  };

  const handleAddDiscount = async () => {
    // 1. Client-side Validation
    if (!newDiscount.p_code.trim()) return toast.error("Discount code is required");
    if (!newDiscount.p_discount_value)
      return toast.error("Discount value is required");
    if (!newDiscount.p_valid_from) return toast.error("Valid From date is required");

    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/add_discount`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          ...newDiscount,
          p_discount_value: parseFloat(newDiscount.p_discount_value),
        }),
      });

      const data = await res.json();

      // --- UPDATED FIX STARTS HERE ---
      // Since the API returns an array like [{ success: false, message: "..." }]
      // We extract the first item from the array safely.
      const result = Array.isArray(data) ? data[0] : data;

      if (!res.ok || result?.success === false) {
        console.error("Server Error:", result);
        toast.error(
          result?.message ||
            result?.details ||
            "Failed to add discount. The code might already exist.",
        );
        return; // Stop execution
      }
      // --- UPDATED FIX ENDS HERE ---

      // Success Path
      toast.success("Discount added successfully!");
      setNewDiscount({
        p_code: "",
        p_discount_type: "percentage",
        p_discount_value: "",
        p_valid_from: "",
        p_valid_until: "",
        p_max_uses: null,
        p_is_active: true,
      });
      fetchAllData();
    } catch (error) {
      console.error("Network Error:", error);
      toast.error("A network error occurred.");
    }
  };

  const handleDeleteDiscount = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this discount code?"))
      return;

    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/delete_discount`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ p_id: id }),
      });

      const data = await res.json();
      const result = Array.isArray(data) ? data[0] : data;

      if (!res.ok || result?.success === false) {
        toast.error(result?.message || "Failed to delete discount.");
        return;
      }

      toast.success("Discount deleted successfully");
      fetchAllData();
    } catch (error) {
      toast.error("A network error occurred.");
    }
  };

  const handleToggleDiscountStatus = async (
    id: string,
    currentStatus: boolean,
  ) => {
    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/update_discount`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({
          p_id: id,
          p_is_active: !currentStatus,
        }),
      });

      const data = await res.json();
      const result = Array.isArray(data) ? data[0] : data;

      if (!res.ok || result?.success === false) {
        toast.error(result?.message || "Failed to update discount.");
        return;
      }

      fetchAllData();
    } catch (error) {
      toast.error("A network error occurred.");
    }
  };

  if (loading)
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );

  const handleLogoUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !orgData) return;

    // 1. Get the session token (matching your working pattern)
    const accessToken = localStorage.getItem("sb-access-token");
    if (!accessToken) {
      toast.error("You must be logged in to upload images.");
      return;
    }

    setLoading(true);

    // 2. Setup paths
    const folder = "logo";
    const fileExt = file.name.split(".").pop();
    const fileName = `logo-${Date.now()}.${fileExt}`;
    const uploadUrl = `${BASE_URL}/storage/v1/object/media/${folder}/${fileName}`;

    try {
      // 3. Delete Old File Logic
      if (orgData.logo_url && orgData.logo_url.includes(BASE_URL)) {
        try {
          const urlParts = orgData.logo_url.split("/");
          const oldFileName = urlParts[urlParts.length - 1];
          const deleteUrl = `${BASE_URL}/storage/v1/object/media/${folder}/${oldFileName}`;

          await fetch(deleteUrl, {
            method: "DELETE",
            headers: {
              apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
              Authorization: `Bearer ${accessToken}`,
            },
          });
          console.log("Old logo cleaned up");
        } catch (err) {
          console.error("Failed to delete old image:", err);
        }
      }

      // 4. Upload New File
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": file.type,
          "x-upsert": "true",
        },
        body: file,
      });

      const result = await response.json();

      if (response.ok) {
        const publicUrl = `${BASE_URL}/storage/v1/object/media/${folder}/${fileName}`;

        // Update local state
        setOrgData((prev) => (prev ? { ...prev, logo_url: publicUrl } : null));
        setHasChanges(true);

        console.log("Upload successful:", publicUrl);
      } else {
        if (result.message?.includes("exp") || result.statusCode === "403") {
          toast.error("Your session has expired. Please log in again.");
        } else {
          toast.error(`Upload failed: ${result.message}`);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const accessToken = localStorage.getItem("sb-access-token");
  if (!accessToken) {
    toast.error("You must be logged in to upload banners.");
    return;
  }

  setBannerLoading(true);

  // 1. Setup paths
  const folder = "banners";
  const fileExt = file.name.split(".").pop();
  const fileName = `banner-${Date.now()}.${fileExt}`;
  const uploadUrl = `${BASE_URL}/storage/v1/object/media/${folder}/${fileName}`;

  try {
    // 2. Upload File to Storage (Physical file)
    const storageResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": file.type,
        "x-upsert": "true",
      },
      body: file,
    });

    if (!storageResponse.ok) {
      throw new Error("Failed to upload file to storage.");
    }

    // Construct the public URL for the database
    const publicUrl = `${BASE_URL}/storage/v1/object/public/media/${folder}/${fileName}`;

    // 3. Add to Database via your /add_media API
    const dbResponse = await fetch(`${BASE_URL}/rest/v1/rpc/add_media`, {
      method: "POST",
      headers: {
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_use_case: "banner",
        p_media_type: "image",
        p_file_url: publicUrl,
      }),
    });

    if (dbResponse.ok) {
      const newBannerRecord = await dbResponse.json();
      
      // 4. Update local state with the actual DB response (includes the real ID)
      setBanners((prev) => [...prev, newBannerRecord]);
      
      console.log("Banner added to DB successfully:", newBannerRecord);
    } else {
      const errorData = await dbResponse.json();
      console.error("Database error:", errorData);
      toast.error("File uploaded, but failed to save record in database.");
    }
  } catch (error) {
    console.error("Banner upload error:", error);
    toast.error("An error occurred during upload.");
  } finally {
    setBannerLoading(false);
  }
};

  const handleDeleteBanner = async (banner: {
    id: string;
    file_url: string;
  }) => {
    const accessToken = localStorage.getItem("sb-access-token");
    if (!accessToken) return;

    const confirmDelete = confirm(
      "Are you sure you want to delete this banner?",
    );
    if (!confirmDelete) return;

    try {
      // 1. Delete from Database first (using your specific API)
      const dbResponse = await fetch(
        `${BASE_URL}/rest/v1/rpc/delete_media_by_id`,
        {
          method: "POST",
          headers: {
            apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            p_media_id: banner.id, // Using the ID from your API response
          }),
        },
      );

      if (!dbResponse.ok) {
        const dbError = await dbResponse.json();
        throw new Error(
          dbError.message || "Failed to delete record from database",
        );
      }

      // 2. Delete from Storage (Physical file)
      const urlParts = banner.file_url.split("/");
      const fileName = urlParts[urlParts.length - 1];
      const storageDeleteUrl = `${BASE_URL}/storage/v1/object/media/banners/${fileName}`;

      const storageResponse = await fetch(storageDeleteUrl, {
        method: "DELETE",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (storageResponse.ok) {
        // 3. Update UI state
        setBanners((prev) => prev.filter((b) => b.id !== banner.id));
        console.log("Banner deleted successfully from DB and Storage");
      } else {
        console.warn(
          "Database record deleted, but storage file might still exist.",
        );
        // Still remove from UI because the DB record is gone
        setBanners((prev) => prev.filter((b) => b.id !== banner.id));
      }
    } catch (error: any) {
      console.error("Error deleting banner:", error);
      toast.error(error.message || "An error occurred while deleting the banner.");
    }
  };

  return (
    <div className="p-4 lg:p-6 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-gray-900 mb-1 text-2xl font-bold">Settings</h1>
          <p className="text-gray-500">
            Manage your business configuration and rules
          </p>
        </div>
        {hasChanges && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1 rounded-full text-sm border border-amber-200">
            <AlertCircle className="w-4 h-4" /> Unsaved Changes
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 overflow-x-auto bg-gray-50/50">
          <div className="flex">
            {[
              { id: "general", label: "General", icon: Building },
              { id: "holidays", label: "Holidays", icon: Calendar },
              { id: "discounts", label: "Discounts", icon: Tag },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 whitespace-nowrap font-medium transition-all ${
                  activeTab === tab.id
                    ? "border-b-2 border-purple-500 text-purple-600 bg-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {/* --- GENERAL TAB --- */}
          {activeTab === "general" && orgData && (
            <GeneralSettings
              orgData={orgData}
              setOrgData={setOrgData}
              loading={loading}
              setHasChanges={setHasChanges}
              handleLogoUpload={handleLogoUpload}
              handleUpdateOrg={handleUpdateOrg}
              // Banner Props
              banners={banners}
              bannerLoading={bannerLoading}
              handleBannerUpload={handleBannerUpload}
              handleDeleteBanner={handleDeleteBanner}
            />
          )}

          {activeTab === "holidays" && (
            <HolidaySettings
              holidays={holidays}
              newHoliday={newHoliday}
              setNewHoliday={setNewHoliday}
              handleAddSchedule={handleAddSchedule}
              handleDeleteSchedule={handleDeleteSchedule}
            />
          )}

          {activeTab === "discounts" && (
            <DiscountSettings
              discounts={discounts}
              newDiscount={newDiscount}
              setNewDiscount={setNewDiscount}
              handleAddDiscount={handleAddDiscount}
              handleDeleteDiscount={handleDeleteDiscount}
              handleToggleDiscountStatus={handleToggleDiscountStatus}
            />
          )}
        </div>
      </div>
    </div>
  );
}
