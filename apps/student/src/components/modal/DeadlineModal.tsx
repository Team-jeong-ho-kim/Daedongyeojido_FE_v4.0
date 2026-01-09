import Image from "next/image";
import { useRef, useState } from "react";

interface DeadlineModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deadline: string) => void;
  title?: string;
}

export default function DeadlineModal({
  isOpen,
  onClose,
  onSave,
  title = "일정 지정",
}: DeadlineModalProps) {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  const monthRef = useRef<HTMLInputElement>(null);
  const dayRef = useRef<HTMLInputElement>(null);

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

  const handleSave = () => {
    if (year && month && day) {
      const deadline = `${year}.${month.padStart(2, "0")}.${day.padStart(2, "0")}`;
      onSave(deadline);
      setYear("");
      setMonth("");
      setDay("");
      onClose();
    }
  };

  const handleClose = () => {
    setYear("");
    setMonth("");
    setDay("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
      <div className="relative w-full max-w-[650px] rounded-3xl bg-white p-8 shadow-2xl">
        {/* 제목 */}
        <h2 className="mb-6 text-gray-700 text-xl">{title}</h2>

        {/* 지원 마감일 레이블 */}
        <p className="mb-2 block text-gray-700 text-sm">지원 마감일</p>

        {/* 날짜 입력 필드들 */}
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
              placeholder="일"
              value={day}
              onChange={(e) => handleDayChange(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 transition-all placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-red-400"
              maxLength={2}
            />
          </div>
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
