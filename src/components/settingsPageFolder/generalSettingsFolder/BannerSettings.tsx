import { Plus, Trash2, Loader2, Image as ImageIcon } from "lucide-react";

// Assuming types are correct, otherwise declare inline if needed
interface Banner {
  id: string | number;
  file_url: string;
}

interface Props {
  banners: Banner[];
  loading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete: (banner: Banner) => void;
}

export function BannerSettings({
  banners,
  loading,
  onUpload,
  onDelete,
}: Props) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header section with responsive layout scaling */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-600" /> 
          <span>Promotional Banners</span>
        </h2>
        
        <label className={`cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 sm:py-2 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 shadow-sm transition-colors ${loading ? 'opacity-70 pointer-events-none' : ''}`}>
          {loading ? (
            <Loader2 className="animate-spin w-4 h-4" />
          ) : (
            <Plus className="w-4 h-4" />
          )}
          <span>Add Banner</span>
          <input
            type="file"
            onChange={onUpload}
            className="hidden"
            disabled={loading}
            accept="image/*"
          />
        </label>
      </div>

      {/* Grid: 1 column on small phones, 2 columns on tablets, 3 on desktops */}
      {banners.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {banners.map((banner) => (
            <div
              key={banner.id}
              className="relative group rounded-xl overflow-hidden border border-gray-100 shadow-sm bg-gray-50 aspect-[21/9] sm:aspect-auto sm:h-40"
            >
              <img
                src={banner.file_url}
                className="w-full h-full object-cover"
                alt="Banner advertisement"
              />
              
              {/* FIXED DESTRUCTION ACTION ON MOBILE: Visible by default on touch screens, group-hovered on desktop */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:opacity-0 md:group-hover:opacity-100 transition-opacity pointer-events-none" />
              
              <button
                onClick={() => onDelete(banner)}
                className="absolute top-2 right-2 p-2 bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-md md:opacity-0 md:group-hover:opacity-100 transition-all active:scale-95"
                title="Delete banner"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State Placeholder */
        <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50/50">
          <ImageIcon className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-sm font-medium text-gray-500">No banners uploaded yet</p>
          <p className="text-xs text-gray-400 mt-0.5">Upload images to display as promotional banners</p>
        </div>
      )}
    </div>
  );
}