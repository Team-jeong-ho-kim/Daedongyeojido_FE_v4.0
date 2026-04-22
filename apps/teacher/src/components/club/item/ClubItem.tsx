import Image from "next/image";
import type { TeacherClubSummary } from "@/types/teacher";

const ALLOWED_IMAGE_HOSTS = new Set([
  "dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com",
  "daedong-bucket.s3.ap-northeast-2.amazonaws.com",
]);

const isAllowedRemoteImage = (value: string) => {
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" && ALLOWED_IMAGE_HOSTS.has(parsed.hostname)
    );
  } catch {
    return false;
  }
};

type TeacherClubItemProps = Pick<
  TeacherClubSummary,
  "clubId" | "clubName" | "clubImage" | "introduction"
>;

export default function ClubItem({
  clubName,
  clubImage,
  introduction,
}: TeacherClubItemProps) {
  const hasImage = clubImage?.trim() && isAllowedRemoteImage(clubImage);

  return (
    <article className="group relative block h-[310px] w-[280px] cursor-default select-none overflow-hidden rounded-3xl text-left">
      <div className="absolute top-0 left-0 h-[268px] w-full bg-[#355849] transition-all duration-[500ms] ease-in-out group-hover:h-[200px]">
        {hasImage ? (
          <Image src={clubImage} alt={clubName} fill className="object-cover" />
        ) : null}
      </div>

      <div className="absolute bottom-0 left-0 flex h-[92px] w-full flex-col gap-2 overflow-hidden rounded-b-3xl bg-gray-50 px-6 py-4 transition-all duration-[500ms] ease-in-out group-hover:h-[140px] group-hover:gap-3 group-hover:py-5">
        <span className="font-semibold text-2xl text-gray-900">{clubName}</span>
        <span className="line-clamp-1 overflow-hidden text-gray-500 text-sm leading-5 opacity-70 transition-opacity delay-150 duration-[500ms] ease-in-out group-hover:line-clamp-4 group-hover:min-h-20 group-hover:opacity-100">
          {introduction}
        </span>
      </div>
    </article>
  );
}
