import Image from "next/image";

export interface AnnouncementClubFilterOption {
  imageUrl: string | null;
  name: string;
}

interface AnnouncementClubFilterProps {
  clubOptions: AnnouncementClubFilterOption[];
  selectedClub: string;
  onSelectClub: (clubName: string) => void;
}

export function AnnouncementClubFilter({
  clubOptions,
  selectedClub,
  onSelectClub,
}: AnnouncementClubFilterProps) {
  return (
    <section className="mb-6 border-gray-200 border-b pb-1 sm:mb-8">
      <div
        data-testid="announcement-club-filter-scroll"
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
                      data-testid="club-filter-all-icon"
                      className="h-3.5 w-3.5 object-contain sm:h-4 sm:w-4 md:h-[18px] md:w-[18px]"
                    />
                  ) : clubOption.imageUrl ? (
                    <Image
                      src={clubOption.imageUrl}
                      alt=""
                      aria-hidden
                      fill
                      data-testid={`club-filter-logo-${clubOption.name}`}
                      className="object-cover"
                    />
                  ) : (
                    <span
                      data-testid={`club-filter-fallback-${clubOption.name}`}
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
