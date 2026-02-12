"use client";

import Link from "next/link";
import { useState } from "react";
import { Button, SkeletonClubCard, useDeferredLoading } from "ui";
import { ClubItem, CTASection, Pagination } from "@/components";
import { useGetAllClubsQuery } from "@/hooks/querys/useClubQuery";

export default function ClubsPage() {
  const [curPage, setCurPage] = useState(1);
  const limit = 8;

  const { data: clubs, isPending } = useGetAllClubsQuery();
  const showSkeleton = useDeferredLoading(isPending);

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
        <div className="mb-10 flex min-h-[660px] flex-wrap gap-7">
          {showSkeleton ? (
            Array.from({ length: limit }, () => (
              <SkeletonClubCard key={crypto.randomUUID()} />
            ))
          ) : !clubs || clubs.length === 0 ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">등록된 동아리가 없습니다.</p>
            </div>
          ) : (
            clubs
              .slice((curPage - 1) * limit, curPage * limit)
              .map((club) => <ClubItem key={club.clubId} {...club} />)
          )}
        </div>

        {/* 페이지네이션 */}
        <Pagination
          listLen={clubs?.length || 0}
          limit={limit}
          curPage={curPage}
          setCurPage={setCurPage}
        />

        {/* CTA 섹션 */}
        <div className="mt-32 mb-32">
          <CTASection
            title="발견한 동아리의 공고를 찾아보고 싶나요?"
            subtitle="아래 버튼을 눌러 여러 공고 페이지로 이동해보세요!"
            description="아래 버튼을 눌러 찾아보세요!"
            buttonText="공고 보러가기"
            buttonHref="/announcements"
          />
        </div>
      </div>
    </main>
  );
}
