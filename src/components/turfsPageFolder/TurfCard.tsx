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
          className={`bg-white w-96 rounded-2xl overflow-hidden border border-gray-200 shadow-sm transition-shadow ${
            snapshot.isDragging ? "shadow-2xl ring-2 ring-blue-500 z-50" : ""
          }`}
        >
          <div className="relative h-48 bg-gray-200">
            <div
              {...provided.dragHandleProps}
              className="absolute top-3 right-3 z-10 p-2 bg-white/90 backdrop-blur-sm rounded-lg cursor-grab active:cursor-grabbing hover:bg-white shadow-sm"
            >
              <GripVertical className="w-5 h-5 text-gray-500" />
            </div>

            <img
              src={turf.background_image_url}
              alt={turf.name}
              className="w-full h-full object-cover"
            />

            <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm w-10 h-10 rounded-full flex justify-center items-center shadow-lg border border-white">
              <span className="text-gray-900 font-bold">
                {turf.display_order}
              </span>
            </div>

            <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-2 rounded-xl flex justify-center items-center shadow-lg border border-white">
              <img
                src={turf.icon_url}
                className="w-6 h-6 object-contain"
                alt="sport icon"
              />
            </div>
          </div>

          <div className="p-5 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <StatBox label="Name" value={turf.name} color="blue" />
              <StatBox label="Size" value={turf.size || "N/A"} color="purple" />
              <StatBox
                label="Cap"
                value={turf.player_capacity || "-"}
                color="pink"
              />
            </div>

            <div className="px-4 py-2.5 w-full bg-gray-50 text-gray-600 rounded-xl text-xs text-center border border-gray-100 italic">
              {turf.description || "No description provided"}
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => onEdit(turf)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-colors shadow-sm"
              >
                <Edit className="w-4 h-4" />
                <span className="text-sm font-semibold">Edit</span>
              </button>
              <button
                onClick={() => onDelete(turf.id)}
                className="p-2.5 border border-red-100 text-red-500 rounded-xl hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: string | number;
  color: string;
}) {
  const colors: any = {
    blue: "bg-blue-50 border-blue-100 text-blue-400 text-blue-900",
    purple: "bg-purple-50 border-purple-100 text-purple-400 text-purple-900",
    pink: "bg-pink-50 border-pink-100 text-pink-400 text-pink-900",
  };
  const classes = colors[color].split(" ");
  return (
    <div
      className={`text-center p-2 ${classes[0]} rounded-xl border ${classes[1]}`}
    >
      <p className={`text-[10px] uppercase font-black ${classes[2]}`}>
        {label}
      </p>
      <p className={`text-xs font-bold ${classes[3]} truncate`}>{value}</p>
    </div>
  );
}
