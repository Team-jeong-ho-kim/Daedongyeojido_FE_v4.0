"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";
import { useGetMyApplicationsQuery } from "@/hooks/querys/useApplicationFormQuery";

export default function MyApplicationsPage() {
  const router = useRouter();
  const [curPage, setCurPage] = useState(1);
  const limit = 5;

  const { data: applicationsData, isLoading } = useGetMyApplicationsQuery();

  const applications = (applicationsData || []).sort(
    (a, b) => b.submissionId - a.submissionId,
  );

  const offset = (curPage - 1) * limit;
  const currentApplications = applications.slice(offset, offset + limit);

  const handleApplicationClick = (submissionId: number) => {
    router.push(`/mypage/applications/${submissionId}`);
  };

  const formatDeadline = (
    submissionDuration: string | [number, number, number],
  ) => {
    if (typeof submissionDuration === "string") {
      return submissionDuration;
    }
    return submissionDuration.map((n) => String(n).padStart(2, "0")).join("-");
  };

  const getStatusText = (status: "WRITING" | "SUBMITTED") => {
    return status === "WRITING" ? "작성중" : "제출완료";
  };

  const getStatusColor = (status: "WRITING" | "SUBMITTED") => {
    return status === "WRITING"
      ? "border-yellow-500 bg-yellow-50 text-yellow-600"
      : "border-green-500 bg-green-50 text-green-600";
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">지원서 목록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        <div className="mb-8 flex items-center gap-2 text-gray-400 text-sm">
          <Link href="/mypage" className="hover:text-gray-600">
            마이페이지
          </Link>
          <span>&gt;</span>
          <span className="text-gray-600">나의 지원서</span>
        </div>
        <h1 className="mb-12 font-extrabold text-3xl tracking-tight">
          나의 지원서
        </h1>

        {applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Image
              src="/images/icons/redTiger.svg"
              alt="지원서 없음"
              width={194}
              height={201}
              className="mb-8"
            />
            <p className="text-center text-base text-gray-500">
              지원서가 없어요
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentApplications.map((application) => (
                <button
                  key={application.submissionId}
                  type="button"
                  onClick={() =>
                    handleApplicationClick(application.submissionId)
                  }
                  className="flex w-full items-center gap-6 rounded-2xl bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
                >
                  <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl">
                    {application.clubImage ? (
                      <Image
                        src={application.clubImage}
                        alt={application.clubName}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#7D5C5C]">
                        <span className="font-bold text-white text-xl">
                          {application.clubName[0]}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col items-start gap-2">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-base text-primary-500">
                        {application.clubName}
                      </span>
                      <span
                        className={`rounded-md border px-2 py-0.5 font-medium text-xs ${getStatusColor(application.user_application_status)}`}
                      >
                        {getStatusText(application.user_application_status)}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <span className="font-normal">
                        지원 마감일 :{" "}
                        {formatDeadline(application.submissionDuration)}
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
              ))}
            </div>

            {applications.length > limit && (
              <div className="mt-12">
                <Pagination
                  listLen={applications.length}
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
