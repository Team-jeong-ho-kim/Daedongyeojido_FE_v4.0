"use client";

import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { updateInterviewSchedule } from "@/api/applicationForm";
import { getErrorMessage } from "@/lib/error";
import type { InterviewScheduleDetail } from "@/types";

interface InterviewScheduleViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBackdropClick: () => void;
  schedule: InterviewScheduleDetail | null;
  onUpdate?: () => void;
  onInterviewComplete?: () => void;
  isClubLeader?: boolean;
}

export function InterviewScheduleViewModal({
  isOpen,
  onClose,
  onBackdropClick,
  schedule,
  onUpdate,
  onInterviewComplete,
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
  const [period, setPeriod] = useState<"오전" | "오후">("오후");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [place, setPlace] = useState("");

  // schedule이 변경되면 편집 필드 초기화
  useEffect(() => {
    if (!schedule) return;

    const [y, m, d] = schedule.interviewSchedule.split("-");
    setYear(y);
    setMonth(m);
    setDay(d);
    setPlace(schedule.place);

    const [hour24Str, min] = schedule.interviewTime.split(":");
    const hour24 = Number.parseInt(hour24Str, 10);

    let h = hour24;
    let p: "오전" | "오후" = "오후";

    if (hour24 === 0) {
      h = 12;
      p = "오전";
    } else if (hour24 < 12) {
      p = "오전";
    } else if (hour24 === 12) {
      p = "오후";
    } else {
      h = hour24 - 12;
      p = "오후";
    }

    setHour(h.toString());
    setMinute(min);
    setPeriod(p);
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
    const [y, m, d] = schedule.interviewSchedule.split("-");
    return `${y}.${m}.${d}`;
  };

  const getFormattedTime = () => {
    if (!schedule) return "";
    const [hour24Str] = schedule.interviewTime.split(":");
    const hour24 = Number.parseInt(hour24Str, 10);

    let h = hour24;
    let p = "오후";

    if (hour24 === 0) {
      h = 12;
      p = "오전";
    } else if (hour24 < 12) {
      p = "오전";
    } else if (hour24 === 12) {
      p = "오후";
    } else {
      h = hour24 - 12;
      p = "오후";
    }

    return `${p} ${h}시`;
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    if (!schedule) return;

    // 원래 값으로 복원
    const [y, m, d] = schedule.interviewSchedule.split("-");
    setYear(y);
    setMonth(m);
    setDay(d);
    setPlace(schedule.place);

    const [hour24Str, min] = schedule.interviewTime.split(":");
    const hour24 = Number.parseInt(hour24Str, 10);

    let h = hour24;
    let p: "오전" | "오후" = "오후";

    if (hour24 === 0) {
      h = 12;
      p = "오전";
    } else if (hour24 < 12) {
      p = "오전";
    } else if (hour24 === 12) {
      p = "오후";
    } else {
      h = hour24 - 12;
      p = "오후";
    }

    setHour(h.toString());
    setMinute(min);
    setPeriod(p);

    setIsEditMode(false);
  };

  const handleSave = async () => {
    if (!schedule) return;

    if (!place.trim()) {
      toast.error("면접 장소를 입력해주세요.");
      return;
    }

    setIsSaving(true);
    try {
      // 시간을 24시간 형식으로 변환
      let hour24 = Number.parseInt(hour, 10);
      if (period === "오후" && hour24 !== 12) {
        hour24 += 12;
      } else if (period === "오전" && hour24 === 12) {
        hour24 = 0;
      }

      const interviewSchedule = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const interviewTime = `${hour24.toString().padStart(2, "0")}:${minute}`;

      await updateInterviewSchedule(schedule.scheduleId.toString(), {
        interviewSchedule,
        place: place.trim(),
        interviewTime,
      });

      toast.success("면접 일정이 수정되었습니다.");
      setIsEditMode(false);
      onUpdate?.();
    } catch (error) {
      const errorMessage = getErrorMessage(
        error,
        "면접 일정 수정에 실패했습니다.",
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
              <>
                <button
                  type="button"
                  onClick={handleEdit}
                  className="flex-1 rounded-lg border border-primary-500 bg-white py-4 font-semibold text-lg text-primary-500 transition-colors duration-200 hover:bg-primary-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onInterviewComplete?.();
                    onClose();
                  }}
                  className="flex-1 rounded-lg bg-[#FF7575] py-4 font-semibold text-lg text-white transition-colors duration-200 hover:bg-[#FF6464] focus:outline-none focus:ring-2 focus:ring-[#FF7575] focus:ring-offset-2"
                >
                  면접완료
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
