"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useUserStore } from "shared";
import { Button } from "ui";
import { AnnouncementItem, CTASection, Pagination } from "@/components";
import { useGetAllAnnouncementsQuery } from "@/hooks/querys/useAnnouncementQuery";
import type { Announcement } from "@/types";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [curPage, setCurPage] = useState(1);
  const limit = 8;

  const { data: announcementsData } = useGetAllAnnouncementsQuery();

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

  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-3xl text-gray-900">공고 전체 조회</h1>
          {isClubMember && (
            <Button
              variant="ghost"
              onClick={() => router.push("/announcements/create")}
              className="cursor-pointer rounded-xl bg-gray-50 p-6 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              동아리 공고 개설하기
            </Button>
          )}
        </div>

        {/* 공고 목록 */}
        <div className="mb-10 flex min-h-[660px] flex-wrap gap-7">
          {announcements
            .slice((curPage - 1) * limit, curPage * limit)
            .map((announcement) => (
              <AnnouncementItem
                key={announcement.announcement_id}
                {...announcement}
              />
            ))}
        </div>

        {/* 페이지네이션 */}
        <div className="mt-20 mb-20">
          <Pagination
            listLen={announcements.length}
            limit={limit}
            curPage={curPage}
            setCurPage={setCurPage}
          />
        </div>

        {/* CTA 섹션 */}
        <CTASection
          title="어떤 동아리에 지원해야 할지 모르겠다면?"
          subtitle="아래 버튼을 눌러 다양한 동아리를 탐색해보세요!"
          description="아래 버튼을 눌러 나에게 맞는 동아리를 찾아보세요!"
          buttonText="동아리 찾아보기"
        />
      </div>
    </main>
  );
}
