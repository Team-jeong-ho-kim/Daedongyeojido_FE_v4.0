import { useState } from "react";
import { toast } from "sonner";
import { useSetResultDurationMutation } from "@/hooks/mutations";
import type { ResultDurationResponse } from "@/types/admin";
import { toResultDurationDateTime } from "../_lib";
import { PanelCard } from "./PanelCard";

type ResultDurationTabProps = {
  resultDurationInfo: ResultDurationResponse | null;
};

export function ResultDurationTab(props: ResultDurationTabProps) {
  const { resultDurationInfo } = props;
  const [resultDate, setResultDate] = useState("");
  const [resultTime, setResultTime] = useState("");
  const setResultDurationMutation = useSetResultDurationMutation();

  const hasExistingResultDuration = Boolean(resultDurationInfo?.resultDuration);

  const handleSetResultDuration = async () => {
    if (hasExistingResultDuration) {
      toast.error("이미 발표 기간이 존재합니다.");
      return;
    }

    if (!resultDate || !resultTime) {
      toast.error("설정할 발표 날짜와 시간을 입력해 주세요.");
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
          <input
            type="date"
            value={resultDate}
            onChange={(event) => setResultDate(event.target.value)}
            placeholder="발표일"
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
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
    </>
  );
}
