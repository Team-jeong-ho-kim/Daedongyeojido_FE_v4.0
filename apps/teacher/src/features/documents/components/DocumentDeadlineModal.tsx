"use client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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
  const v = value.replace(/\D/g, "").slice(0, 2);
  const n = Number(v);
  return v === "" ? "" : n > 12 ? "12" : v;
};
const sanitizeDayInput = (value: string) => {
  const v = value.replace(/\D/g, "").slice(0, 2);
  const n = Number(v);
  return v === "" ? "" : n > 31 ? "31" : v;
};
const sanitizeHourInput = (value: string) => {
  const v = value.replace(/\D/g, "").slice(0, 2);
  const n = Number(v);
  return v === "" ? "" : n > 12 ? "12" : v;
};
const sanitizeMinuteInput = (value: string) => {
  const v = value.replace(/\D/g, "").slice(0, 2);
  const n = Number(v);
  return v === "" ? "" : n > 59 ? "59" : v;
};
const to24HourTime = (
  period: "오전" | "오후",
  hour: string,
  minute: string,
) => {
  if (!hour.trim() || !minute.trim()) return "";
  const h = Number(hour);
  const m = Number(minute);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return "";
  if (h < 1 || h > 12 || m < 0 || m > 59) return "";

  const h24 = period === "오후" ? (h === 12 ? 12 : h + 12) : h === 12 ? 0 : h;
  return `${String(h24).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};
const isValidDate = (year: string, month: string, day: string) => {
  const y = Number(year),
    m = Number(month),
    d = Number(day);
  if (year.length !== 4 || !m || !d) return false;
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
  useEffect(() => {
    if (!isOpen) return;
    setIsNoDeadline(initialValue.isNoDeadline);
    if (initialValue.deadlineDate) {
      const [y, m, d] = initialValue.deadlineDate.split("-");
      setYear(y);
      setMonth(String(Number(m)));
      setDay(String(Number(d)));
    } else {
      setYear(new Date().getFullYear().toString());
      setMonth("1");
      setDay("1");
    }
    if (initialValue.deadlineTime) {
      const [h, m] = initialValue.deadlineTime.split(":");
      const h24 = Number(h);
      setPeriod(h24 >= 12 ? "오후" : "오전");
      setHour(String(h24 % 12 === 0 ? 12 : h24 % 12));
      setMinute(m);
    }
  }, [isOpen]);
  const handleConfirm = () => {
    if (isNoDeadline) {
      onSave({ deadlineDate: "", deadlineTime: "", isNoDeadline: true });
      onClose();
      return;
    }
    if (!isValidDate(year, month, day)) {
      toast.error("올바른 날짜를 입력해주세요.");
      return;
    }
    const deadlineTime = to24HourTime(period, hour, minute);
    if (!deadlineTime) {
      toast.error("올바른 시간을 입력해주세요.");
      return;
    }
    onSave({
      deadlineDate: `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`,
      deadlineTime,
      isNoDeadline: false,
    });
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-[650px] rounded-3xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-gray-700 text-xl">마감 기한 지정</h2>
        <p className="mb-2 block text-gray-700 text-sm">마감 일자</p>
        <div className="mb-6 flex items-center gap-5">
          <input
            type="text"
            inputMode="numeric"
            placeholder="년도"
            value={year}
            onChange={(e) => setYear(sanitizeYearInput(e.target.value))}
            maxLength={4}
            disabled={isNoDeadline}
            className={`w-full rounded-xl px-4 py-3 transition-all ${isNoDeadline ? "border border-[#E9E9E9] bg-[#E9E9E9] text-gray-400 placeholder:text-gray-400" : "border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"}`}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="월"
            value={month}
            onChange={(e) => setMonth(sanitizeMonthInput(e.target.value))}
            maxLength={2}
            disabled={isNoDeadline}
            className={`w-full rounded-xl px-4 py-3 transition-all ${isNoDeadline ? "border border-[#E9E9E9] bg-[#E9E9E9] text-gray-400 placeholder:text-gray-400" : "border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"}`}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="일"
            value={day}
            onChange={(e) => setDay(sanitizeDayInput(e.target.value))}
            maxLength={2}
            disabled={isNoDeadline}
            className={`w-full rounded-xl px-4 py-3 transition-all ${isNoDeadline ? "border border-[#E9E9E9] bg-[#E9E9E9] text-gray-400 placeholder:text-gray-400" : "border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"}`}
          />
        </div>
        <p className="mb-2 block text-gray-700 text-sm">마감 시간</p>
        <div className="mb-6 grid grid-cols-3 gap-4">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value as "오전" | "오후")}
            disabled={isNoDeadline}
            className={`rounded-xl px-4 py-3 text-center transition-all ${isNoDeadline ? "border border-[#E9E9E9] bg-[#E9E9E9] text-gray-400 placeholder:text-gray-400" : "border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"}`}
          >
            <option value="오전">오전</option>
            <option value="오후">오후</option>
          </select>
          <input
            type="text"
            inputMode="numeric"
            value={hour}
            onChange={(e) => setHour(sanitizeHourInput(e.target.value))}
            placeholder="시"
            maxLength={2}
            disabled={isNoDeadline}
            className={`rounded-xl px-4 py-3 text-center transition-all ${isNoDeadline ? "border border-[#E9E9E9] bg-[#E9E9E9] text-gray-400 placeholder:text-gray-400" : "border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"}`}
          />
          <input
            type="text"
            inputMode="numeric"
            value={minute}
            onChange={(e) => setMinute(sanitizeMinuteInput(e.target.value))}
            placeholder="분"
            maxLength={2}
            disabled={isNoDeadline}
            className={`rounded-xl px-4 py-3 text-center transition-all ${isNoDeadline ? "border border-[#E9E9E9] bg-[#E9E9E9] text-gray-400 placeholder:text-gray-400" : "border border-gray-200 bg-gray-50 text-gray-700 placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"}`}
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
            onClick={handleConfirm}
            className="flex-1 rounded-xl bg-primary-500 px-6 py-3 font-medium text-white transition-colors hover:bg-primary-600"
          >
            지정
          </button>
        </div>
      </div>
    </div>
  );
}
