import { UploadCloud, Camera, Loader2 } from "lucide-react";

// Type 
import { ImageUploadProps } from "../types";

export function ImageUploadField({
  label,
  url,
  uploading,
  onUpload,
  type,
}: ImageUploadProps) {
  const isBg = type === "bg";
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-gray-400 uppercase ml-1">
        {label}
      </label>
      <div
        className={`relative h-28 rounded-2xl border-2 border-dashed border-gray-200 flex items-center justify-center bg-gray-50 group transition-colors overflow-hidden ${isBg ? "hover:border-blue-400" : "hover:border-purple-400"}`}
      >
        {url ? (
          <img
            src={url}
            className={
              isBg ? "w-full h-full object-cover" : "w-12 h-12 object-contain"
            }
            alt="preview"
          />
        ) : (
          <div className="text-center">
            {isBg ? (
              <UploadCloud className="text-gray-300 w-8 h-8 mx-auto" />
            ) : (
              <Camera className="text-gray-300 w-8 h-8 mx-auto" />
            )}
            <span className="text-[10px] text-gray-400">
              Upload {isBg ? "JPG/PNG" : "Icon"}
            </span>
          </div>
        )}
        <input
          type="file"
          className="absolute inset-0 opacity-0 cursor-pointer"
          onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
        />
        {uploading && (
          <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
            <Loader2
              className={`animate-spin w-6 h-6 ${isBg ? "text-blue-600" : "text-purple-600"}`}
            />
          </div>
        )}
      </div>
    </div>
  );
}
