import { cn } from "../../lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Spinner({ size = "md", className }: SpinnerProps) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-8 w-8 border-2",
    lg: "h-12 w-12 border-3",
  };

  return (
    <output
      className={cn(
        "inline-block animate-spin rounded-full border-gray-300 border-t-primary-500",
        sizeClasses[size],
        className,
      )}
      aria-label="로딩 중"
    >
      <span className="sr-only">로딩 중...</span>
    </output>
  );
}

// 중앙 정렬 스피너
export function SpinnerCenter({ size = "md" }: SpinnerProps) {
  return (
    <div className="flex min-h-[200px] items-center justify-center">
      <Spinner size={size} />
    </div>
  );
}

// 페이지 전체 스피너
export function SpinnerFullPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-500 text-lg">불러오는 중...</p>
      </div>
    </div>
  );
}

// 버튼 내부 스피너
export function SpinnerButton() {
  return <Spinner size="sm" className="mr-2" />;
}
