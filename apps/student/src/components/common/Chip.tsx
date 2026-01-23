interface ChipProps {
  children: React.ReactNode;
  active?: boolean;
}

export function Chip({ children, active }: ChipProps) {
  return (
    <span
      className={[
        "inline-flex h-8 items-center rounded-full border px-4 font-normal text-xs",
        active
          ? "border-primary-500 bg-primary-50 text-primary-500"
          : "border-gray-400 bg-white text-gray-500",
      ].join(" ")}
    >
      {children}
    </span>
  );
}
