"use client";

import Image from "next/image";
import { useState } from "react";

interface JobPostingItemProps {
  status: "종료됨" | "진행중";
  title: string;
  date: string;
  content?: string;
  isMember?: boolean;
  onClick?: () => void;
}

export default function JobPostingItem({
  status,
  title,
  date,
  content,
  isMember = false,
  onClick,
}: JobPostingItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isMember) {
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

  return (
    <section className="w-full rounded-lg bg-white">
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
