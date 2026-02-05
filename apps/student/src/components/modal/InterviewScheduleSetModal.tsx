"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";

interface InterviewScheduleSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    interviewSchedule: string;
    place: string;
    interviewTime: string;
  }) => void;
  onBackdropClick: () => void;
}

export function InterviewScheduleSetModal({
  isOpen,
  onClose,
  onConfirm,
  onBackdropClick,
}: InterviewScheduleSetModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<Element | null>(null);

  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear.toString());
  const [month, setMonth] = useState("1");
  const [day, setDay] = useState("1");
  const [period, setPeriod] = useState<"오전" | "오후">("오후");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [place, setPlace] = useState("");

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
    [getFocusableElements, onBackdropClick],
  );

  // 모달 열릴 때 포커스 관리
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

  const handleConfirm = () => {
    if (!place.trim()) {
      alert("면접 장소를 입력해주세요.");
      return;
    }

    // 시간을 24시간 형식으로 변환
    let hour24 = Number.parseInt(hour, 10);
    if (period === "오후" && hour24 !== 12) {
      hour24 += 12;
    } else if (period === "오전" && hour24 === 12) {
      hour24 = 0;
    }

    const interviewSchedule = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const interviewTime = `${hour24.toString().padStart(2, "0")}:${minute}`;

    onConfirm({
      interviewSchedule,
      place: place.trim(),
      interviewTime,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <button
        type="button"
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm focus:outline-none"
        onClick={onBackdropClick}
      />

      {/* 모달 */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-[90%] max-w-2xl rounded-3xl bg-white p-12 shadow-2xl"
      >
        {/* 제목 */}
        <h2
          id={titleId}
          className="mb-10 text-left font-bold text-2xl text-gray-900"
        >
          면접 일정 지정
        </h2>

        {/* 면접 일자 */}
        <div className="mb-8">
          <p className="mb-4 block font-semibold text-gray-900 text-lg">
            면접 일자
          </p>
          <div className="grid grid-cols-3 gap-4">
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="년도"
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
            />
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              placeholder="월"
              min="1"
              max="12"
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
            />
            <input
              type="number"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              placeholder="날짜"
              min="1"
              max="31"
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 면접 시간 */}
        <div className="mb-8">
          <p className="mb-4 block font-semibold text-gray-900 text-lg">
            면접 시간
          </p>
          <div className="grid grid-cols-3 gap-4">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as "오전" | "오후")}
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
            >
              <option value="오전">오전</option>
              <option value="오후">오후</option>
            </select>
            <input
              type="number"
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              placeholder="시"
              min="1"
              max="12"
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
            />
            <input
              type="number"
              value={minute}
              onChange={(e) => setMinute(e.target.value.padStart(2, "0"))}
              placeholder="분"
              min="0"
              max="59"
              className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
            />
          </div>
        </div>

        {/* 면접 장소 */}
        <div className="mb-10">
          <p className="mb-4 block font-semibold text-gray-900 text-lg">
            면접 장소
          </p>
          <input
            type="text"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="면접 장소를 지정해주세요."
            className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-primary-500 focus:outline-none"
          />
        </div>

        {/* 버튼 */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg bg-gray-400 py-4 font-semibold text-lg text-white transition-colors duration-200 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            닫기
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 rounded-lg bg-primary-500 py-4 font-semibold text-lg text-white transition-colors duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            지정
          </button>
        </div>
      </div>
    </div>
  );
}
