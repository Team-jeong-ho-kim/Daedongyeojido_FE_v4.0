"use client";

import { useEffect, useRef, useState } from "react";

interface DocumentDeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (value: {
    deadlineDate: string;
    deadlineTime: string;
    isNoDeadline: boolean;
  }) => void;
  initialValue: {
    deadlineDate: string;
    deadlineTime: string;
    isNoDeadline: boolean;
  };
}

const sanitizeYearInput = (value: string) =>
  value.replace(/\D/g, "").slice(0, 4);

const sanitizeMonthInput = (value: string) => {
  const numericValue = value.replace(/\D/g, "").slice(0, 2);
  if (!numericValue) return "";
  const month = Number.parseInt(numericValue, 10);
  if (Number.isNaN(month)) return "";
  return String(Math.min(month, 12));
};

const sanitizeDayInput = (value: string) => {
  const numericValue = value.replace(/\D/g, "").slice(0, 2);
  if (!numericValue) return "";
  const day = Number.parseInt(numericValue, 10);
  if (Number.isNaN(day)) return "";
  return String(Math.min(day, 31));
};

const sanitizeHourInput = (value: string) => {
  const numericValue = value.replace(/\D/g, "").slice(0, 2);
  if (!numericValue) return "";
  if (numericValue.length === 1) return numericValue;

  const hour = Number.parseInt(numericValue, 10);
  if (Number.isNaN(hour)) return "";

  if (hour > 12) return "12";
  return numericValue;
};

const sanitizeMinuteInput = (value: string) => {
  const numericValue = value.replace(/\D/g, "").slice(0, 2);
  if (!numericValue) return "";
  if (numericValue.length === 1) return numericValue;

  const minute = Number.parseInt(numericValue, 10);
  if (Number.isNaN(minute)) return "";
  if (minute > 59) return "59";
  return numericValue;
};

const parseTime = (value: string) => {
  if (!value) {
    return { period: "오전" as const, hour: "12", minute: "00" };
  }

  const [hourText, minuteText = "00"] = value.split(":");
  const hour24 = Number.parseInt(hourText, 10);

  if (Number.isNaN(hour24)) {
    return { period: "오전" as const, hour: "12", minute: "00" };
  }

  const period = hour24 >= 12 ? "오후" : "오전";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;

  return {
    period,
    hour: String(hour12),
    minute: minuteText,
  };
};

const to24HourTime = ({
  period,
  hour,
  minute,
}: {
  period: "오전" | "오후";
  hour: string;
  minute: string;
}) => {
  const parsedHour = Number.parseInt(hour, 10);
  const parsedMinute = Number.parseInt(minute, 10);

  if (
    Number.isNaN(parsedHour) ||
    Number.isNaN(parsedMinute) ||
    parsedHour < 1 ||
    parsedHour > 12 ||
    parsedMinute < 0 ||
    parsedMinute > 59
  ) {
    return "";
  }

  const hour24 =
    period === "오후"
      ? parsedHour === 12
        ? 12
        : parsedHour + 12
      : parsedHour === 12
        ? 0
        : parsedHour;

  return `${String(hour24).padStart(2, "0")}:${String(parsedMinute).padStart(2, "0")}`;
};

const isValidDate = (year: string, month: string, day: string) => {
  if (year.length !== 4 || !month || !day) return false;

  const y = Number.parseInt(year, 10);
  const m = Number.parseInt(month, 10);
  const d = Number.parseInt(day, 10);

  if (Number.isNaN(y) || Number.isNaN(m) || Number.isNaN(d)) return false;

  const date = new Date(y, m - 1, d);
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  );
};

