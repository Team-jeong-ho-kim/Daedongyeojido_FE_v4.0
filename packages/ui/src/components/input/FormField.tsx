interface FormFieldProps {
  label: string;
  htmlFor?: string;
  alignTop?: boolean;
  required?: boolean;
  children: React.ReactNode;
}

export default function FormField({
  label,
  htmlFor,
  alignTop,
  required,
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
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <div className="mr-8">{children}</div>
    </div>
  );
}
