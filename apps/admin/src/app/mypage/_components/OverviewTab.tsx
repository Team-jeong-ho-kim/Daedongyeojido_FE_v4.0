import type {
  ApplicationFormListItem,
  ResultDurationResponse,
} from "@/types/admin";
import { toDateText } from "../_lib";
import { PanelCard } from "./PanelCard";

type OverviewTabProps = {
  applicationForms: ApplicationFormListItem[];
  isRefreshingOverview: boolean;
  onRefresh: () => void;
  resultDurationInfo: ResultDurationResponse | null;
};

export function OverviewTab(props: OverviewTabProps) {
  const {
    applicationForms,
    isRefreshingOverview,
    onRefresh,
    resultDurationInfo,
  } = props;

  return (
    <>
      <PanelCard
        title="조회 통합"
        description="발표 기간과 지원서 폼을 한 번에 확인합니다."
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

      <PanelCard
        title="지원서 폼 전체 조회"
        description={`전체 ${applicationForms.length}개 지원서 폼`}
      >
        <div className="max-h-[320px] space-y-2 overflow-y-auto pr-1">
          {applicationForms.length === 0 ? (
            <p className="text-gray-500 text-sm">지원서 폼이 없습니다.</p>
          ) : (
            applicationForms.map((form) => (
              <div
                key={form.applicationFormId}
                className="rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <p className="font-medium">{form.applicationFormTitle}</p>
                <p className="mt-1 text-gray-500 text-xs">
                  폼 ID #{form.applicationFormId} · {form.clubName}
                </p>
                <p className="text-gray-500 text-xs">
                  마감: {toDateText(form.submissionDuration)}
                </p>
              </div>
            ))
          )}
        </div>
      </PanelCard>
    </>
  );
}
