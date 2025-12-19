import { useId } from "react";

interface TextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  id?: string;
}

export default function TextArea({
  value,
  onChange,
  placeholder,
  rows = 12,
  id,
}: TextAreaProps) {
  const generatedId = useId();
  const textareaId = id || generatedId;

  return (
    <textarea
      id={textareaId}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={rows}
      className="w-full resize-none rounded-md bg-white px-4 py-3.5 text-[14px] placeholder-[#AAAAAA] focus:outline-none"
    />
  );
}
