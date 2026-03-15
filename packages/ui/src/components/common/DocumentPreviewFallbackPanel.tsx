import { cn } from "../../lib/utils";

type DocumentPreviewFallbackPanelProps = {
  message: string;
  href?: string;
  linkLabel?: string;
  minHeightClassName?: string;
  variant?: "error" | "neutral";
};

export function DocumentPreviewFallbackPanel({
  message,
  href,
  linkLabel = "새 탭에서 문서 열기",
  minHeightClassName = "min-h-[100vh]",
  variant = "error",
}: DocumentPreviewFallbackPanelProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-2xl bg-white px-6 text-center",
        minHeightClassName,
        variant === "error"
          ? "border border-red-100"
          : "border border-gray-300 border-dashed",
      )}
    >
      <p className="font-medium text-gray-900">{message}</p>
      {href ? (
        <a
          href={href}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-full bg-gray-900 px-5 py-2.5 font-semibold text-sm text-white transition hover:bg-black"
        >
          {linkLabel}
        </a>
      ) : null}
    </div>
  );
}
