"use client";

interface JobPostingItemProps {
  status: "종료됨" | "진행중" | "준비중";
  title: string;
  date: string;
  onClick?: () => void;
}

export function JobPostingItem(props: JobPostingItemProps) {
  const { status, title, date, onClick } = props;

  const statusLabel = status === "진행중" ? "OPEN" : "CLOSED";
  const statusClass =
    status === "진행중"
      ? "border-blue-500 bg-blue-50 text-blue-500"
      : "border-red-500 bg-red-50 text-red-500";

  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-5 py-5 text-left transition-all hover:bg-gray-100 md:px-6 md:py-6"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 md:gap-4">
        <span
          className={`rounded-xl border px-2.5 py-1 font-medium text-[12px] md:text-[13px] ${statusClass}`}
        >
          {statusLabel}
        </span>
        <span className="text-[14px] text-gray-900 md:text-[15px]">
          {title}
        </span>
      </div>
      <time className="text-[13px] text-gray-400 md:text-[14px]">{date}</time>
    </button>
  );
}
