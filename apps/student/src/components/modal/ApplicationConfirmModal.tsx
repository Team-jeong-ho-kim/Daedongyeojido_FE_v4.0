import Link from "next/link";

interface ApplicationConfirmModalProps {
  isOpen: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  onBackdropClick?: () => void;
  closeHref?: string;
  confirmHref?: string;
  title: string;
  description: string;
  cancelText: string;
  confirmText: string;
}

export function ApplicationConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  onBackdropClick,
  closeHref,
  confirmHref,
  title = "title",
  description = "description",
  cancelText = "close",
  confirmText = "confirm",
}: ApplicationConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 */}
      <button
        type="button"
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onBackdropClick}
      />

      {/* 모달 */}
      <div className="relative w-[90%] max-w-md rounded-2xl bg-white p-8 shadow-2xl">
        {/* 제목 */}
        <h2 className="mb-2 text-left font-bold text-[18px] text-gray-900">
          {title}
        </h2>

        {/* 설명 */}
        <p className="mb-8 text-left text-gray-400 text-sm">{description}</p>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          {/* Cancel Button */}
          {closeHref ? (
            <Link
              href={closeHref}
              onClick={onClose}
              className="rounded-[12px] bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500"
            >
              {cancelText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="rounded-[12px] bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500"
            >
              {cancelText}
            </button>
          )}

          {/* Confirm Button */}
          {confirmHref ? (
            <Link
              href={confirmHref}
              onClick={onConfirm}
              className="rounded-[12px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d]"
            >
              {confirmText}
            </Link>
          ) : (
            <button
              type="button"
              onClick={onConfirm}
              className="rounded-[12px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d]"
            >
              {confirmText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
