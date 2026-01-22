import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { Plus } from "lucide-react";
import { TurfCard } from "./turfsPageFolder/TurfCard";
import { TurfModal } from "./turfsPageFolder/TurfModal";
import { useTurfs } from "./turfsPageFolder/useTurfs"; // Import the logic

export function TurfsPage() {
  // Extract everything from the hook
  const {
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
  } = useTurfs();

  return (
    <div className="p-4 lg:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fields</h1>
          <p className="text-gray-500">
            Manage your fields and sports facilities
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-xl hover:shadow-lg transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span className="font-semibold">Add New Field</span>
        </button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="turfs-grid" direction="vertical">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-6 min-h-[500px]"
            >
              {turfs.map((turf, index) => (
                <TurfCard
                  key={turf.id}
                  turf={turf}
                  index={index}
                  onEdit={openModal}
                  onDelete={handleDelete}
                />
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      <TurfModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        selectedTurf={selectedTurf}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
        uploading={uploading}
        loading={loading}
      />
    </div>
  );
}
