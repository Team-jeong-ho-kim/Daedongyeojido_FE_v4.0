import Image from "next/image";

interface AnnouncementItemProps {
  announcement_id: number;
  title: string;
  club_name: string;
  deadline: string;
  club_image?: string;
}

const ALLOWED_IMAGE_HOSTS = new Set([
  "dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com",
  "daedong-bucket.s3.ap-northeast-2.amazonaws.com",
]);

const isRenderableImageSrc = (value: string) => {
  if (value.startsWith("/")) {
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

export default function AnnouncementItem({
  announcement_id,
  title,
  club_name,
  deadline,
  club_image,
}: AnnouncementItemProps) {
  const hasRenderableImage =
    typeof club_image === "string" &&
    club_image.trim().length > 0 &&
    isRenderableImageSrc(club_image);

  return (
    <article className="group relative h-[310px] w-[280px] cursor-default select-none overflow-hidden rounded-3xl">
      <div className="absolute top-0 left-0 h-[268px] w-full bg-[#355849] transition-all duration-300 group-hover:h-[200px]">
        {hasRenderableImage ? (
          <Image src={club_image} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl text-white/80">
            {club_name.slice(0, 1)}
          </div>
        )}
      </div>

      <section className="absolute bottom-0 left-0 flex w-full flex-col gap-1 rounded-b-3xl bg-gray-50 px-6 py-4 transition-all duration-300 group-hover:py-5">
        <h2 className="line-clamp-1 font-semibold text-base text-gray-900 group-hover:line-clamp-none">
          {title}
        </h2>
        <p className="text-gray-600 text-sm">{club_name}</p>
        <p className="text-gray-500 text-xs">모집 기한: {deadline}</p>
      </section>
    </article>
  );
}
