"use client";

import { type ReactNode, useEffect } from "react";

type DocumentPreviewModalProps = {
  children: ReactNode;
  fileName: string;
  hideHeader?: boolean;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export function DocumentPreviewModal({
  children,
  fileName,
  hideHeader = false,
  isOpen,
  onClose,
  title = "문서 미리보기",
}: DocumentPreviewModalProps) {
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/45 p-4 md:p-8">
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="미리보기 닫기"
      />

      <div className="relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-[12px] bg-white shadow-2xl">
        {!hideHeader ? (
          <div className="flex items-start justify-between gap-4 border-gray-200 border-b px-5 py-4 md:px-7">
            <div>
              <h3 className="font-semibold text-gray-900 text-xl">{title}</h3>
              <p className="mt-1 break-all text-gray-500 text-sm">{fileName}</p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900"
              aria-label="미리보기 닫기"
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18" />
                <path d="m6 6 12 12" />
              </svg>
            </button>
          </div>
        ) : null}

        <div className="flex-1 bg-gray-50 p-3 md:p-5">{children}</div>
      </div>
    </div>
  );
}
