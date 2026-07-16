import { Draggable } from "@hello-pangea/dnd";
import { Edit, Trash2, GripVertical } from "lucide-react";

// Type 
import { TurfCardProps } from "../types";

export function TurfCard({ turf, index, onEdit, onDelete }: TurfCardProps) {
  return (
    <Draggable
      key={turf.id.toString()}
      draggableId={turf.id.toString()}
      index={index}
    >
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`bg-white w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl rounded-xl overflow-hidden border border-gray-150 transition-all ${
            snapshot.isDragging 
              ? "shadow-xl ring-2 ring-blue-500 scale-[1.01] z-50" 
              : "shadow-sm hover:shadow-md hover:border-gray-300"
          }`}
        >
          {/* Flex Container: Becomes a row layout on large screens to crush excessive vertical height */}
          <div className="flex flex-col sm:flex-row h-full">
            
            {/* Image Section */}
            <div className="relative h-28 sm:h-auto sm:w-2/5 md:w-1/3 min-h-[110px] bg-gray-100 shrink-0">
              <img
                src={turf.background_image_url}
                alt={turf.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t sm:bg-gradient-to-r from-black/40 via-transparent to-black/20" />

              {/* Display Order Badge */}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-md flex justify-center items-center border border-white/10">
                <span className="text-white text-[10px] font-bold tracking-tight">
                  #{turf.display_order}
                </span>
              </div>

              {/* Sport Icon Badge */}
              <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm p-1 rounded-md flex justify-center items-center shadow-sm border border-gray-100">
                <img
                  src={turf.icon_url}
                  className="w-3.5 h-3.5 object-contain"
                  alt="sport icon"
                />
              </div>
            </div>

            {/* Content Body Section */}
            <div className="p-3.5 flex-1 flex flex-col justify-between min-w-0">
              <div>
                {/* Header Title Row */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm sm:text-base truncate" title={turf.name}>
                      {turf.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 mt-0.5">
                      <span className="bg-gray-100 px-1.5 py-0.5 rounded font-medium truncate max-w-[120px]">
                        {turf.size || "Standard"}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="shrink-0">Cap: <strong className="text-gray-700 font-medium">{turf.player_capacity || "-"}</strong></span>
                    </div>
                  </div>

                  {/* Drag Handle moved safely beside title section */}
                  <div
                    {...provided.dragHandleProps}
                    className="p-1.5 bg-gray-50 hover:bg-gray-100 rounded-md cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 border border-gray-200 shrink-0 transition-colors"
                  >
                    <GripVertical className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Description Block */}
                <p 
                  title={turf.description || "No description provided"} 
                  className="text-xs text-gray-500 leading-relaxed line-clamp-2 mt-2"
                >
                  {turf.description || "No description provided."}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2.5 mt-3 border-t border-gray-150 items-center">
                <button
                  onClick={() => onEdit(turf)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 active:scale-[0.98] transition-all shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium">Edit</span>
                </button>
                <button
                  onClick={() => onDelete(turf.id)}
                  className="p-1.5 border border-gray-200 text-gray-400 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-100 active:scale-[0.95] transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </Draggable>
  );
}