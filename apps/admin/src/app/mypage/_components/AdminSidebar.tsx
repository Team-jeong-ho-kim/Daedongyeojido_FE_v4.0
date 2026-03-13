export type AdminTab =
  | "overview"
  | "resultDuration"
  | "clubCreation"
  | "dissolution"
  | "teacher";

type AdminSidebarProps = {
  activeTab: AdminTab;
  loadingLogout: boolean;
  onTabChange: (tab: AdminTab) => void;
  onLogout: () => void;
};

const tabLabels: Array<{ tab: AdminTab; label: string }> = [
  { tab: "overview", label: "조회" },
  { tab: "resultDuration", label: "결과 발표 기간" },
  { tab: "clubCreation", label: "동아리 개설" },
  { tab: "dissolution", label: "동아리 해체" },
  { tab: "teacher", label: "지도 교사" },
];

const getTabButtonClass = (activeTab: AdminTab, tab: AdminTab) =>
  `w-full whitespace-nowrap px-0 py-2 text-left text-lg transition ${
    activeTab === tab
      ? "font-semibold text-gray-900"
      : "text-gray-400 hover:text-gray-600"
  }`;

export function AdminSidebar(props: AdminSidebarProps) {
  const { activeTab, loadingLogout, onTabChange, onLogout } = props;

  return (
    <aside className="lg:sticky lg:top-10 lg:self-start">
      <h1 className="mb-10 font-extrabold text-4xl tracking-tight">
        마이페이지
      </h1>

      <div className="space-y-3">
        {tabLabels.map(({ tab, label }) => (
          <button
            key={tab}
            type="button"
            className={getTabButtonClass(activeTab, tab)}
            onClick={() => onTabChange(tab)}
          >
            {label}
          </button>
        ))}

        <button
          type="button"
          className="w-full whitespace-nowrap px-0 py-2 text-left font-medium text-gray-500 text-lg transition hover:text-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          onClick={onLogout}
          disabled={loadingLogout}
        >
          {loadingLogout ? "로그아웃 중..." : "로그아웃"}
        </button>
      </div>
    </aside>
  );
}
