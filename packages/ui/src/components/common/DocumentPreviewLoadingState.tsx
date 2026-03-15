import { Spinner } from "./Spinner";

type DocumentPreviewLoadingStateProps = {
  message?: string;
  ariaLabel?: string;
  minHeightClassName?: string;
};

export function DocumentPreviewLoadingState({
  message = "로딩 중...",
  ariaLabel = "문서 미리보기 로딩 중",
  minHeightClassName = "min-h-[100vh]",
}: DocumentPreviewLoadingStateProps) {
  return (
    <div
      className={`flex ${minHeightClassName} items-center justify-center rounded-2xl border border-gray-200 bg-white`}
    >
      <output
        aria-live="polite"
        aria-label={ariaLabel}
        className="flex flex-col items-center gap-3 text-center"
      >
        <Spinner size="lg" />
        <p className="text-gray-500 text-sm">{message}</p>
      </output>
    </div>
  );
}
