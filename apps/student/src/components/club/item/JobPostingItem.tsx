interface JobPostingItemProps {
  status: "종료됨" | "진행중";
  title: string;
  date: string;
  onClick?: () => void;
}

export default function JobPostingItem({
  status,
  title,
  date,
  onClick,
}: JobPostingItemProps) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer items-center justify-between rounded-xl bg-white px-5 py-5 text-left transition-all hover:bg-gray-100 md:px-6 md:py-6"
      onClick={onClick}
    >
      <div className="flex items-center gap-3 md:gap-4">
        <span
          className={`rounded-md px-2.5 py-1 font-medium text-[12px] md:text-[13px] ${
            status === "종료됨"
              ? "bg-red-50 text-red-500"
              : "bg-blue-50 text-blue-500"
          }`}
        >
          {status}
        </span>
        <span className="text-[14px] text-gray-900 md:text-[15px]">
          {title}
        </span>
      </div>
      <time className="text-[13px] text-gray-400 md:text-[14px]">{date}</time>
    </button>
  );
}
