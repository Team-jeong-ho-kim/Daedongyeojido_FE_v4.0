"use client";

import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { updateInterviewSchedule } from "@/api/applicationForm";
import { getErrorMessage } from "@/lib/error";
import type { InterviewScheduleDetail } from "@/types";
import {
  buildInterviewSchedulePayload,
  formatInterviewDateForDisplay,
  formatInterviewTimeForDisplay,
  type InterviewPeriod,
  isValidInterviewDate,
  parseInterviewScheduleFormValues,
  sanitizeDayInput,
  sanitizeHourInput,
  sanitizeMinuteInput,
  sanitizeMonthInput,
  sanitizeYearInput,
  selectAllInputText,
} from "./interviewScheduleTime";

interface InterviewScheduleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackdropClick: () => void;
  schedule: InterviewScheduleDetail | null;
  onUpdate?: () => void;
  isClubLeader?: boolean;
}

export function InterviewScheduleViewModal({
  isOpen,
  onClose,
  onBackdropClick,
  schedule,
  onUpdate,
  isClubLeader = false,
}: InterviewScheduleViewModalProps) {
  const titleId = useId();
  const modalRef = useRef<HTMLDivElement>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 편집 모드 상태
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [period, setPeriod] = useState<InterviewPeriod>("오후");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [place, setPlace] = useState("");

  // schedule이 변경되면 편집 필드 초기화
  useEffect(() => {
    if (!schedule) return;

    const formValues = parseInterviewScheduleFormValues(
      schedule.interviewSchedule,
      schedule.interviewTime,
    );

    setYear(formValues.year);
    setMonth(formValues.month);
    setDay(formValues.day);
    setPlace(schedule.place);
    setHour(formValues.hour);
    setMinute(formValues.minute);
    setPeriod(formValues.period);
  }, [schedule]);

  // 모달이 닫힐 때 편집 모드 해제
  useEffect(() => {
    if (!isOpen) {
      setIsEditMode(false);
    }
  }, [isOpen]);

  // 날짜와 시간 포맷팅 (조회 모드용)
  const getFormattedDate = () => {
    if (!schedule) return "";
    return formatInterviewDateForDisplay(schedule.interviewSchedule);
  };

  const getFormattedTime = () => {
    if (!schedule) return "";
    return formatInterviewTimeForDisplay(schedule.interviewTime);
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    if (!schedule) return;

    const formValues = parseInterviewScheduleFormValues(
      schedule.interviewSchedule,
      schedule.interviewTime,
    );

    setYear(formValues.year);
    setMonth(formValues.month);
    setDay(formValues.day);
    setPlace(schedule.place);
    setHour(formValues.hour);
    setMinute(formValues.minute);
    setPeriod(formValues.period);

    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!schedule) return;

    if (!isValidInterviewDate({ year, month, day })) {
      toast.error("올바른 면접 일자를 입력해주세요.");
      return;
    }

    if (!place.trim()) {
      toast.error("면접 장소를 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      const { interviewSchedule, interviewTime } =
        buildInterviewSchedulePayload({
          year,
          month,
          day,
          period,
          hour,
          minute,
        });

      await updateInterviewSchedule(schedule.scheduleId.toString(), {
        interviewSchedule,
        place: place.trim(),
        interviewTime,
      });

      toast.success("면접 일정이 변경되었습니다.");
      setIsEditMode(false);
      onUpdate?.();
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "면접 일정 변경에 실패했습니다.",
      );
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Escape 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isEditMode) {
          handleCancel();
        } else {
          onBackdropClick();
        }
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isOpen, isEditMode, onBackdropClick]);

  if (!isOpen || !schedule) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* 배경 */}
      <button
        type="button"
        aria-label="모달 닫기"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm focus:outline-none"
        onClick={isEditMode ? undefined : onBackdropClick}
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
          면접 일정 {isEditMode ? "수정" : "상세 조회"}
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

        {isEditMode ? (
          <>
            {/* 면접 일자 (편집 모드) */}
            <div className="mb-6">
              <p className="mb-3 font-semibold text-base text-gray-700">
                면접 일자
              </p>
              <div className="grid grid-cols-3 gap-4">
                <input
                  type="text"
                  inputMode="numeric"
                  value={year}
                  onChange={(e) => setYear(sanitizeYearInput(e.target.value))}
                  onFocus={(e) => selectAllInputText(e.currentTarget)}
                  placeholder="년도"
                  maxLength={4}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={month}
                  onChange={(e) => setMonth(sanitizeMonthInput(e.target.value))}
                  onFocus={(e) => selectAllInputText(e.currentTarget)}
                  placeholder="월"
                  maxLength={2}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={day}
                  onChange={(e) => setDay(sanitizeDayInput(e.target.value))}
                  onFocus={(e) => selectAllInputText(e.currentTarget)}
                  placeholder="날짜"
                  maxLength={2}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 면접 시간 (편집 모드) */}
            <div className="mb-6">
              <p className="mb-3 font-semibold text-base text-gray-700">
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
                  type="text"
                  inputMode="numeric"
                  value={hour}
                  onChange={(e) => setHour(sanitizeHourInput(e.target.value))}
                  onFocus={(e) => selectAllInputText(e.currentTarget)}
                  placeholder="시"
                  maxLength={2}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
                />
                <input
                  type="text"
                  inputMode="numeric"
                  value={minute}
                  onChange={(e) =>
                    setMinute(sanitizeMinuteInput(e.target.value))
                  }
                  onFocus={(e) => selectAllInputText(e.currentTarget)}
                  placeholder="분"
                  maxLength={2}
                  className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-center text-gray-700 focus:border-primary-500 focus:outline-none"
                />
              </div>
            </div>

            {/* 면접 장소 (편집 모드) */}
            <div className="mb-10">
              <p className="mb-3 font-semibold text-base text-gray-700">
                면접 장소
              </p>
              <input
                type="text"
                value={place}
                onChange={(e) => setPlace(e.target.value)}
                placeholder="면접 장소를 입력해주세요."
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 placeholder-gray-400 focus:border-primary-500 focus:outline-none"
              />
            </div>
          </>
        ) : (
          <>
            {/* 면접 일자 (조회 모드) */}
            <div className="mb-6">
              <p className="mb-2 font-semibold text-base text-gray-700">
                면접 일자
              </p>
              <p className="text-gray-900 text-xl">{getFormattedDate()}</p>
            </div>

            {/* 면접 시간 (조회 모드) */}
            <div className="mb-6">
              <p className="mb-2 font-semibold text-base text-gray-700">
                면접 시간
              </p>
              <p className="text-gray-900 text-xl">{getFormattedTime()}</p>
            </div>

            {/* 면접 장소 (조회 모드) */}
            <div className="mb-10">
              <p className="mb-2 font-semibold text-base text-gray-700">
                면접 장소
              </p>
              <p className="text-gray-900 text-xl">{schedule.place}</p>
            </div>
          </>
        )}

        {/* 버튼 */}
        {isEditMode ? (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex-1 rounded-lg bg-gray-400 py-4 font-semibold text-lg text-white transition-colors duration-200 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="flex-1 rounded-lg bg-primary-500 py-4 font-semibold text-lg text-white transition-colors duration-200 hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaving ? "저장 중..." : "저장"}
            </button>
          </div>
        ) : (
          <div className="flex gap-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-400 py-4 font-semibold text-lg text-white transition-colors duration-200 hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              닫기
            </button>
            {isClubLeader && (
              <button
                type="button"
                onClick={handleEdit}
                className="flex-1 rounded-lg border border-primary-500 bg-white py-4 font-semibold text-lg text-primary-500 transition-colors duration-200 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                변경
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
