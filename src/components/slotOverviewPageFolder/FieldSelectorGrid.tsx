import { Field } from "../types";

type Props = {
  fields: Field[];
  selectedFieldId: string;
  onSelect: (id: string) => void;
};

export function FieldSelectorGrid({
  fields,
  selectedFieldId,
  onSelect,
}: Props) {
  if (fields.length === 0) {
    return (
      <p className="text-sm text-gray-500 py-6 text-center" role="status">
        No fields available
      </p>
    );
  }

  return (
    <div 
      role="radiogroup" 
      aria-label="Select a field"
      className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 lg:grid-cols-4 xl:grid-cols-5"
    >
      {fields.map((field) => {
        const isSelected = field.id === selectedFieldId;
        return (
          <button
            key={field.id}
            type="button"
            role="radio"
            aria-checked={isSelected}
            onClick={() => onSelect(field.id)}
            className={`
              flex flex-col items-center justify-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all
              active:scale-[0.98] touch-manipulation min-h-[100px] w-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
              ${
                isSelected
                  ? "border-blue-500 bg-blue-50/50 shadow-sm ring-1 ring-blue-500"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50/70"
              }
            `}
          >
            {/* Visual Icon Container */}
            <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 shrink-0">
              {field.icon_url ? (
                <img
                  src={field.icon_url}
                  alt="" // Intentionally blank because the text label below describes the button's action
                  className="w-full h-full object-contain"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-base uppercase">
                    {field.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Label */}
            <span
              className={`text-xs sm:text-sm font-medium text-center leading-tight line-clamp-2 ${
                isSelected ? "text-blue-700 font-semibold" : "text-gray-700"
              }`}
            >
              {field.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}