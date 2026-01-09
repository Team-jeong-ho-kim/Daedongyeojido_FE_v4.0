"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "ui";
import { AnnouncementItem, CTASection, Pagination } from "@/components";
import type { Announcement, UserRole } from "@/types";

export default function AnnouncementsPage() {
  const router = useRouter();
  const [curPage, setCurPage] = useState(1);
  const limit = 8;

  // 서버에서 권한 가져오기
  const role = "CLUB_MEMBER" as UserRole;
  const isClubMember = role === "CLUB_MEMBER" || role === "CLUB_LEADER";

  // 임시 데이터
  const announcements: Announcement[] = [
    {
      announcement_id: 1,
      title: "2025 상반기 신입 동아리원",
      club_name: "대동여지도",
      deadline: "2025-12-12",
      club_image:
        "https://daedong-bucket.s3.ap-northeast-2.amazonaws.com/6841828f-6f6b-4670-a4b2-0bb3411274a2.jpg",
    },
    {
      announcement_id: 2,
      title: "2025 상반기 신입 동아리원 모집",
      club_name: "대동여지도",
      deadline: "2025-12-12",
      club_image:
        "https://daedong-bucket.s3.ap-northeast-2.amazonaws.com/6841828f-6f6b-4670-a4b2-0bb3411274a2.jpg",
    },
    {
      announcement_id: 3,
      title: "DMS 백엔드 개발자 모집",
      club_name: "DMS",
      deadline: "2025-01-25",
      club_image: "",
    },
    {
      announcement_id: 4,
      title: "INFO 디자이너 모집",
      club_name: "INFO",
      deadline: "2025-01-20",
      club_image: "",
    },
    {
      announcement_id: 5,
      title: "TeamQSS 신입 부원 모집",
      club_name: "TeamQSS",
      deadline: "2025-02-28",
      club_image: "",
    },
  ];

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
