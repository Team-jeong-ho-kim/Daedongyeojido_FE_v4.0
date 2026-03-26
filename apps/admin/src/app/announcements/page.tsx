"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AnnouncementClubFilter,
  type AnnouncementClubFilterOption,
} from "@/components/announcement";
import { Pagination } from "@/components/common";
import { useGetAllAnnouncementsQuery } from "@/hooks/querys";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryErrorToast } from "@/hooks/useQueryErrorToast";

const toDeadlineText = (deadline: [number, number, number] | string) => {
  if (typeof deadline === "string") return deadline;
  return `${deadline[0]}-${String(deadline[1]).padStart(2, "0")}-${String(deadline[2]).padStart(2, "0")}`;
};

export default function AdminAnnouncementsPage() {
  const router = useRouter();
  const [curPage, setCurPage] = useState(1);
  const [selectedClub, setSelectedClub] = useState("전체");
  const { isAuthorized, isBooting } = useAdminAuth();
  const announcementsQuery = useGetAllAnnouncementsQuery(isAuthorized);
  const announcements = announcementsQuery.data ?? [];
  const limit = 8;

  const clubOptions: AnnouncementClubFilterOption[] = [
    { imageUrl: null, name: "전체" },
    ...Array.from(
      announcements.reduce((acc, item) => {
        const imageUrl = item.clubImage?.trim() ? item.clubImage : null;
        const currentImage = acc.get(item.clubName);

        if (currentImage === undefined || (!currentImage && imageUrl)) {
          acc.set(item.clubName, imageUrl);
        }

        return acc;
      }, new Map<string, string | null>()),
      ([name, imageUrl]) => ({
        imageUrl,
        name,
      }),
    ),
  ];
  const filteredAnnouncements =
    selectedClub === "전체"
      ? announcements
      : announcements.filter((item) => item.clubName === selectedClub);
  const pagedAnnouncements = filteredAnnouncements.slice(
    (curPage - 1) * limit,
    curPage * limit,
  );
  const emptyStateMessage =
    announcements.length === 0
      ? "공고가 없습니다."
      : "선택한 동아리의 공고가 없습니다.";

  useQueryErrorToast(
    announcementsQuery.error,
    "공고 목록을 불러오지 못했습니다.",
  );

  if (isBooting || (isAuthorized && announcementsQuery.isLoading)) {
    return (
      <main className="mt-10 flex min-h-screen justify-center bg-white">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <p className="text-gray-500 text-sm">공고 목록을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-3xl text-gray-900">공고 전체 조회</h1>
        </div>

        {!announcementsQuery.isFetching && announcements.length > 0 && (
          <AnnouncementClubFilter
            clubOptions={clubOptions}
            selectedClub={selectedClub}
            onSelectClub={(clubName) => {
              setSelectedClub(clubName);
              setCurPage(1);
            }}
          />
        )}

        <div className="mb-10 flex min-h-[660px] flex-wrap gap-7">
          {announcementsQuery.isFetching ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">불러오는 중...</p>
            </div>
          ) : filteredAnnouncements.length === 0 ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">{emptyStateMessage}</p>
            </div>
          ) : (
            pagedAnnouncements.map((announcement) => (
              <button
                key={announcement.announcementId}
                type="button"
                onClick={() =>
                  router.push(`/announcements/${announcement.announcementId}`)
                }
                className="group relative h-[310px] w-[280px] cursor-pointer select-none overflow-hidden rounded-3xl text-left"
              >
                <div className="absolute top-0 left-0 h-[268px] w-full bg-[#355849] transition-all duration-300 group-hover:h-[200px]">
                  {announcement.clubImage ? (
                    <Image
                      src={announcement.clubImage}
                      alt={announcement.title}
                      fill
                      sizes="280px"
                      className="object-cover"
                    />
                  ) : null}
                  <span className="absolute top-6 right-3 z-10 flex h-6 w-6 items-center justify-center">
                    <Image
                      src="/images/clubs/rightArrow.svg"
                      alt="상세보기"
                      width={10}
                      height={10}
                      className="h-[10px] w-[10px]"
                    />
                  </span>
                </div>

                <section className="absolute bottom-0 left-0 flex w-full flex-col gap-1 rounded-b-3xl bg-gray-50 px-6 py-4 transition-all duration-300 group-hover:py-5">
                  <h2 className="line-clamp-1 font-semibold text-base text-gray-900 group-hover:line-clamp-none">
                    {announcement.title}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {announcement.clubName}
                  </p>
                  <p className="text-gray-500 text-xs">
                    모집 기한: {toDeadlineText(announcement.deadline)}
                  </p>
                </section>
              </button>
            ))
          )}
        </div>

        <Pagination
          listLen={filteredAnnouncements.length}
          limit={limit}
          curPage={curPage}
          setCurPage={setCurPage}
        />
      </div>
    </main>
  );
}
