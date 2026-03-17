"use client";

import { type ReactNode, useEffect } from "react";
import { cn } from "../../lib/utils";

export type DocumentPreviewModalClassNames = Partial<{
  content: string;
  actions: string;
  closeButton: string;
  closeIcon: string;
  fileName: string;
  header: string;
  overlay: string;
  panel: string;
  title: string;
}>;

type DocumentPreviewModalProps = {
  actions?: ReactNode;
  children: ReactNode;
  classNames?: DocumentPreviewModalClassNames;
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
};

export function DocumentPreviewModal({
  actions,
  children,
  classNames,
  fileName,
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
    <div
      className={cn(
        "fixed inset-0 z-50 bg-black/45 p-4 md:p-8",
        classNames?.overlay,
      )}
    >
      <button
        type="button"
        className="absolute inset-0"
        onClick={onClose}
        aria-label="미리보기 닫기"
      />

      <div
        className={cn(
          "relative mx-auto flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-lg bg-white shadow-2xl md:rounded-xl",
          classNames?.panel,
        )}
      >
        <div
          className={cn(
            "flex items-start justify-between gap-4 border-gray-200 border-b px-5 py-4 md:px-7",
            classNames?.header,
          )}
        >
          <div className="min-w-0 flex-1">
            <h3
              className={cn(
                "font-semibold text-gray-900 text-xl",
                classNames?.title,
              )}
            >
              {title}
            </h3>
            <p
              className={cn(
                "mt-1 break-all text-gray-500 text-sm",
                classNames?.fileName,
              )}
            >
              {fileName}
            </p>
          </div>

          <div
            className={cn(
              "flex shrink-0 items-center gap-3",
              classNames?.actions,
            )}
          >
            {actions}
            <button
              type="button"
              onClick={onClose}
              className={cn(
                "inline-flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 transition hover:bg-gray-50 hover:text-gray-900",
                classNames?.closeButton,
              )}
              aria-label="미리보기 닫기"
            >
              <svg
                viewBox="0 0 24 24"
                className={cn("h-5 w-5", classNames?.closeIcon)}
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
        </div>

        <div
          className={cn(
            "flex min-h-0 flex-1 bg-gray-50 p-3 md:p-5",
            classNames?.content,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
