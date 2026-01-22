import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

// Types 
import { Props } from "../types";

export function BannerSettings({
  banners,
  loading,
  onUpload,
  onDelete,
}: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-purple-600" /> Promotional Banners
        </h2>
        <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Banner
          <input
            type="file"
            onChange={onUpload}
            className="hidden"
            disabled={loading}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div
            key={banner.id}
            className="relative group rounded-xl overflow-hidden border"
          >
            <img
              src={banner.file_url}
              className="w-full h-40 object-cover"
              alt="Banner"
            />
            <button
              onClick={() => onDelete(banner)}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
