import type { ResultDurationResponse } from "@/types/admin";
import { ClubCreationDownloadCard } from "./ClubCreationDownloadCard";
import { PanelCard } from "./PanelCard";

type OverviewTabProps = {
  isRefreshingOverview: boolean;
  onRefresh: () => void;
  resultDurationInfo: ResultDurationResponse | null;
};

export function OverviewTab(props: OverviewTabProps) {
  const { isRefreshingOverview, onRefresh, resultDurationInfo } = props;

  return (
    <>
      <PanelCard
        title="조회 통합"
        description="발표 기간과 동아리 개설 신청 양식을 한 번에 확인합니다."
        right={
          <button
            type="button"
            className="rounded-lg border border-gray-200 px-3 py-1.5 text-xs transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onRefresh}
            disabled={isRefreshingOverview}
          >
            {isRefreshingOverview ? "새로고침 중..." : "새로고침"}
          </button>
        }
      >
        <div className="rounded-xl bg-gray-50 p-4 text-sm">
          <p className="font-medium text-gray-700">발표 기간 조회</p>
          <p className="mt-1 text-gray-900">
            {resultDurationInfo?.resultDuration ||
              "설정된 발표 기간이 없습니다."}
          </p>
        </div>
      </PanelCard>

      <ClubCreationDownloadCard />
    </>
  );
}
