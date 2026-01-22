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
}

interface Discount {
  id: string;
  code: string;
  discount_type: "percentage" | "fixed";
  discount_value: number;
  is_active: boolean; // Ensure this is in your interface
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
  const [newDiscount, setNewDiscount] = useState({
    p_code: "",
    p_discount_type: "percentage",
    p_discount_value: "",
    p_valid_from: "" as string,
    p_valid_until: "" as string,
    p_max_uses: null as number | null,
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
        alert("Organization updated successfully");
        fetchAllData();
      }
    } catch (error) {
      alert("Failed to update organization");
    }
  };

  const handleAddSchedule = async () => {
    // 1. Client-side validation for empty notes
    if (!newHoliday.p_date) return alert("Date is required");
    if (!newHoliday.p_notes || newHoliday.p_notes.trim() === "") {
      return alert(
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
        alert(errorData.message || "Failed to add schedule");
        return;
      }

      // 3. Success logic
      alert("Schedule added successfully");
      // Clear form (optional)
      setNewHoliday({ p_date: "", p_is_open: false, p_notes: "" });
      fetchAllData();
    } catch (error) {
      console.error("Connection error:", error);
      alert("A network error occurred.");
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
    if (!newDiscount.p_code.trim()) return alert("Discount code is required");
    if (!newDiscount.p_discount_value)
      return alert("Discount value is required");
    if (!newDiscount.p_valid_from) return alert("Valid From date is required");

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
        alert(
          result?.message ||
            result?.details ||
            "Failed to add discount. The code might already exist.",
        );
        return; // Stop execution
      }
      // --- UPDATED FIX ENDS HERE ---

      // Success Path
      alert("Discount added successfully!");
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
      alert("A network error occurred.");
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
        alert(result?.message || "Failed to delete discount.");
        return;
      }

      alert("Discount deleted successfully");
      fetchAllData();
    } catch (error) {
      alert("A network error occurred.");
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
        alert(result?.message || "Failed to update discount.");
        return;
      }

      fetchAllData();
    } catch (error) {
      alert("A network error occurred.");
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
      alert("You must be logged in to upload images.");
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
          alert("Your session has expired. Please log in again.");
        } else {
          alert(`Upload failed: ${result.message}`);
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setLoading(false);
    }
  };

    const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const accessToken = localStorage.getItem("sb-access-token");
  if (!accessToken) {
    alert("You must be logged in to upload banners.");
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
      alert("File uploaded, but failed to save record in database.");
    }
  } catch (error) {
    console.error("Banner upload error:", error);
    alert("An error occurred during upload.");
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
      alert(error.message || "An error occurred while deleting the banner.");
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
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* --- BANNERS SECTION --- */}
              <section className="space-y-4">
                <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                  <ImageIcon className="w-4 h-4 text-purple-600" /> Hero Banners
                </h3>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {banners.map((banner, idx) => (
                    <div
                      key={idx}
                      className="relative group aspect-video rounded-xl overflow-hidden border bg-gray-100 shadow-sm"
                    >
                      <img
                        src={banner.file_url}
                        className="w-full h-full object-cover"
                        alt="Banner"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <button
                          onClick={() => handleDeleteBanner(banner)} // Pass the whole object
                          className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors shadow-lg"
                          title="Delete Banner"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Upload Placeholder */}
                  <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-gray-300 hover:border-purple-500 hover:bg-purple-50 cursor-pointer transition-all group">
                    {bannerLoading ? (
                      <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full" />
                    ) : (
                      <>
                        <Plus className="w-8 h-8 text-gray-400 group-hover:text-purple-500" />
                        <span className="text-xs text-gray-400 group-hover:text-purple-500 font-medium mt-1">
                          Add Banner
                        </span>
                      </>
                    )}
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleBannerUpload}
                      disabled={bannerLoading}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-400 italic">
                  Recommended size: 1200x400px (3:1 aspect ratio)
                </p>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Identity & Branding */}
                <section className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Building className="w-4 h-4 text-purple-600" /> Identity &
                    Branding
                  </h3>

                  <div className="flex flex-col items-center justify-center py-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                    <div className="relative group">
                      <img
                        src={orgData.logo_url}
                        alt="Logo"
                        className="w-24 h-24 rounded-lg object-cover border-2 border-white shadow-md"
                      />
                      <label className="absolute inset-0 flex items-center justify-center bg-black/40 text-white opacity-0 group-hover:opacity-100 rounded-lg cursor-pointer transition-opacity">
                        {loading ? (
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                        ) : (
                          <Plus className="w-6 h-6" />
                        )}
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          disabled={loading}
                        />
                      </label>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-2 uppercase font-bold tracking-wider">
                      Click image to change logo
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Business Name
                    </label>
                    <input
                      type="text"
                      value={orgData.name || ""}
                      onChange={(e) => {
                        setOrgData({ ...orgData, name: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={orgData.description || ""}
                      onChange={(e) => {
                        setOrgData({ ...orgData, description: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </section>

                {/* 2. Contact Information */}
                <section className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Globe className="w-4 h-4 text-purple-600" /> Contact Info
                  </h3>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Emails (comma separated)
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(orgData.emails)
                          ? orgData.emails.join(", ")
                          : orgData.emails
                      }
                      onChange={(e) => {
                        setOrgData({ ...orgData, emails: e.target.value });
                        setHasChanges(true);
                      }}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Phone Numbers
                    </label>
                    <input
                      type="text"
                      value={
                        Array.isArray(orgData.phone_numbers)
                          ? orgData.phone_numbers.join(", ")
                          : orgData.phone_numbers
                      }
                      onChange={(e) => {
                        setOrgData({
                          ...orgData,
                          phone_numbers: e.target.value,
                        });
                        setHasChanges(true);
                      }}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Physical Address
                    </label>
                    <input
                      type="text"
                      value={orgData.address_text || ""}
                      onChange={(e) => {
                        setOrgData({
                          ...orgData,
                          address_text: e.target.value,
                        });
                        setHasChanges(true);
                      }}
                      className="w-full mt-1 px-4 py-2 border rounded-lg"
                    />
                  </div>
                </section>

                {/* 3. Social Media Links */}
                <section className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Instagram className="w-4 h-4 text-purple-600" /> Social
                    Presence
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="flex items-center gap-2">
                      <Facebook className="w-5 h-5 text-blue-600" />
                      <input
                        placeholder="Facebook URL"
                        value={orgData.facebook_url || ""}
                        onChange={(e) => {
                          setOrgData({
                            ...orgData,
                            facebook_url: e.target.value,
                          });
                          setHasChanges(true);
                        }}
                        className="flex-1 px-4 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Instagram className="w-5 h-5 text-pink-600" />
                      <input
                        placeholder="Instagram URL"
                        value={orgData.instagram_url || ""}
                        onChange={(e) => {
                          setOrgData({
                            ...orgData,
                            instagram_url: e.target.value,
                          });
                          setHasChanges(true);
                        }}
                        className="flex-1 px-4 py-2 border rounded-lg text-sm"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-green-600" />
                      <input
                        placeholder="WhatsApp URL"
                        value={orgData.whatsapp_url || ""}
                        onChange={(e) => {
                          setOrgData({
                            ...orgData,
                            whatsapp_url: e.target.value,
                          });
                          setHasChanges(true);
                        }}
                        className="flex-1 px-4 py-2 border rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </section>

                {/* 4. Location Details */}
                <section className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <MapPin className="w-4 h-4 text-purple-600" /> Map
                    Integration
                  </h3>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Google Maps URL
                    </label>
                    <input
                      type="url"
                      value={orgData.address_google_maps_url || ""}
                      onChange={(e) => {
                        setOrgData({
                          ...orgData,
                          address_google_maps_url: e.target.value,
                        });
                        setHasChanges(true);
                      }}
                      className="w-full mt-1 px-4 py-2 border rounded-lg text-blue-600"
                    />
                  </div>
                </section>
              </div>

              {/* Footer Save Button */}
              <div className="pt-6 border-t">
                <button
                  onClick={handleUpdateOrg}
                  className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md transition-all font-bold"
                >
                  <Save className="w-5 h-5" /> Save All Settings
                </button>
              </div>
            </div>
          )}

          {activeTab === "holidays" && (
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    value={newHoliday.p_date} // Add value binding
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewHoliday({ ...newHoliday, p_date: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Note
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Eid-ul-Fitr"
                    className="w-full mt-1 px-3 py-2 border rounded-lg"
                    value={newHoliday.p_notes} // Add value binding
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewHoliday({ ...newHoliday, p_notes: e.target.value })
                    }
                  />
                </div>
                <div className="flex items-center h-10">
                  <input
                    type="checkbox"
                    id="isOpen"
                    className="w-4 h-4 accent-purple-600"
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setNewHoliday({
                        ...newHoliday,
                        p_is_open: e.target.checked,
                      })
                    }
                  />
                  <label
                    htmlFor="isOpen"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Open?
                  </label>
                </div>
                <button
                  onClick={handleAddSchedule}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </div>

              <div className="divide-y border rounded-xl">
                {holidays.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div>
                      <p className="font-semibold text-gray-900">
                        {h.notes || "No Title"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {h.date} •{" "}
                        <span
                          className={
                            h.is_open
                              ? "text-green-600"
                              : "text-red-600 font-medium"
                          }
                        >
                          {h.is_open ? "Open" : "Closed"}
                        </span>
                      </p>
                    </div>
                    <button
                      onClick={() => handleDeleteSchedule(h.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "discounts" && (
            <div className="flex flex-col gap-6 animate-in fade-in duration-300">
              {/* TOP SECTION: Create Discount Form (Stay fixed at top) */}
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 shadow-sm">
                <h3 className="text-sm font-bold text-purple-800 mb-4 uppercase tracking-wider">
                  Create New Discount
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 items-end">
                  <div>
                    <label className="text-[10px] font-bold text-purple-700 uppercase">
                      Code
                    </label>
                    <input
                      type="text"
                      placeholder="PROMO20"
                      className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none uppercase font-mono"
                      value={newDiscount.p_code}
                      onChange={(e) =>
                        setNewDiscount({
                          ...newDiscount,
                          p_code: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-purple-700 uppercase">
                      Type
                    </label>
                    <div className="flex mt-1 p-1 bg-purple-100 rounded-lg h-[42px]">
                      <button
                        type="button"
                        onClick={() =>
                          setNewDiscount({
                            ...newDiscount,
                            p_discount_type: "percentage",
                          })
                        }
                        className={`flex-1 px-2 rounded-md text-xs font-bold transition-all ${newDiscount.p_discount_type === "percentage" ? "bg-white text-purple-700 shadow-sm" : "text-purple-500"}`}
                      >
                        %
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setNewDiscount({
                            ...newDiscount,
                            p_discount_type: "fixed",
                          })
                        }
                        className={`flex-1 px-2 rounded-md text-xs font-bold transition-all ${newDiscount.p_discount_type === "fixed" ? "bg-white text-purple-700 shadow-sm" : "text-purple-500"}`}
                      >
                        Tk
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-purple-700 uppercase">
                      Value
                    </label>
                    <input
                      type="number"
                      className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg outline-none focus:ring-2 focus:ring-purple-400"
                      value={newDiscount.p_discount_value}
                      onChange={(e) =>
                        setNewDiscount({
                          ...newDiscount,
                          p_discount_value: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-purple-700 uppercase">
                      Valid From
                    </label>
                    <input
                      type="date"
                      className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg text-sm"
                      value={newDiscount.p_valid_from}
                      onChange={(e) =>
                        setNewDiscount({
                          ...newDiscount,
                          p_valid_from: e.target.value,
                        })
                      }
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-purple-700 uppercase">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg text-sm"
                      value={newDiscount.p_valid_until}
                      onChange={(e) =>
                        setNewDiscount({
                          ...newDiscount,
                          p_valid_until: e.target.value,
                        })
                      }
                    />
                  </div>

                  <button
                    onClick={handleAddDiscount}
                    className="bg-purple-600 text-white h-[42px] rounded-lg font-bold hover:bg-purple-700 transition-all shadow-md shadow-purple-200"
                  >
                    Create
                  </button>
                </div>
              </div>

              {/* BOTTOM SECTION: Scrollable List */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest">
                    Active Coupons
                  </h3>
                  <span className="text-[10px] bg-gray-100 px-2 py-1 rounded-full font-bold text-gray-400">
                    {discounts.length} CODES TOTAL
                  </span>
                </div>

                {/* Scrollable Container */}
                <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {discounts.length === 0 ? (
                      <div className="lg:col-span-2 text-center py-10 bg-gray-50 rounded-xl border-2 border-dashed">
                        <p className="text-gray-400 font-medium">
                          No discount codes available.
                        </p>
                      </div>
                    ) : (
                      discounts.map((d) => (
                        <div
                          key={d.id}
                          className="border border-gray-100 rounded-xl p-4 flex justify-between items-center bg-white shadow-sm hover:border-purple-200 transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-2 h-2 rounded-full ${d.is_active ? "bg-green-500 animate-pulse" : "bg-gray-300"}`}
                            />
                            <div>
                              <span className="font-mono text-lg font-black text-purple-900 tracking-tighter uppercase">
                                {d.code}
                              </span>
                              <p className="text-xs text-gray-500 font-medium">
                                {d.discount_value}{" "}
                                {d.discount_type === "percentage" ? "%" : "Tk"}{" "}
                                Off
                                <span
                                  className={`ml-2 px-1.5 py-0.5 rounded text-[9px] uppercase font-bold ${d.is_active ? "bg-green-50 text-green-600" : "bg-gray-50 text-gray-400"}`}
                                >
                                  {d.is_active ? "Active" : "Paused"}
                                </span>
                              </p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleToggleDiscountStatus(d.id, d.is_active)
                              }
                              className={`text-[10px] px-3 py-1.5 rounded-lg font-bold uppercase transition-colors ${
                                d.is_active
                                  ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                                  : "bg-green-50 text-green-600 hover:bg-green-100"
                              }`}
                            >
                              {d.is_active ? "Pause" : "Live"}
                            </button>
                            <button
                              onClick={() => handleDeleteDiscount(d.id)}
                              className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
