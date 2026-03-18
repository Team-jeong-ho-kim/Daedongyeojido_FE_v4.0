import { cn } from "../../lib/utils";
import { Spinner } from "./Spinner";

interface LoadingStateProps {
  className?: string;
  description?: string;
  message?: string;
  minHeightClassName?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingState({
  className,
  description,
  message = "불러오는 중...",
  minHeightClassName = "min-h-[220px]",
  size = "md",
}: LoadingStateProps) {
  return (
    <div
      className={cn(
        "flex w-full flex-col items-center justify-center gap-3 rounded-xl border border-gray-200 bg-gray-50 px-6 py-10 text-center",
        minHeightClassName,
        className,
      )}
    >
      <Spinner size={size} />
      <div className="space-y-1">
        <p className="font-medium text-gray-900 text-sm md:text-base">
          {message}
        </p>
        {description ? (
          <p className="text-gray-500 text-xs leading-6 md:text-sm">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}
