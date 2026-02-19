import { useState, useEffect } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { toast } from "sonner";

const BASE_URL = "https://himsgwtkvewhxvmjapqa.supabase.co";

export function useTurfs() {
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

  const fetchTurfs = async () => {
    try {
      const response = await fetch(`${BASE_URL}/rest/v1/rpc/get_fields`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
      });
      const data = await response.json();
      if (Array.isArray(data)) {
        setTurfs(data.sort((a, b) => a.display_order - b.display_order));
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to fetch fields");
    }
  };

  useEffect(() => {
    fetchTurfs();
  }, []);

  const syncOrderToDatabase = async (newItems: any[]) => {
    const updatePromises = newItems.map((item) =>
      fetch(`${BASE_URL}/rest/v1/rpc/update_field`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          p_id: item.id,
          p_name: item.name,
          p_display_order: item.display_order,
        }),
      })
    );
    await Promise.all(updatePromises);
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination || result.destination.index === result.source.index) return;

    const items = Array.from(turfs);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const updatedItems = items.map((item, index) => ({
      ...item,
      display_order: index + 1,
    }));

    setTurfs(updatedItems);
    try {
      await syncOrderToDatabase(updatedItems);
      toast.success("Field order updated!");
    } catch (err) {
      console.error("Failed to sync order", err);
      toast.error("Failed to update field order");
    }
  };

  const handleFileUpload = async (file: File, type: "bg" | "icon") => {
    setUploading(type);
    const accessToken = localStorage.getItem("sb-access-token");
    if (!accessToken) {
      toast.error("You must be logged in to upload images");
      setUploading(null);
      return;
    }

    const folder = type === "bg" ? "field_background_images" : "field_icons";
    const fileExt = file.name.split(".").pop();
    const slug = (formData.name || "field").toLowerCase().replace(/[^a-z0-9]/g, "-");
    const fileName = `${slug}-${Date.now()}.${fileExt}`;
    const uploadUrl = `${BASE_URL}/storage/v1/object/media/${folder}/${fileName}`;

    try {
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

      if (response.ok) {
        const publicUrl = `${BASE_URL}/storage/v1/object/public/media/${folder}/${fileName}`;
        setFormData((prev) => ({
          ...prev,
          [type === "bg" ? "background_image_url" : "icon_url"]: publicUrl,
        }));
        toast.success(`${type === "bg" ? "Background image" : "Icon"} uploaded successfully!`);
      } else {
        toast.error("Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload error occurred");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Determine mode based on selectedTurf
    const isEdit = !!selectedTurf;
    const methodName = isEdit ? "update_field" : "add_field";

    // 2. Validate ID for Edit mode
    if (isEdit && !selectedTurf?.id) {
      toast.error("No ID found for the field you are trying to update");
      return;
    }

    setLoading(true);

    // 3. Construct the body - DIFFERENT for add vs update
    let body: any;

    if (isEdit) {
      // UPDATE: Include all fields including display_order and is_active
      body = {
        p_id: selectedTurf.id,
        p_name: formData.name,
        p_description: formData.description,
        p_background_image_url: formData.background_image_url,
        p_icon_url: formData.icon_url,
        p_size: formData.size,
        p_player_capacity: Number(formData.player_capacity),
        p_is_active: formData.is_active,
        p_display_order: formData.display_order,
      };
    } else {
      // ADD: Only include fields that add_field accepts (no display_order, no is_active)
      body = {
        p_name: formData.name,
        p_description: formData.description,
        p_background_image_url: formData.background_image_url,
        p_icon_url: formData.icon_url,
        p_size: formData.size,
        p_player_capacity: Number(formData.player_capacity),
      };
    }

    try {
      const res = await fetch(`${BASE_URL}/rest/v1/rpc/${methodName}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const errorData = await res.json();
        console.error("Payload sent:", body);
        console.error("Supabase Error:", errorData);
        toast.error(errorData.message || "Failed to save field");
        return;
      }

      const result = await res.json();
      console.log("Success:", result);

      // SUCCESS TOASTS
      if (isEdit) {
        toast.success("Field updated successfully!");
      } else {
        toast.success("Field created successfully!");
      }

      setIsModalOpen(false);
      setSelectedTurf(null);
      fetchTurfs();
    } catch (err) {
      console.error("Network error:", err);
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
      if (response.ok) {
        const remaining = turfs
          .filter((t) => t.id !== id)
          .map((t, i) => ({ ...t, display_order: i + 1 }));
        setTurfs(remaining);
        await syncOrderToDatabase(remaining);
        toast.success("Field deleted successfully!");
      } else {
        toast.error("Failed to delete field");
      }
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Network error during deletion");
    } finally {
      setLoading(false);
    }
  };

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
        display_order: turf.display_order,
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

  return {
    turfs,
    formData,
    setFormData,
    loading,
    uploading,
    isModalOpen,
    setIsModalOpen,
    selectedTurf,
    onDragEnd,
    handleFileUpload,
    handleSubmit,
    handleDelete,
    openModal,
  };
}