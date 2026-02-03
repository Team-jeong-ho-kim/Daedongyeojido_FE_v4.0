"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { useGetAllAnnouncementsQuery } from "@/hooks/querys/useAnnouncementQuery";
import AnnouncementItem from "../announcement/item/AnnouncementItem";

export default function AnnouncementSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { data: announcements } = useGetAllAnnouncementsQuery();

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 320; // 카드 너비 + 간격
      const newScrollLeft =
        scrollContainerRef.current.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount);

      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      });
    }
  };

  const daedlineFormat = (deadline: number[] | string) => {
    if (Array.isArray(deadline)) {
      return deadline.map((n) => String(n).padStart(2, "0")).join("-");
    }
    return String(deadline);
  };

  return (
    <section className="w-full bg-white py-16 md:py-24 lg:py-30">
      <div className="mx-auto mb-6 flex max-w-7xl items-center justify-between px-4 md:mb-8 md:px-8">
        <Link
          href={"/announcements"}
          className="flex items-center gap-2 hover:underline hover:underline-offset-6 md:gap-3"
        >
          <h2 className="font-bold text-gray-900 text-lg md:text-xl lg:text-2xl">
            동아리 공고 살펴보기
          </h2>
          <Image
            src="/images/clubs/rightArrow.svg"
            alt="arrow"
            width={12}
            height={20}
          />
        </Link>

        {/* 네비게이션 버튼 */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            type="button"
            onClick={() => scroll("left")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-50 transition-colors hover:bg-gray-200"
            aria-label="이전"
          >
            <Image
              src="/images/clubs/rightArrow.svg"
              alt="이전"
              width={12}
              height={20}
              className="rotate-180"
            />
          </button>
          <button
            type="button"
            onClick={() => scroll("right")}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-gray-50 transition-colors hover:bg-gray-200"
            aria-label="다음"
          >
            <Image
              src="/images/clubs/rightArrow.svg"
              alt="다음"
              width={12}
              height={20}
            />
          </button>
        </div>
      </div>

      {/* 공고 리스트 */}
      <div
        ref={scrollContainerRef}
        className="scrollbar-hide overflow-x-auto"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <div className="flex gap-4 px-4 md:gap-6 md:px-8 lg:pr-8 lg:pl-[calc((100vw-1280px)/2+32px)]">
          {announcements?.map((announcement) => (
            <div key={announcement.announcementId} className="flex-shrink-0">
              <AnnouncementItem
                announcement_id={announcement.announcementId}
                title={announcement.title}
                club_name={announcement.clubName}
                deadline={daedlineFormat(announcement.deadline)}
                club_image={announcement.clubImage}
              />
            </div>
          ))}
          <div className="w-1 flex-shrink-0 pr-4 md:pr-8" />
        </div>
      </div>
    </section>
  );
}
