"use client";

import Image from "next/image";
import { useState } from "react";

interface NoticeCardProps {
  title: string;
  date: string;
  content: string;
}

export default function NoticeCard({ title, date, content }: NoticeCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

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
