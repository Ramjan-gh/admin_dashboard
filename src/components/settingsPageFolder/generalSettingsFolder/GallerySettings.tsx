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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Images className="w-5 h-5 text-purple-600" /> Gallery
        </h2>
        <label className="cursor-pointer bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          Add Image
          <input
            type="file"
            onChange={onUpload}
            className="hidden"
            disabled={loading}
          />
        </label>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((item) => (
          <div
            key={item.id}
            className="relative group rounded-xl overflow-hidden border"
          >
            <img
              src={item.file_url}
              className="w-full h-40 object-cover"
              alt="Gallery Image"
            />
            <button
              onClick={() => onDelete(item)}
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
