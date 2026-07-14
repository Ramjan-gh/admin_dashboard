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
      <p className="text-sm text-gray-500 py-4 text-center">
        No fields available
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
      {fields.map((field) => {
        const isSelected = field.id === selectedFieldId;
        return (
          <button
            key={field.id}
            type="button"
            onClick={() => onSelect(field.id)}
            className={`
              flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all
              active:scale-[0.98] touch-manipulation min-h-[88px]
              ${
                isSelected
                  ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200"
                  : "border-gray-200 bg-white hover:border-blue-300 hover:bg-gray-50"
              }
            `}
          >
            {field.icon_url ? (
              <img
                src={field.icon_url}
                alt=""
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
            ) : (
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-sm">
                  {field.name.charAt(0)}
                </span>
              </div>
            )}
            <span
              className={`text-xs sm:text-sm font-semibold text-center leading-tight line-clamp-2 ${
                isSelected ? "text-blue-700" : "text-gray-700"
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
