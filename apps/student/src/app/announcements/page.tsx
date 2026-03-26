"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "shared";
import { Button, SkeletonAnnouncementCard, useDeferredLoading } from "ui";
import {
  AnnouncementClubFilter,
  type AnnouncementClubFilterOption,
  AnnouncementItem,
  CTASection,
  Pagination,
} from "@/components";
import { useGetAllAnnouncementsQuery } from "@/hooks/querys/useAnnouncementQuery";
import type { Announcement } from "@/types";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [curPage, setCurPage] = useState(1);
  const [selectedClub, setSelectedClub] = useState("전체");
  const limit = 8;

  const { data: announcementsData, isPending } = useGetAllAnnouncementsQuery();
  const showSkeleton = useDeferredLoading(isPending);

  const role = useUserStore((state) => state.userInfo?.role);
  const isClubMember = role === "CLUB_MEMBER" || role === "CLUB_LEADER";

  const announcements: Announcement[] =
    announcementsData
      ?.map((item) => ({
        announcement_id: item.announcementId,
        title: item.title,
        club_name: item.clubName,
        deadline:
          typeof item.deadline === "string"
            ? item.deadline
            : `${item.deadline[0]}-${String(item.deadline[1]).padStart(2, "0")}-${String(item.deadline[2]).padStart(2, "0")}`,
        club_image: item.clubImage,
      }))
      .sort((a, b) => b.announcement_id - a.announcement_id) || []; // 최신순 정렬

  const clubOptions: AnnouncementClubFilterOption[] = [
    { imageUrl: null, name: "전체" },
    ...Array.from(
      announcements.reduce((acc, item) => {
        const imageUrl = item.club_image?.trim() ? item.club_image : null;
        const currentImage = acc.get(item.club_name);

        if (currentImage === undefined || (!currentImage && imageUrl)) {
          acc.set(item.club_name, imageUrl);
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
      : announcements.filter((item) => item.club_name === selectedClub);
  const pagedAnnouncements = filteredAnnouncements.slice(
    (curPage - 1) * limit,
    curPage * limit,
  );
  const emptyStateMessage =
    announcements.length === 0
      ? "공고가 없습니다."
      : "선택한 동아리의 공고가 없습니다.";

  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-3xl text-gray-900">공고 전체 조회</h1>
          {isClubMember && (
            <Button
              variant="ghost"
              onClick={() => router.push("/announcements/create")}
              className="cursor-pointer rounded-xl bg-primary-500 p-6 text-white transition-all hover:bg-primary-600 hover:text-white hover:shadow-lg"
            >
              동아리 공고 개설하기
            </Button>
          )}
        </div>

        {!showSkeleton && announcements.length > 0 && (
          <AnnouncementClubFilter
            clubOptions={clubOptions}
            selectedClub={selectedClub}
            onSelectClub={(clubName) => {
              setSelectedClub(clubName);
              setCurPage(1);
            }}
          />
        )}

        {/* 공고 목록 */}
        <div className="mb-10 flex min-h-[660px] flex-wrap gap-7">
          {showSkeleton ? (
            Array.from({ length: limit }, () => (
              <SkeletonAnnouncementCard key={crypto.randomUUID()} />
            ))
          ) : filteredAnnouncements.length === 0 ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">{emptyStateMessage}</p>
            </div>
          ) : (
            pagedAnnouncements.map((announcement) => (
              <AnnouncementItem
                key={announcement.announcement_id}
                {...announcement}
              />
            ))
          )}
        </div>

        {/* 페이지네이션 */}
        <Pagination
          listLen={filteredAnnouncements.length}
          limit={limit}
          curPage={curPage}
          setCurPage={setCurPage}
        />

        {/* CTA 섹션 */}
        <div className="mt-32 mb-32">
          <CTASection
            title="어떤 동아리에 지원해야 할지 모르겠다면?"
            subtitle="아래 버튼을 눌러 다양한 동아리를 탐색해보세요!"
            description="아래 버튼을 눌러 나에게 맞는 동아리를 찾아보세요!"
            buttonText="동아리 찾아보기"
            buttonHref="/clubs"
          />
        </div>
      </div>
    </main>
  );
}
