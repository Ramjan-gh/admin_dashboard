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
          className={`bg-white w-80 rounded-xl overflow-hidden border border-blue-100 shadow-sm transition-shadow ${
            snapshot.isDragging ? "shadow-xl ring-2 ring-blue-500 z-50" : ""
          }`}
        >
          {/* Compact Image Header */}
          <div className="relative h-32 bg-gray-200">
            <div
              {...provided.dragHandleProps}
              className="absolute top-2 right-2 z-10 p-1.5 bg-white/90 backdrop-blur-sm rounded-md cursor-grab active:cursor-grabbing hover:bg-white shadow-sm"
            >
              <GripVertical className="w-4 h-4 text-gray-500" />
            </div>

            <img
              src={turf.background_image_url}
              alt={turf.name}
              className="w-full h-full object-cover"
            />

            {/* Display Order Badge */}
            <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm w-7 h-7 rounded-full flex justify-center items-center shadow-md border border-white">
              <span className="text-gray-900 text-xs font-black">
                {turf.display_order}
              </span>
            </div>

            {/* Sport Icon Badge */}
            <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-lg flex justify-center items-center shadow-md border border-white">
              <img
                src={turf.icon_url}
                className="w-5 h-5 object-contain"
                alt="sport icon"
              />
            </div>
          </div>

          {/* Card Body */}
          <div className="p-3 space-y-2.5">
            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-1.5">
              <StatBox label="Name" value={turf.name} />
              <StatBox label="Size" value={turf.size || "N/A"} />
              <StatBox label="Cap" value={turf.player_capacity || "-"} />
            </div>

            {/* Fixed Description Container (UI Defended & Readable) */}
            <div 
              title={turf.description || "No description provided"} 
              className="px-3 py-1.5 w-full text-blue-600 bg-blue-50/50 rounded-lg text-[11px] leading-relaxed text-left border border-blue-100 italic cursor-help line-clamp-2"
            >
              {turf.description || "No description provided"}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-1.5 pt-0.5">
              <button
                onClick={() => onEdit(turf)}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
              >
                <Edit className="w-3.5 h-3.5" />
                <span className="text-xs font-semibold">Edit</span>
              </button>
              <button
                onClick={() => onDelete(turf.id)}
                className="p-1.5 border border-red-100 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

// Cleaned up, bug-free StatBox component
function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="text-center p-1.5 rounded-md border border-blue-100 bg-blue-50/20 max-w-full overflow-hidden">
      <p className="text-[9px] uppercase font-bold text-gray-400 tracking-wider">
        {label}
      </p>
      <p className="text-xs font-bold text-blue-900 truncate mt-0.5">
        {value}
      </p>
    </div>
  );
}