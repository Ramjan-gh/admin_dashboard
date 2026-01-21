import { useState, useEffect, useCallback, ChangeEvent } from "react";
import {
  Save,
  Building,
  Calendar,
  Tag,
  Plus,
  Trash2,
  MapPin,
  Globe, // <--- Add this
  Instagram,
  Facebook,
  MessageCircle,
  AlertCircle,
  Loader2,
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

  const getHeaders = useCallback(
    () => ({
      "Content-Type": "application/json",
      apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
      Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    }),
    []
  );

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      const headers = getHeaders();
      const [orgRes, scheduleRes, discountRes] = await Promise.all([
        fetch(`${BASE_URL}/rest/v1/rpc/get_organization`, { headers }).then(
          (res) => res.json()
        ),
        fetch(`${BASE_URL}/rest/v1/rpc/get_business_schedule`, {
          headers,
        }).then((res) => res.json()),
        fetch(`${BASE_URL}/rest/v1/rpc/get_discount_codes`, { headers }).then(
          (res) => res.json()
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
        }
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
        "Note cannot be empty. Please provide a title for the holiday."
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
      }
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 1. Identity & Branding */}
                <section className="space-y-4">
                  <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                    <Building className="w-4 h-4 text-purple-600" /> Identity &
                    Branding
                  </h3>
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={orgData.logo_url}
                      alt="Logo"
                      className="w-16 h-16 rounded-lg object-cover border"
                    />
                    <div className="flex-1">
                      <label className="text-sm font-medium text-gray-600">
                        Logo URL
                      </label>
                      <input
                        type="text"
                        value={orgData.logo_url || ""}
                        onChange={(e) => {
                          setOrgData({ ...orgData, logo_url: e.target.value });
                          setHasChanges(true);
                        }}
                        className="w-full mt-1 px-4 py-2 border rounded-lg text-xs"
                      />
                    </div>
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
            <div className="space-y-6">
              <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="text-xs font-bold text-purple-700 uppercase">
                    Code
                  </label>
                  <input
                    type="text"
                    placeholder="PROMO20"
                    className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg"
                    value={newDiscount.p_code}
                    onChange={(e) =>
                      setNewDiscount({ ...newDiscount, p_code: e.target.value })
                    }
                  />
                </div>

                {/* NEW: Discount Type Selector */}
                <div>
                  <label className="text-xs font-bold text-purple-700 uppercase">
                    Type
                  </label>
                  <select
                    className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg bg-white"
                    value={newDiscount.p_discount_type}
                    onChange={(e) =>
                      setNewDiscount({
                        ...newDiscount,
                        p_discount_type: e.target.value as
                          | "percentage"
                          | "fixed",
                      })
                    }
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount (Tk)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-purple-700 uppercase">
                    Value{" "}
                    {newDiscount.p_discount_type === "percentage"
                      ? "(%)"
                      : "(Tk)"}
                  </label>
                  <input
                    type="number"
                    placeholder="10"
                    className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg"
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
                  <label className="text-xs font-bold text-purple-700 uppercase">
                    Valid From
                  </label>
                  <input
                    type="date"
                    className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg"
                    onChange={(e) =>
                      setNewDiscount({
                        ...newDiscount,
                        p_valid_from: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-purple-700 uppercase">
                    Valid Until
                  </label>
                  <input
                    type="date"
                    className="w-full mt-1 px-3 py-2 border border-purple-200 rounded-lg"
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
                  className="lg:col-span-5 bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition-all"
                >
                  Create Discount
                </button>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {discounts.map((d) => (
                  <div
                    key={d.id}
                    className="border rounded-xl p-4 flex justify-between items-center bg-white shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-2 h-2 rounded-full ${d.is_active ? "bg-green-500" : "bg-gray-300"}`}
                      />
                      <div>
                        <span className="font-mono text-lg font-bold text-purple-800">
                          {d.code}
                        </span>
                        <p className="text-sm text-gray-600">
                          {d.discount_value}{" "}
                          {d.discount_type === "percentage" ? "%" : "Tk"} Off
                          <span className="ml-2 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-gray-100">
                            {d.is_active ? "Active" : "Inactive"}
                          </span>
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      {/* Update Button (Toggle Status) */}
                      <button
                        onClick={() =>
                          handleToggleDiscountStatus(d.id, d.is_active)
                        }
                        className={`text-xs px-3 py-2 rounded-lg font-medium transition-colors ${
                          d.is_active
                            ? "bg-amber-50 text-amber-600 hover:bg-amber-100"
                            : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {d.is_active ? "Deactivate" : "Activate"}
                      </button>

                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteDiscount(d.id)}
                        className="text-xs bg-red-50 text-red-600 px-3 py-2 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
