import { type ChangeEvent, useState } from "react";
import { toast } from "sonner";
import {
  useDeleteResultDurationMutation,
  useSetResultDurationMutation,
} from "@/hooks/mutations";
import type { ResultDurationResponse } from "@/types/admin";
import { toResultDurationDateTime } from "../_lib";
import { PanelCard } from "./PanelCard";

const CURRENT_YEAR = new Date().getFullYear();
const BASE_YEAR_OPTIONS = Array.from(
  { length: 11 },
  (_, index) => CURRENT_YEAR - 2 + index,
);
const MONTH_OPTIONS = Array.from({ length: 12 }, (_, index) => index + 1);

type ResultDurationTabProps = {
  resultDurationInfo: ResultDurationResponse | null;
};

type KoreanDateFieldProps = {
  value: string;
  onChange: (value: string) => void;
};

const getDaysInMonth = (year: string, month: string) => {
  const parsedYear = Number.parseInt(year, 10);
  const parsedMonth = Number.parseInt(month, 10);

  if (Number.isNaN(parsedYear) || Number.isNaN(parsedMonth)) {
    return 31;
  }

  return new Date(parsedYear, parsedMonth, 0).getDate();
};

const buildDateValue = (year: string, month: string, day: string) => {
  if (!year && !month && !day) {
    return "";
  }

  if (!year || !month || !day) {
    return [year, month, day]
      .map((field, index) =>
        field ? (index === 0 ? field : field.padStart(2, "0")) : "",
      )
      .join("-");
  }

  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
};

const isValidDateValue = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

const isPastDateTime = (date: string, time: string) => {
  if (!isValidDateValue(date) || !time) {
    return false;
  }

  const selectedDateTime = new Date(`${date}T${time}:00`);
  const currentDateTime = new Date();
  currentDateTime.setSeconds(0, 0);

  return selectedDateTime < currentDateTime;
};

function KoreanDateField(props: KoreanDateFieldProps) {
  const { value, onChange } = props;
  const [year = "", month = "", day = ""] = value.split("-");
  const selectedYear = Number.parseInt(year, 10);
  const yearOptions = Number.isNaN(selectedYear)
    ? BASE_YEAR_OPTIONS
    : Array.from(
        new Set(
          [...BASE_YEAR_OPTIONS, selectedYear].sort(
            (left, right) => left - right,
          ),
        ),
      );
  const maxDay = getDaysInMonth(year, month);
  const dayOptions = Array.from({ length: maxDay }, (_, index) => index + 1);

  const handlePartChange =
    (part: "year" | "month" | "day") =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      const nextYear = part === "year" ? event.target.value : year;
      const nextMonth = part === "month" ? event.target.value : month;
      const rawNextDay = part === "day" ? event.target.value : day;
      const nextMaxDay = getDaysInMonth(nextYear, nextMonth);
      const nextDay =
        rawNextDay && Number.parseInt(rawNextDay, 10) > nextMaxDay
          ? ""
          : rawNextDay;

      onChange(buildDateValue(nextYear, nextMonth, nextDay));
    };

  return (
    <div className="grid grid-cols-3 gap-2 rounded-lg border border-gray-200 px-3 py-2">
      <label className="flex items-center gap-2 text-sm">
        <select
          value={year}
          onChange={handlePartChange("year")}
          className="min-w-0 flex-1 bg-transparent outline-none"
        >
          <option value="">연도</option>
          {yearOptions.map((option) => (
            <option key={option} value={String(option)}>
              {option}
            </option>
          ))}
        </select>
        <span className="shrink-0 text-gray-500">년</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <select
          value={month ? String(Number(month)) : ""}
          onChange={handlePartChange("month")}
          className="min-w-0 flex-1 bg-transparent outline-none"
        >
          <option value="">월</option>
          {MONTH_OPTIONS.map((option) => (
            <option key={option} value={String(option)}>
              {option}
            </option>
          ))}
        </select>
        <span className="shrink-0 text-gray-500">월</span>
      </label>
      <label className="flex items-center gap-2 text-sm">
        <select
          value={day ? String(Number(day)) : ""}
          onChange={handlePartChange("day")}
          className="min-w-0 flex-1 bg-transparent outline-none"
        >
          <option value="">일</option>
          {dayOptions.map((option) => (
            <option key={option} value={String(option)}>
              {option}
            </option>
          ))}
        </select>
        <span className="shrink-0 text-gray-500">일</span>
      </label>
    </div>
  );
}

