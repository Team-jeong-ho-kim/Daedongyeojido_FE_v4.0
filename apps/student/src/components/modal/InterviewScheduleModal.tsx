import Image from "next/image";
import { useRef, useState } from "react";

interface InterviewScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (schedule: { date: string; time: string; location: string }) => void;
}

export default function InterviewScheduleModal({
  isOpen,
  onClose,
  onSave,
}: InterviewScheduleModalProps) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [period, setPeriod] = useState<"오전" | "오후">("오후");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [location, setLocation] = useState("");

  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleYearChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 4);
    setYear(numericValue);
    if (numericValue.length === 4) {
      monthRef.current?.focus();
    }
  };

  const handleMonthChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 2);
    const numValue = Number.parseInt(numericValue, 10);
    if (numericValue && numValue > 12) {
      setMonth("12");
    } else {
      setMonth(numericValue);
    }
    if (numericValue.length === 2) {
      dayRef.current?.focus();
    }
  };

  const handleDayChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 2);
    const numValue = Number.parseInt(numericValue, 10);
    if (numericValue && numValue > 31) {
      setDay("31");
    } else {
      setDay(numericValue);
    }
  };

  const handleHourChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 2);
    const numValue = Number.parseInt(numericValue, 10);
    if (numericValue && numValue > 12) {
      setHour("12");
    } else if (numericValue && numValue < 1) {
      setHour("1");
    } else {
      setHour(numericValue);
    }
    if (numericValue.length === 2) {
      minuteRef.current?.focus();
    }
  };

  const handleMinuteChange = (value: string) => {
    const numericValue = value.replace(/\D/g, "").slice(0, 2);
    const numValue = Number.parseInt(numericValue, 10);
    if (numericValue && numValue > 59) {
      setMinute("59");
    } else {
      setMinute(numericValue);
    }
  };

  const handleSave = () => {
    if (year && month && day && hour && minute && location) {
      const date = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
      const time = `${period} ${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`;

      onSave({ date, time, location });
      handleReset();
      onClose();
    }
  };

  const handleReset = () => {
    setYear("");
    setMonth("");
    setDay("");
    setPeriod("오후");
    setHour("");
    setMinute("");
    setLocation("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-[650px] rounded-3xl bg-white p-8 shadow-2xl">
        {/* 제목 */}
        <h2 className="mb-6 text-gray-700 text-xl">면접 일정 지정</h2>

        {/* 면접 일자 */}
        <p className="mb-2 block text-gray-700 text-sm">면접 일자</p>
        <div className="mb-8 flex items-center gap-5">
          <Image
            src="/images/icons/calendar.svg"
            alt="캘린더"
            width={15}
            height={15}
          />
          <div className="flex-1">
            <input
              type="text"
              inputMode="numeric"
              placeholder="년도"
              value={year}
              onChange={(e) => handleYearChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
              maxLength={4}
            />
          </div>
          <div className="flex-1">
            <input
              ref={monthRef}
              type="text"
              inputMode="numeric"
              placeholder="월"
              value={month}
              onChange={(e) => handleMonthChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
              maxLength={2}
            />
          </div>
          <div className="flex-1">
            <input
              ref={dayRef}
              type="text"
              inputMode="numeric"
              placeholder="날짜"
              value={day}
              onChange={(e) => handleDayChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
              maxLength={2}
            />
          </div>
        </div>

        {/* 면접 시간 */}
        <p className="mb-2 block text-gray-700 text-sm">면접 시간</p>
        <div className="mb-8 flex items-center gap-5">
          <Image
            src="/images/icons/clock.svg"
            alt="시계"
            width={15}
            height={15}
          />
          <div className="flex-1">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as "오전" | "오후")}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <option value="오전">오전</option>
              <option value="오후">오후</option>
            </select>
          </div>
          <div className="flex-1">
            <input
              ref={hourRef}
              type="text"
              inputMode="numeric"
              placeholder="12"
              value={hour}
              onChange={(e) => handleHourChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
              maxLength={2}
            />
          </div>
          <div className="flex-1">
            <input
              ref={minuteRef}
              type="text"
              inputMode="numeric"
              placeholder="30"
              value={minute}
              onChange={(e) => handleMinuteChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
              maxLength={2}
            />
          </div>
        </div>

        {/* 면접 장소 */}
        <p className="mb-2 block text-gray-700 text-sm">면접 장소</p>
        <div className="mb-8">
          <input
            type="text"
            placeholder="면접 장소를 지정해주세요."
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>

        {/* 버튼들 */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={handleClose}
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
