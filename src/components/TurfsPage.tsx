import { useState, useEffect } from "react";
import {
  Plus,
  Edit,
  Trash2,
  Camera,
  Loader2,
  X,
  Save,
  UploadCloud,
} from "lucide-react";

// Configuration - Replace with your actual values
const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

export function TurfsPage() {
  // State Management
  const [turfs, setTurfs] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"bg" | "icon" | null>(null);
  const [selectedTurf, setSelectedTurf] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    size: "",
    player_capacity: 0,
    background_image_url: "",
    icon_url: "",
    is_active: true,
    display_order: 1,
  });

  // 1. Fetch Turfs on Load
  const fetchTurfs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/rest/v1/rpc/get_fields`, {
        method: "POST", // RPC calls in Supabase are typically POST
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        const errorDetails = await response.json();
        throw new Error(errorDetails.message || "Failed to fetch");
      }

      const data = await response.json();

      // Defensive check: only sort if we received an array
      if (Array.isArray(data)) {
        setTurfs(
          data.sort((a: any, b: any) => a.display_order - b.display_order)
        );
      } else {
        console.error("Received non-array data:", data);
        setTurfs([]);
      }
    } catch (error) {
      console.error("Error fetching turfs:", error);
      // Optional: alert("Could not load turfs. Check console for details.");
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  // 2. Handle Supabase Media Uploads
  const handleFileUpload = async (file: File, type: "bg" | "icon") => {
    setUploading(type);

    // 1. Get the token
    const accessToken = localStorage.getItem("sb-access-token");

    // 2. QUICK FIX: If the token is expired, alert the user or redirect
    // A real-world app would call a refresh endpoint here
    if (!accessToken) {
      alert("Session expired. Please log in again.");
      return;
    }

    const folder = type === "bg" ? "field_background_images" : "field_icons";
    const fileName = `${Date.now()}_${file.name.replace(/\s/g, "_")}`;
    const uploadUrl = `${BASE_URL}/storage/v1/object/media/${folder}/${fileName}`;

    try {
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "x-upsert": "true", // Useful if you want to overwrite existing files
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${accessToken}`,
        },
        body: file,
      });

      const result = await response.json();

      if (response.ok) {
        // Use the public URL for display
        const publicUrl = `${BASE_URL}/storage/v1/object/public/media/${folder}/${fileName}`;
        if (type === "bg")
          setFormData((prev) => ({ ...prev, background_image_url: publicUrl }));
        else setFormData((prev) => ({ ...prev, icon_url: publicUrl }));
      } else {
        // Handle the specific 'exp' error
        if (result.message?.includes("exp")) {
          alert(
            "Your session has expired. Please refresh the page or log in again."
          );
        } else {
          alert(`Upload failed: ${result.message}`);
        }
        console.error("Server Response:", result);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Network error during upload.");
    } finally {
      setUploading(null);
    }
  };

  // 3. Create or Update Field
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const isEdit = !!selectedTurf;
    const endpoint = isEdit ? "/update_field" : "/add_field";

    // Construct body with the "p_" prefix required by your API
    const body: any = {
      p_name: formData.name,
      p_description: formData.description,
      p_background_image_url: formData.background_image_url,
      p_icon_url: formData.icon_url,
      p_size: formData.size,
      p_player_capacity: formData.player_capacity,
    };

    if (isEdit) {
      body.p_id = selectedTurf.id;
      body.p_is_active = formData.is_active;
      body.p_display_order = formData.display_order;
    }

    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
      });

      const result = await res.json();

      if (res.ok) {
        setIsModalOpen(false);
        fetchTurfs(); // Refresh list
      } else {
        alert(result.message || "Operation failed");
      }
    } catch (error) {
      alert("Request failed");
    } finally {
      setLoading(false);
    }
  };

  // 4. Delete Field
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this field?")) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/rest/v1/rpc/delete_field`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({ p_id: id }),
      });

      const result = await response.json();
      if (response.ok) {
        fetchTurfs();
      } else {
        alert(result.message || "Field does not exist or could not be deleted");
      }
    } catch (error) {
      alert("Delete request failed");
    } finally {
      setLoading(false);
    }
  };

  // Modal Controls
  const openModal = (turf: any = null) => {
    if (turf) {
      setSelectedTurf(turf);
      setFormData({
        name: turf.name,
        description: turf.description || "",
        size: turf.size || "",
        player_capacity: turf.player_capacity || 0,
        background_image_url: turf.background_image_url || "",
        icon_url: turf.icon_url || "",
        is_active: turf.is_active ?? true,
        display_order: turf.display_order || 1,
      });
    } else {
      setSelectedTurf(null);
      setFormData({
        name: "",
        description: "",
        size: "",
        player_capacity: 0,
        background_image_url: "",
        icon_url: "",
        is_active: true,
        display_order: turfs.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-sans">
            Turfs & Sports
          </h1>
          <p className="text-gray-500">
            Manage your fields and sports facilities
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Field</span>
        </button>
      </div>

      {/* Turfs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {turfs.map((turf) => (
          <div
            key={turf.id}
            className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-md transition-all group"
          >
            {/* Image Header Area */}
            <div className="relative h-48 bg-gray-200">
              <img
                src={turf.background_image_url}
                alt={turf.name}
                className="w-full h-full object-cover"
              />

              {/* Order Badge (Circular Left) */}
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex justify-center items-center shadow-lg border border-white">
                <span className="text-gray-900 font-bold">
                  {turf.display_order}
                </span>
              </div>

              {/* Icon Badge (Rectangular Right) */}
              <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl flex justify-center items-center shadow-lg border border-white">
                <img
                  src={turf.icon_url}
                  className="w-6 h-6 object-contain"
                  alt="sport icon"
                />
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* Stats Info Grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-[10px] uppercase font-black text-blue-400">
                    Name
                  </p>
                  <p className="text-xs font-bold text-blue-900 truncate">
                    {turf.name}
                  </p>
                </div>
                <div className="text-center p-2 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-[10px] uppercase font-black text-purple-400">
                    Size
                  </p>
                  <p className="text-xs font-bold text-purple-900 truncate">
                    {turf.size || "N/A"}
                  </p>
                </div>
                <div className="text-center p-2 bg-pink-50 rounded-xl border border-pink-100">
                  <p className="text-[10px] uppercase font-black text-pink-400">
                    Cap
                  </p>
                  <p className="text-xs font-bold text-pink-900">
                    {turf.player_capacity || "-"}
                  </p>
                </div>
              </div>

              {/* Description Display */}
              <div className="px-4 py-2.5 w-full bg-gray-50 text-gray-600 rounded-xl text-xs text-center border border-gray-100 italic">
                {turf.description || "No description provided"}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => openModal(turf)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-sm font-semibold">Edit</span>
                </button>
                <button
                  onClick={() => handleDelete(turf.id)}
                  disabled={loading}
                  className="p-2.5 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedTurf ? `Update ${formData.name}` : "Create New Field"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="p-6 space-y-5 overflow-y-auto max-h-[80vh]"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Field Name
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    className="w-full mt-1 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Size (e.g. 100m*60m)
                  </label>
                  <input
                    type="text"
                    className="w-full mt-1 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.size}
                    onChange={(e) =>
                      setFormData({ ...formData, size: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Player Capacity
                  </label>
                  <input
                    type="number"
                    className="w-full mt-1 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.player_capacity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        player_capacity: parseInt(e.target.value) || 0,
                      })
                    }
                  />
                </div>
              </div>

              {/* Upload Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Background Image
                  </label>
                  <div className="relative h-28 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 group hover:border-blue-400 transition-colors overflow-hidden">
                    {formData.background_image_url ? (
                      <img
                        src={formData.background_image_url}
                        className="w-full h-full object-cover"
                        alt="preview"
                      />
                    ) : (
                      <div className="text-center">
                        <UploadCloud className="text-gray-300 w-8 h-8 mx-auto" />
                        <span className="text-[10px] text-gray-400">
                          Upload JPG/PNG
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0], "bg")
                      }
                    />
                    {uploading === "bg" && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-pulse">
                        <Loader2 className="animate-spin text-blue-600 w-6 h-6" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                    Sport Icon
                  </label>
                  <div className="relative h-28 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 group hover:border-purple-400 transition-colors overflow-hidden">
                    {formData.icon_url ? (
                      <img
                        src={formData.icon_url}
                        className="w-12 h-12 object-contain"
                        alt="icon preview"
                      />
                    ) : (
                      <div className="text-center">
                        <Camera className="text-gray-300 w-8 h-8 mx-auto" />
                        <span className="text-[10px] text-gray-400">
                          Upload Icon
                        </span>
                      </div>
                    )}
                    <input
                      type="file"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files?.[0] &&
                        handleFileUpload(e.target.files[0], "icon")
                      }
                    />
                    {uploading === "icon" && (
                      <div className="absolute inset-0 bg-white/80 flex items-center justify-center animate-pulse">
                        <Loader2 className="animate-spin text-purple-600 w-6 h-6" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !!uploading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                {selectedTurf ? "Update Field" : "Create Field"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
