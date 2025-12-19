import Image from "next/image";
import Link from "next/link";
import type { Announcement } from "@/types";

export default function AnnouncementItem({
  announcement_id,
  title,
  tags,
  meetingTime,
  image,
}: Announcement) {
  return (
    <Link href={`/announcements/${announcement_id}`}>
      <article className="group relative h-[310px] w-[280px] cursor-pointer select-none overflow-hidden rounded-3xl">
        {/* 상단 이미지 영역 */}
        <div className="absolute top-0 left-0 h-[268px] w-full bg-[#355849] transition-all duration-300 group-hover:h-[200px]">
          {image && (
            <Image src={image} alt={title} fill className="object-cover" />
          )}
          <button
            className="absolute top-6 right-3 z-10 h-6 w-6"
            aria-label="상세보기"
            type="button"
          >
            <Image
              src="/images/clubs/rightArrow.svg"
              alt="상세보기"
              width={10}
              height={10}
            />
          </button>
        </div>

        {/* 하단 정보 영역 */}
        <section className="absolute bottom-0 left-0 flex w-full flex-col gap-2 rounded-b-3xl bg-gray-50 px-6 py-4 transition-all duration-300 group-hover:py-5">
          <h2 className="line-clamp-1 font-semibold text-gray-900 text-xl group-hover:line-clamp-none">
            {title}
          </h2>

          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full border-[0.1px] border-gray-200 border-solid bg-white px-2.5 py-1 text-gray-500 text-xs"
              >
                # {tag}
              </span>
            ))}
          </div>

          <p className="text-gray-500 text-sm">모집 기한: {meetingTime}</p>
        </section>
      </article>
    </Link>
  );
}
