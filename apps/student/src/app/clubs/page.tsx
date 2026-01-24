"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "ui";
import { ClubItem, CTASection, Pagination } from "@/components";
import { useGetAllClubsQuery } from "@/hooks/querys/useClubQuery";

export default function ClubsPage() {
  const [curPage, setCurPage] = useState(1);
  const limit = 8;

  const { data: clubs } = useGetAllClubsQuery();

  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-3xl text-gray-900">동아리 전체 조회</h1>
          <Link href="/clubs/create">
            <Button
              variant="ghost"
              className="cursor-pointer rounded-xl bg-gray-50 p-6 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
            >
              동아리 개설 신청하기
            </Button>
          </Link>
        </div>

        {/* 동아리 목록 */}
        {!clubs || clubs.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-gray-500 text-lg">등록된 동아리가 없습니다.</p>
          </div>
        ) : (
          <>
            <div className="mb-10 flex flex-wrap gap-7">
              {clubs
                .slice((curPage - 1) * limit, curPage * limit)
                .map((club) => (
                  <ClubItem key={club.clubId} {...club} />
                ))}
            </div>

            {/* 페이지네이션 */}
            <div className="mt-30 mb-30">
              <Pagination
                listLen={clubs.length}
                limit={limit}
                curPage={curPage}
                setCurPage={setCurPage}
              />
            </div>
          </>
        )}

        {/* CTA 섹션 */}
        <CTASection
          title="발견한 동아리에 지원하고 싶나요?"
          subtitle="아래 버튼을 눌러 바로 지원하는 페이지로 이동해보세요!"
          description="아래 버튼을 눌러 지원해보세요!"
          buttonText="지원하러가기"
        />
      </div>
    </main>
  );
}
