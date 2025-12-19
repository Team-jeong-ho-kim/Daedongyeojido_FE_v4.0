import { useId } from "react";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
}

export default function TextInput({
  value,
  onChange,
  placeholder,
  id,
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <input
      id={inputId}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md bg-white px-4 py-3.5 text-[14px] placeholder-[#AAAAAA] focus:outline-none"
    />
  );
}
