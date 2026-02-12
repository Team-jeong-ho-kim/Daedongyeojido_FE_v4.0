import Image from "next/image";
import Link from "next/link";
import type { Club } from "@/types";

export default function ClubItem({
  clubId,
  clubName,
  clubImage,
  introduction,
  onClick,
}: Omit<Club, "majors"> & { onClick?: () => void }) {
  const content = (
    <button
      type="button"
      id={`club-${clubId}`}
      className="group relative h-[310px] w-[280px] cursor-pointer select-none overflow-hidden rounded-3xl text-left"
      onClick={onClick}
    >
      <div className="absolute top-0 left-0 h-[268px] w-full bg-[#355849] transition-all duration-300 ease-out group-hover:h-[200px]">
        {clubImage && (
          <Image src={clubImage} alt={clubName} fill className="object-cover" />
        )}
        <span className="absolute top-6 right-3 z-10 flex h-6 w-6 items-center justify-center">
          <Image
            src="/images/clubs/rightArrow.svg"
            alt=""
            width={10}
            height={10}
            aria-hidden
          />
        </span>
      </div>

      <div className="absolute bottom-0 left-0 flex w-full flex-col gap-2 rounded-b-3xl bg-gray-50 px-6 py-4 transition-all duration-300 ease-out group-hover:py-5">
        <span className="font-semibold text-2xl text-gray-900">{clubName}</span>
        <span className="line-clamp-1 text-gray-500 text-sm opacity-70 transition-opacity delay-150 duration-300 ease-out group-hover:line-clamp-none group-hover:opacity-100">
          {introduction}
        </span>
      </div>
    </button>
  );

  return clubId ? <Link href={`/clubs/${clubId}`}>{content}</Link> : content;
}