export function DocumentDeadlineModal({
  isOpen,
  onClose,
  onSave,
  initialValue,
}: DocumentDeadlineModalProps) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [period, setPeriod] = useState<"오전" | "오후">("오전");
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [isNoDeadline, setIsNoDeadline] = useState(false);

  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    setIsNoDeadline(initialValue.isNoDeadline);

    if (initialValue.deadlineDate) {
      const [initialYear, initialMonth, initialDay] =
        initialValue.deadlineDate.split("-");
      setYear(initialYear ?? "");
      setMonth(String(Number.parseInt(initialMonth ?? "", 10) || ""));
      setDay(String(Number.parseInt(initialDay ?? "", 10) || ""));
    } else {
      setYear("");
      setMonth("");
      setDay("");
    }

    const time = parseTime(initialValue.deadlineTime);
    setPeriod(time.period);
    setHour(time.hour);
    setMinute(time.minute);
  }, [isOpen, initialValue]);

  if (!isOpen) return null;

  const disabledClassName =
    "border border-[#E9E9E9] bg-[#E9E9E9] text-gray-400 placeholder:text-gray-400";

  const enabledClassName =
    "border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400";

  const handleSave = () => {
    if (isNoDeadline) {
      onSave({
        deadlineDate: "",
        deadlineTime: "",
        isNoDeadline: true,
      });
      onClose();
      return;
    }

    if (!isValidDate(year, month, day)) {
      return;
    }

    const deadlineDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    const deadlineTime = to24HourTime({ period, hour, minute });

    if (!deadlineTime) {
      return;
    }

    onSave({
      deadlineDate,
      deadlineTime,
      isNoDeadline: false,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-[650px] rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-gray-700 text-xl">일정 지정</h2>

        <p className="mb-2 block text-gray-700 text-sm">마감 일자</p>
        <div className="mb-6 flex items-center gap-5">
          <div className="flex-1">
            <input
              type="text"
              inputMode="numeric"
              placeholder="년도"
              value={year}
              onChange={(e) => {
                const nextValue = sanitizeYearInput(e.target.value);
                setYear(nextValue);
                if (nextValue.length === 4) {
                  monthRef.current?.focus();
                }
              }}
              maxLength={4}
              disabled={isNoDeadline}
              className={`w-full rounded-xl px-4 py-3 transition-all ${isNoDeadline ? disabledClassName : enabledClassName}`}
            />
          </div>
          <div className="flex-1">
            <input
              ref={monthRef}
              type="text"
              inputMode="numeric"
              placeholder="월"
              value={month}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, "").slice(0, 2);
                const nextValue = sanitizeMonthInput(e.target.value);
                setMonth(nextValue);
                if (rawValue.length === 2) {
                  dayRef.current?.focus();
                }
              }}
              maxLength={2}
              disabled={isNoDeadline}
              className={`w-full rounded-xl px-4 py-3 transition-all ${isNoDeadline ? disabledClassName : enabledClassName}`}
            />
          </div>
          <div className="flex-1">
            <input
              ref={dayRef}
              type="text"
              inputMode="numeric"
              placeholder="일"
              value={day}
              onChange={(e) => setDay(sanitizeDayInput(e.target.value))}
              maxLength={2}
              disabled={isNoDeadline}
              className={`w-full rounded-xl px-4 py-3 transition-all ${isNoDeadline ? disabledClassName : enabledClassName}`}
            />
          </div>
        </div>

        <p className="mb-2 block text-gray-700 text-sm">마감 시간</p>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "오전" | "오후")}
            disabled={isNoDeadline}
            className={`rounded-xl px-4 py-3 text-center transition-all ${isNoDeadline ? disabledClassName : enabledClassName}`}
          >
            <option value="오전">오전</option>
            <option value="오후">오후</option>
          </select>
          <input
            ref={hourRef}
            type="text"
            inputMode="numeric"
            value={hour}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, "").slice(0, 2);
              const nextValue = sanitizeHourInput(e.target.value);
              setHour(nextValue);
              if (rawValue.length === 2) {
                minuteRef.current?.focus();
              }
            }}
            placeholder="시"
            maxLength={2}
            disabled={isNoDeadline}
            className={`rounded-xl px-4 py-3 text-center transition-all ${isNoDeadline ? disabledClassName : enabledClassName}`}
          />
          <input
            ref={minuteRef}
            type="text"
            inputMode="numeric"
            value={minute}
            onChange={(e) => setMinute(sanitizeMinuteInput(e.target.value))}
            placeholder="분"
            maxLength={2}
            disabled={isNoDeadline}
            className={`rounded-xl px-4 py-3 text-center transition-all ${isNoDeadline ? disabledClassName : enabledClassName}`}
          />
        </div>

        <label className="mb-8 flex cursor-pointer items-center gap-2 text-gray-700 text-sm">
          <input
            type="checkbox"
            checked={isNoDeadline}
            onChange={(e) => setIsNoDeadline(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 accent-primary-500"
          />
          마감일 없음
        </label>

        <div className="flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl bg-gray-400 px-6 py-3 font-medium text-white transition-colors hover:bg-gray-500"
          >
            닫기
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 rounded-xl bg-primary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-600"
          >
            지정
          </button>
        </div>
      </div>
    </div>
  );
}
