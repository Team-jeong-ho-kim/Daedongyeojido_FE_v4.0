"use client";

import { useCallback, useEffect, useId, useRef } from "react";

interface ApplicationConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onBackdropClick: () => void;
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
  title,
  description,
  cancelText,
  confirmText,
}: ApplicationConfirmModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  // 포커스 가능한 요소들 찾기
  const getFocusableElements = useCallback(() => {
    if (!modalRef.current) return [];
    return Array.from(
      modalRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      ),
    );
  }, []);

  // 포커스 트랩
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBackdropClick();
        return;
      }

      if (e.key !== "Tab") return;

      const focusableElements = getFocusableElements();
      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [getFocusableElements, onBackdropClick],
  );

  // 모달 열릴 때 포커스 관리
  useEffect(() => {
    if (!isOpen) return;

    // 현재 포커스된 요소 저장
    previousActiveElement.current = document.activeElement;

    // 모달 내 첫 번째 포커스 가능 요소로 이동
    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      setTimeout(() => focusableElements[0].focus(), 0);
    }

    // Escape 및 Tab 키 리스너 추가
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // 포커스 복원
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    };
  }, [isOpen, getFocusableElements, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 블러 */}
      <button
        type="button"
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm focus:outline-none"
        onClick={onBackdropClick}
      />

      {/* 모달 */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-[90%] max-w-md rounded-2xl bg-white p-8 shadow-2xl"
      >
        {/* 제목 */}
        <h2
          id={titleId}
          className="mb-2 text-left font-bold text-[18px] text-gray-900"
        >
          {title}
        </h2>

        {/* 설명 */}
        <p className="mb-8 text-left text-gray-400 text-sm">{description}</p>

        {/* 버튼 */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-[12px] bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-[12px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d] focus:outline-none focus:ring-2 focus:ring-[#E85D5D] focus:ring-offset-2"
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
