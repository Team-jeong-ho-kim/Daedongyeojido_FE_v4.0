"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

export interface AnnouncementClubFilterOption {
  imageUrl: string | null;
  name: string;
}

interface AnnouncementClubFilterProps {
  clubOptions: AnnouncementClubFilterOption[];
  selectedClub: string;
  onSelectClub: (clubName: string) => void;
}

const ALLOWED_IMAGE_HOSTS = new Set([
  "dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com",
  "daedong-bucket.s3.ap-northeast-2.amazonaws.com",
]);

const isRenderableImageSrc = (value: string) => {
  if (value.startsWith("/") && !value.startsWith("//")) {
    return true;
  }

  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(parsed.hostname)
    );
  } catch {
    return false;
  }
};

export function AnnouncementClubFilter({
  clubOptions,
  selectedClub,
  onSelectClub,
}: AnnouncementClubFilterProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const scrollNode = scrollContainerRef.current;

    if (!scrollNode) {
      return;
    }

    const updateScrollState = () => {
      const { clientWidth, scrollLeft, scrollWidth } = scrollNode;
      const hasOverflow = scrollWidth - clientWidth > 4;

      if (!hasOverflow) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }

      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollWidth - clientWidth - scrollLeft > 4);
    };

    updateScrollState();

    scrollNode.addEventListener("scroll", updateScrollState, { passive: true });

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScrollState)
        : null;

    resizeObserver?.observe(scrollNode);
    window.addEventListener("resize", updateScrollState);

    return () => {
      scrollNode.removeEventListener("scroll", updateScrollState);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateScrollState);
    };
  }, [clubOptions]);

  const scrollFilter = (direction: "left" | "right") => {
    const scrollNode = scrollContainerRef.current;

    if (!scrollNode) {
      return;
    }

    const visibleWidth = scrollNode.clientWidth;
    const scrollAmount = Math.min(320, Math.max(160, visibleWidth * 0.7));

    scrollNode.scrollTo({
      left:
        scrollNode.scrollLeft +
        (direction === "left" ? -scrollAmount : scrollAmount),
      behavior: "smooth",
    });
  };

  return (
    <section className="relative mb-6 border-gray-200 border-b pb-1 sm:mb-8">
      {canScrollLeft && (
        <button
          type="button"
          aria-label="이전 동아리 필터 보기"
          onClick={() => scrollFilter("left")}
          className="-translate-y-1/2 absolute top-1/2 left-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
        >
          <Image
            src="/images/clubs/rightArrow.svg"
            alt=""
            aria-hidden
            width={10}
            height={16}
            className="h-4 w-2.5 rotate-180"
          />
        </button>
      )}

      {canScrollRight && (
        <>
          <div
            aria-hidden
            className="pointer-events-none absolute top-0 right-0 bottom-2 w-14 bg-gradient-to-l from-white via-white/85 to-transparent"
          />
          <button
            type="button"
            aria-label="다음 동아리 필터 보기"
            onClick={() => scrollFilter("right")}
            className="-translate-y-1/2 absolute top-1/2 right-2 z-10 flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            <Image
              src="/images/clubs/rightArrow.svg"
              alt=""
              aria-hidden
              width={10}
              height={16}
              className="h-4 w-2.5"
            />
          </button>
        </>
      )}

      <div
        ref={scrollContainerRef}
        className="overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <div className="flex min-w-max items-stretch gap-2.5 px-1 sm:gap-3">
          {clubOptions.map((clubOption) => {
            const isActive = selectedClub === clubOption.name;

            return (
              <button
                key={clubOption.name}
                type="button"
                aria-pressed={isActive}
                onClick={() => onSelectClub(clubOption.name)}
                className={`group relative flex min-w-[68px] flex-col items-center gap-2 px-1.5 pt-1 pb-3 text-center transition-colors sm:min-w-[80px] sm:px-2 md:min-w-[92px] md:gap-2.5 ${
                  isActive
                    ? "text-primary-500"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <span
                  className={`relative flex size-8 items-center justify-center overflow-hidden rounded-full border transition-colors sm:size-9 md:size-10 ${
                    isActive
                      ? "border-primary-200 bg-primary-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  {clubOption.name === "전체" ? (
                    <Image
                      src="/images/clubs/all.svg"
                      alt=""
                      aria-hidden
                      width={18}
                      height={18}
                      className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]"
                    />
                  ) : clubOption.imageUrl &&
                    isRenderableImageSrc(clubOption.imageUrl) ? (
                    <Image
                      src={clubOption.imageUrl}
                      alt=""
                      aria-hidden
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <span
                      aria-hidden
                      className={`font-semibold text-[11px] sm:text-xs md:text-sm ${
                        isActive ? "text-primary-500" : "text-gray-600"
                      }`}
                    >
                      {clubOption.name[0]}
                    </span>
                  )}
                </span>
                <span className="whitespace-nowrap font-medium text-[11px] leading-4 sm:text-xs md:text-sm">
                  {clubOption.name}
                </span>
                <span
                  aria-hidden
                  className={`absolute inset-x-2 bottom-0 h-0.5 rounded-full transition-colors sm:inset-x-3 ${
                    isActive ? "bg-primary-500" : "bg-transparent"
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
