import Image from "next/image";
import type { Club } from "@/types";

export default function ClubItem(clubProps: Omit<Club, "majors">) {
  return (
    <article
      id={`club-${clubProps.clubId}`}
      className="group relative h-[310px] w-[280px] cursor-pointer select-none overflow-hidden rounded-3xl"
    >
      {/* 상단 이미지 영역 */}
      <div className="absolute top-0 left-0 h-[268px] w-full bg-[#355849] transition-all duration-300 ease-out group-hover:h-[200px]">
        {clubProps.clubImage && (
          <Image
            src={clubProps.clubImage}
            alt={clubProps.clubName}
            fill
            className="object-cover"
          />
        )}
        <button
          className="absolute top-6 right-3 z-10 h-6 w-6"
          aria-label="다음으로 이동"
          type="button"
        >
          <Image
            src="/images/clubs/rightArrow.svg"
            alt="다음"
            width={10}
            height={10}
          />
        </button>
      </div>

      {/* 하단 정보 영역 */}
      <section className="absolute bottom-0 left-0 flex w-full flex-col gap-2 rounded-b-3xl bg-gray-50 px-6 py-4 transition-all duration-300 ease-out group-hover:py-5">
        <h2 className="font-semibold text-2xl text-gray-900">
          {clubProps.clubName}
        </h2>

        <p className="line-clamp-1 text-gray-500 text-sm opacity-70 transition-opacity delay-150 duration-300 ease-out group-hover:line-clamp-none group-hover:opacity-100">
          {clubProps.introduction}
        </p>
      </section>
    </article>
  );
}
