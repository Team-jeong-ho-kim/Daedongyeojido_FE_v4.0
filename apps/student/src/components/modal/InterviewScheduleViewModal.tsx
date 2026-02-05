"use client";

import { useEffect, useId, useRef } from "react";
import type { InterviewScheduleDetail } from "@/api/applicationForm";

interface InterviewScheduleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackdropClick: () => void;
  schedule: InterviewScheduleDetail | null;
}

export function InterviewScheduleViewModal({
  isOpen,
  onClose,
  onBackdropClick,
  schedule,
}: InterviewScheduleViewModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);

  // 날짜와 시간 파싱
  const parseSchedule = () => {
    if (!schedule) return { formattedDate: "", formattedTime: "" };

    const [year, month, day] = schedule.interviewSchedule.split("-");
    const formattedDate = `${year}.${month}.${day}`;

    const [hour24Str] = schedule.interviewTime.split(":");
    const hour24 = Number.parseInt(hour24Str, 10);

    let hour = hour24;
    let period = "오후";

    if (hour24 === 0) {
      hour = 12;
      period = "오전";
    } else if (hour24 < 12) {
      period = "오전";
    } else if (hour24 === 12) {
      period = "오후";
    } else {
      hour = hour24 - 12;
      period = "오후";
    }

    const formattedTime = `${period} ${hour}시`;

    return { formattedDate, formattedTime };
  };

  const { formattedDate, formattedTime } = parseSchedule();

  // Escape 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onBackdropClick();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, onBackdropClick]);

  if (!isOpen || !schedule) return null;

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
          className="mb-8 text-left font-bold text-2xl text-gray-900"
        >
          면접 일정 상세 조회
        </h2>

        {/* 프로필 */}
        <div className="mb-8">
          <p className="mb-3 font-semibold text-base text-gray-700">프로필</p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-base text-gray-900">
            <span>
              이름 : <span className="font-semibold">{schedule.userName}</span>
            </span>
            <span>
              학번 :{" "}
              <span className="font-semibold">{schedule.classNumber}</span>
            </span>
            <div className="flex items-center gap-2">
              <span>지원 전공:</span>
              <span className="rounded-full border border-primary-500 bg-white px-4 py-1 font-medium text-primary-500 text-sm">
                {schedule.major}
              </span>
            </div>
          </div>
        </div>

        {/* 면접 일자 */}
        <div className="mb-6">
          <p className="mb-2 font-semibold text-base text-gray-700">
            면접 일자
          </p>
          <p className="text-gray-900 text-xl">{formattedDate}</p>
        </div>

        {/* 면접 시간 */}
        <div className="mb-6">
          <p className="mb-2 font-semibold text-base text-gray-700">
            면접 시간
          </p>
          <p className="text-gray-900 text-xl">{formattedTime}</p>
        </div>

        {/* 면접 장소 */}
        <div className="mb-10">
          <p className="mb-2 font-semibold text-base text-gray-700">
            면접 장소
          </p>
          <p className="text-gray-900 text-xl">{schedule.place}</p>
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
            onClick={() => {
              // 면접완료 처리 (아직 구현 안함)
            }}
            className="flex-1 rounded-lg bg-[#FF7575] py-4 font-semibold text-lg text-white transition-colors duration-200 hover:bg-[#FF6464] focus:outline-none focus:ring-2 focus:ring-[#FF7575] focus:ring-offset-2"
          >
            면접완료
          </button>
        </div>
      </div>
    </div>
  );
}