export function ResultDurationTab(props: ResultDurationTabProps) {
  const { resultDurationInfo } = props;
  const [resultDate, setResultDate] = useState("");
  const [resultTime, setResultTime] = useState("");
  const deleteResultDurationMutation = useDeleteResultDurationMutation();
  const setResultDurationMutation = useSetResultDurationMutation();

  const hasExistingResultDuration = Boolean(resultDurationInfo?.resultDuration);
  const resultDurationId = resultDurationInfo?.resultDurationId ?? null;

  const handleSetResultDuration = async () => {
    if (hasExistingResultDuration) {
      toast.error("이미 발표 기간이 존재합니다.");
      return;
    }

    if (!isValidDateValue(resultDate) || !resultTime) {
      toast.error("설정할 발표 날짜와 시간을 입력해 주세요.");
      return;
    }

    if (isPastDateTime(resultDate, resultTime)) {
      toast.error("발표 기간은 현재보다 이전 시점으로 설정할 수 없습니다.");
      return;
    }

    try {
      await setResultDurationMutation.mutateAsync(
        toResultDurationDateTime(`${resultDate}T${resultTime}`),
      );
      setResultDate("");
      setResultTime("");
    } catch {}
  };

  const handleDeleteResultDuration = async () => {
    if (!resultDurationId) {
      toast.error("삭제할 발표 기간 ID가 없습니다.");
      return;
    }

    try {
      await deleteResultDurationMutation.mutateAsync(resultDurationId);
    } catch {}
  };

  return (
    <>
      <PanelCard
        title="발표 기간 조회"
        description="현재 결과 발표 기간입니다."
      >
        <p className="rounded-xl bg-gray-50 px-4 py-3 text-sm">
          {resultDurationInfo?.resultDuration || "설정된 발표 기간이 없습니다."}
        </p>
      </PanelCard>

      <PanelCard
        title="결과 발표 기간 설정"
        description="발표 날짜와 시간을 입력해 새 기간을 생성합니다."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <KoreanDateField value={resultDate} onChange={setResultDate} />
          <input
            type="time"
            value={resultTime}
            onChange={(event) => setResultTime(event.target.value)}
            placeholder="발표 시간"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
        <button
          type="button"
          className={`mt-3 rounded-lg px-4 py-2 font-medium text-sm text-white transition ${
            hasExistingResultDuration
              ? "cursor-not-allowed bg-gray-400"
              : "bg-gray-900 hover:bg-black"
          } disabled:cursor-not-allowed disabled:opacity-60`}
          onClick={handleSetResultDuration}
          disabled={setResultDurationMutation.isPending}
          aria-disabled={hasExistingResultDuration}
        >
          {setResultDurationMutation.isPending ? "설정 중..." : "설정"}
        </button>
      </PanelCard>

      <PanelCard
        title="결과 발표 기간 삭제"
        description="현재 조회된 발표 기간을 삭제합니다."
      >
        <button
          type="button"
          className="rounded-lg bg-[#DC2626] px-4 py-2 font-medium text-sm text-white transition hover:bg-[#B91C1C] disabled:cursor-not-allowed disabled:opacity-60"
          onClick={handleDeleteResultDuration}
          disabled={
            deleteResultDurationMutation.isPending ||
            !hasExistingResultDuration ||
            !resultDurationId
          }
        >
          {deleteResultDurationMutation.isPending ? "삭제 중..." : "삭제"}
        </button>
      </PanelCard>
    </>
  );
}
