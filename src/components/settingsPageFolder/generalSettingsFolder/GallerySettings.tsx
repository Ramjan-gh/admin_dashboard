import React from "react";
import { Plus, Trash2, Loader2, Images } from "lucide-react";

interface MediaItem {
  id: any;
  file_url: string;
  media_type: string;
}

interface GallerySettingsProps {
  gallery: MediaItem[];
  loading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (item: MediaItem) => void;
}

export function GallerySettings({
  gallery,
  loading,
  onUpload,
  onDelete,
}: GallerySettingsProps) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header with smart stacking layout for small screens */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <Images className="w-5 h-5 text-blue-500" /> Gallery
        </h2>
        
        <label className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>Add Image</span>
          <input
            type="file"
            onChange={onUpload}
            className="hidden"
            disabled={loading}
            accept="image/*"
          />
        </label>
      </div>

      {/* Grid structure: 2 columns on mobile, 3 on small tablets, 4 on desktop */}
      {gallery.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
          {gallery.map((item) => (
            <div
              key={item.id}
              className="relative group rounded-xl overflow-hidden border border-gray-100 bg-gray-50 shadow-sm aspect-square"
            >
              <img
                src={item.file_url}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                alt="Gallery Media Content"
                loading="lazy"
              />
              
              {/* Touch-safe dark overlay layer: Visible on mobile tap targets, hidden on desktop until hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <button
                onClick={() => onDelete(item)}
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md md:opacity-0 md:group-hover:opacity-100 transition-all active:scale-95"
                title="Delete gallery image"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Layout */
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50">
          <Images className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-500">No images inside your gallery</p>
          <p className="text-xs text-gray-400 mt-0.5">Upload photos to populate your storefront gallery</p>
        </div>
      )}
    </div>
  );
}