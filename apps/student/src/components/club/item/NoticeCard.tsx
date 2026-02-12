"use client";

import Image from "next/image";
import { useState } from "react";

interface NoticeCardProps {
  title: string;
  date: string;
  content: string;
  alarmId?: number;
  isClubMember?: boolean;
  onDelete?: (alarmId: number) => void;
}

export default function NoticeCard({
  title,
  date,
  content,
  alarmId,
  isClubMember,
  onDelete,
}: NoticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (alarmId && onDelete) {
      if (window.confirm("이 알림을 삭제하시겠습니까?")) {
        onDelete(alarmId);
      }
    }
  };

  return (
    <section className="relative w-full rounded-lg bg-white">
      {isClubMember && alarmId && onDelete && (
        <button
          type="button"
          onClick={handleDelete}
          className="absolute top-1 right-1 z-10 flex h-5 w-5 items-center justify-center rounded transition-colors hover:bg-red-50"
          aria-label="알림 삭제"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
          >
            <title>알림 삭제</title>
            <path
              d="M9 3L3 9M3 3L9 9"
              stroke="#EF4444"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      )}
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 rounded-lg px-6 py-4"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h2 className="truncate font-medium text-base text-gray-900">
          {title}
        </h2>
        <div className="flex shrink-0 items-center gap-7">
          <span className="whitespace-nowrap text-gray-500 text-sm">
            {date}
          </span>
          <Image
            src="/images/clubs/rightArrow.svg"
            alt="펼치기"
            width={9}
            height={9}
            className={`transition-transform duration-200 ${
              isExpanded ? "rotate-90" : ""
            }`}
          />
        </div>
      </button>

      <div
        className={`grid transition-all duration-300 ease-out ${
          isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pt-2 pb-5">
            <p className="break-words text-gray-600 text-sm leading-relaxed">
              {content}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
