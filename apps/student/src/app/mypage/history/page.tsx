"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SkeletonListItem, useDeferredLoading } from "ui";
import { Pagination } from "@/components/common/Pagination";
import { useGetMySubmissionHistoryQuery } from "@/hooks/querys/useApplicationFormQuery";

type ApplicationStatusLabel = "합격" | "제출됨" | "불합격" | "작성중";

const getStatusStyle = (status: ApplicationStatusLabel) => {
  switch (status) {
    case "합격":
      return "border-blue-500 text-blue-500";
    case "불합격":
      return "border-red-500 text-red-500";
    case "작성중":
      return "border-yellow-500 text-yellow-600";
    case "제출됨":
      return "border-gray-800 text-gray-800";
    default:
      return "border-gray-800 text-gray-800";
  }
};

const getStatusLabel = (status: string): ApplicationStatusLabel => {
  switch (status) {
    case "SUBMITTED":
      return "제출됨";
    case "WRITING":
      return "작성중";
    case "ACCEPTED":
      return "합격";
    case "REJECTED":
      return "불합격";
    default:
      return "제출됨";
  }
};

export default function ApplicationHistoryPage() {
  const router = useRouter();
  const [curPage, setCurPage] = useState(1);
  const limit = 5;

  const { data: submissionsData, isPending } = useGetMySubmissionHistoryQuery();
  const showSkeleton = useDeferredLoading(isPending);

  const submissions = (submissionsData || []).sort(
    (a, b) => b.submissionId - a.submissionId,
  );

  const offset = (curPage - 1) * limit;
  const currentHistory = submissions.slice(offset, offset + limit);

  const handleHistoryClick = (
    submissionId: number,
    user_application_status: string,
  ) => {
    router.push(
      `/mypage/applications/${submissionId}?from=history&status=${user_application_status}`,
    );
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        <div className="mb-8 flex items-center gap-2 text-gray-400 text-sm">
          <Link href="/mypage" className="hover:text-gray-600">
            마이페이지
          </Link>
          <span>&gt;</span>
          <span className="text-gray-600">지원 내역</span>
        </div>
        <h1 className="mb-12 font-extrabold text-3xl tracking-tight">
          지원 내역
        </h1>

        {showSkeleton ? (
          <div className="space-y-4">
            {Array.from({ length: limit }, () => (
              <SkeletonListItem key={crypto.randomUUID()} />
            ))}
          </div>
        ) : submissions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Image
              src="/images/icons/redTiger.svg"
              alt="지원 내역 없음"
              width={194}
              height={201}
              className="mb-8"
            />
            <p className="text-center text-base text-gray-500">
              지원 내역이 없어요
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentHistory.map((history) => {
                const statusLabel = getStatusLabel(
                  history.user_application_status,
                );
                return (
                  <button
                    key={history.submissionId}
                    type="button"
                    onClick={() =>
                      handleHistoryClick(
                        history.submissionId,
                        history.user_application_status,
                      )
                    }
                    className="flex w-full items-center gap-6 rounded-2xl bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
                  >
                    <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                      {history.clubImage ? (
                        <Image
                          src={history.clubImage}
                          alt={history.clubName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#7D5C5C]">
                          <span className="font-bold text-white text-xl">
                            {history.clubName[0]}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-1 items-center gap-4">
                      <span className="font-semibold text-base text-primary-500">
                        {history.clubName}
                      </span>
                      <div className="flex items-center gap-2 text-gray-600 text-sm">
                        <span className="font-normal">지원서 상태 :</span>
                        <span
                          className={`rounded-full border px-3 py-1 text-xs ${getStatusStyle(statusLabel)}`}
                        >
                          {statusLabel}
                        </span>
                      </div>
                    </div>

                    <Image
                      src="/images/clubs/rightArrow.svg"
                      alt="상세보기"
                      width={10}
                      height={18}
                    />
                  </button>
                );
              })}
            </div>

            {submissions.length > limit && (
              <div className="mt-12">
                <Pagination
                  listLen={submissions.length}
                  limit={limit}
                  curPage={curPage}
                  setCurPage={setCurPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
