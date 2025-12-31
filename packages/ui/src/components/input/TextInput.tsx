"use client";

import { useId } from "react";
import ErrorMessage from "./ErrorMessage";

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  name?: string;
  label?: string;
  error?: string;
}

export default function TextInput({
  value,
  onChange,
  placeholder,
  id,
  name,
  label,
  error,
}: TextInputProps) {
  const generatedId = useId();
  const inputId = id || generatedId;

  const input = (
    <div className={label ? "flex-1" : undefined}>
      <input
        id={inputId}
        type="text"
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-lg border-[0.1px] border-gray-200 bg-white px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-200 focus:border-primary-500 focus:ring-primary-500"
        }`}
      />
      <ErrorMessage message={error} />
    </div>
  );

  if (!label) return input;

  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-start md:gap-0">
      <label
        htmlFor={inputId}
        className="w-full font-normal text-base text-gray-900 md:w-32 md:pt-3.5"
      >
        {label}
      </label>
      {input}
    </div>
  );
}
