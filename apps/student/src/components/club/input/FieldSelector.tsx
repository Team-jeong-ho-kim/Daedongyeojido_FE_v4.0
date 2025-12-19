"use client";

interface FieldSelectorProps {
  fields: string[];
  selectedFields: string[];
  onSelectionChange: (fields: string[]) => void;
}

export default function FieldSelector({
  fields,
  selectedFields,
  onSelectionChange,
}: FieldSelectorProps) {
  const toggleField = (field: string) => {
    if (selectedFields.includes(field)) {
      onSelectionChange(selectedFields.filter((f) => f !== field));
    } else {
      onSelectionChange([...selectedFields, field]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {fields.map((field) => (
        <button
          key={field}
          type="button"
          onClick={() => toggleField(field)}
          className={`rounded-full border px-5 py-2 text-[13px] transition-colors ${
            selectedFields.includes(field)
              ? "border-[#FF8585] bg-[#FF8585] text-white"
              : "border-[#D5D5D5] bg-white text-[#666666] hover:border-[#BBBBBB]"
          }`}
        >
          {field}
        </button>
      ))}
    </div>
  );
}
