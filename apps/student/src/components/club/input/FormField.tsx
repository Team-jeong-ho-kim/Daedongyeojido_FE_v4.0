interface FormFieldProps {
  label: string;
  htmlFor?: string;
  alignTop?: boolean;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  alignTop,
  children,
}: FormFieldProps) {
  return (
    <div
      className={`grid grid-cols-[200px_1fr] py-6 ${alignTop ? "" : "items-center"}`}
    >
      <label
        htmlFor={htmlFor}
        className={`pl-8 font-medium text-[15px] ${alignTop ? "pt-3" : ""}`}
      >
        {label}
      </label>
      <div className="mr-8">{children}</div>
    </div>
  );
}
