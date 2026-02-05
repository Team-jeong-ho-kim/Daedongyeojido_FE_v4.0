"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { ApplicationFormListItem } from "@/types";

interface ApplicationFormSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (applicationFormId: number) => void;
  applicationForms: ApplicationFormListItem[];
}

export function ApplicationFormSelectModal({
  isOpen,
  onClose,
  onConfirm,
  applicationForms,
}: ApplicationFormSelectModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);
  const [selectedFormId, setSelectedFormId] = useState<number | null>(null);

  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }, []);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [getFocusableElements, onClose],
  );

  useEffect(() => {
    if (!isOpen) return;

    previousActiveElement.current = document.activeElement;

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      setTimeout(() => focusableElements[0].focus(), 0);
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, getFocusableElements, handleKeyDown]);

  useEffect(() => {
    if (!isOpen) {
      setSelectedFormId(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (selectedFormId !== null) {
      onConfirm(selectedFormId);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm focus:outline-none"
        onClick={onClose}
      />

      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-[90%] max-w-lg rounded-2xl bg-white p-8 shadow-2xl"
      >
        <h2
          id={titleId}
          className="mb-2 text-left font-bold text-[18px] text-gray-900"
        >
          지원서 폼 선택
        </h2>

        <p className="mb-6 text-left text-gray-400 text-sm">
          공고에 연결할 지원서 폼을 선택해주세요
        </p>

        {applicationForms.length === 0 ? (
          <div className="mb-6 flex items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-8">
            <p className="text-gray-500 text-sm">
              등록된 지원서 폼이 없습니다.
              <br />
              먼저 지원서 폼을 생성해주세요.
            </p>
          </div>
        ) : (
          <div className="mb-6 max-h-[400px] space-y-3 overflow-y-auto">
            {applicationForms.map((form) => (
              <button
                key={form.applicationFormId}
                type="button"
                onClick={() => setSelectedFormId(form.applicationFormId)}
                className={`w-full rounded-lg border-2 p-4 text-left transition-all duration-200 ${
                  selectedFormId === form.applicationFormId
                    ? "border-[#E85D5D] bg-[#E85D5D]/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="mb-1 font-semibold text-gray-900">
                      {form.applicationFormTitle}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      마감일:{" "}
                      {form.submissionDuration
                        ? Array.isArray(form.submissionDuration)
                          ? form.submissionDuration
                              .map((n) => String(n).padStart(2, "0"))
                              .join("-")
                          : String(form.submissionDuration)
                        : "미정"}
                    </p>
                  </div>
                  {selectedFormId === form.applicationFormId && (
                    <div className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#E85D5D]">
                      <svg
                        className="h-3 w-3 text-white"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-label="선택됨"
                      >
                        <title>선택됨</title>
                        <path d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}

        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={selectedFormId === null || applicationForms.length === 0}
            className="rounded-[12px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d] focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:hover:bg-gray-300"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
