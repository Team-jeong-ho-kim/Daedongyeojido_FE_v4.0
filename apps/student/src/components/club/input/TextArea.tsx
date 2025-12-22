import { useId } from "react";
import ErrorMessage from "@/components/common/ErrorMessage";

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
  name?: string;
  label?: string;
  error?: string;
}

export default function TextArea({
  value,
  onChange,
  placeholder,
  rows = 8,
  id,
  name,
  label,
  error,
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  const textarea = (
    <div className={label ? "flex-1" : undefined}>
      <textarea
        id={textareaId}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className={`w-full resize-none rounded-lg border-[0.1px] border-gray-200 bg-white px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-200 focus:border-primary-500 focus:ring-primary-500"
        }`}
      />
      <ErrorMessage message={error} />
    </div>
  );

  if (!label) return textarea;

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-0">
      <label
        htmlFor={textareaId}
        className="w-full font-normal text-base text-gray-900 md:w-32 md:pt-3.5"
      >
        {label}
      </label>
      {textarea}
    </div>
  );
}
