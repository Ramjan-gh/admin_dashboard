import { X, Save, Loader2 } from "lucide-react";
import { ImageUploadField } from "./ImageUploadField";

export function TurfModal({
  isOpen,
  onClose,
  selectedTurf,
  formData,
  setFormData,
  onSubmit,
  onFileUpload,
  uploading,
  loading,
}: any) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900">
            {selectedTurf ? `Update ${formData.name}` : "Create New Field"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={onSubmit}
          className="p-6 space-y-5 overflow-y-auto max-h-[80vh]"
        >
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Field Name
              </label>
              <input
                type="text"
                className="w-full mt-1 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
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
                className="w-full mt-1 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Size
              </label>
              <input
                type="text"
                placeholder="e.g. 12m*24m"
                pattern="^\d+m\*\d+m$"
                className="w-full mt-1 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={formData.size}
                onChange={(e) =>
                  setFormData({ ...formData, size: e.target.value })
                }
                title="Format: 12m*24m (numbers with m, separated by *)"
              />
              <p className="text-xs text-gray-400 mt-1 ml-1">Format: 12m*24m</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">
                Player Capacity
              </label>
              <input
                type="number"
                min="0"
                placeholder="Enter capacity"
                className="w-full mt-1 border border-gray-200 p-3 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                value={
                  formData.player_capacity === 0 ? "" : formData.player_capacity
                }
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    player_capacity:
                      e.target.value === "" ? 0 : parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <ImageUploadField
              label="Background Image"
              type="bg"
              url={formData.background_image_url}
              uploading={uploading === "bg"}
              onUpload={(file) => onFileUpload(file, "bg")}
            />
            <ImageUploadField
              label="Sport Icon"
              type="icon"
              url={formData.icon_url}
              uploading={uploading === "icon"}
              onUpload={(file) => onFileUpload(file, "icon")}
            />
          </div>

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
  );
}
