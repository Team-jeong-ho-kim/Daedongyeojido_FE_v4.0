import { Spinner } from "./Spinner";

interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}

export function LoadingOverlay({
  isLoading,
  message = "처리 중...",
}: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="rounded-2xl bg-white p-8 shadow-2xl">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" />
          <p className="font-medium text-gray-900 text-lg">{message}</p>
        </div>
      </div>
    </div>
  );
}
