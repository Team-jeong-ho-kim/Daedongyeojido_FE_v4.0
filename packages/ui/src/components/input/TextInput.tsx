"use client";

import type { InputHTMLAttributes } from "react";
import { useId } from "react";
import ErrorMessage from "./ErrorMessage";

interface TextInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  bgColor?: string;
}

export default function TextInput({
  value,
  onChange,
  placeholder,
  id,
  name,
  label,
  error,
  bgColor = "bg-white",
  disabled = false,
  ...restProps
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
        disabled={disabled}
        {...restProps}
        className={`w-full rounded-lg border-[0.1px] border-gray-200 ${bgColor} px-4 py-3.5 text-base text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${
          error
            ? "border-red-300 focus:border-red-500 focus:ring-red-500"
            : "border-gray-200 focus:border-primary-500 focus:ring-primary-500"
        } ${disabled ? "cursor-not-allowed bg-gray-100 text-gray-500" : ""}`}
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
