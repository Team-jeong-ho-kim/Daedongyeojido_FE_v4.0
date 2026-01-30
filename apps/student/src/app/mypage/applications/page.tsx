"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";

interface Application {
  id: number;
  clubName: string;
  clubLogo?: string;
  applicantName: string;
  studentId: string;
  deadline: string;
}

// TODO: API 연동 후 실제 데이터로 교체
const mockApplications: Application[] = [
  {
    id: 1,
    clubName: "DMS",
    applicantName: "손희찬",
    studentId: "2306",
    deadline: "12월 12일",
  },
  {
    id: 2,
    clubName: "DMS",
    applicantName: "손희찬",
    studentId: "2306",
    deadline: "12월 12일",
  },
  {
    id: 3,
    clubName: "DMS",
    applicantName: "손희찬",
    studentId: "2306",
    deadline: "12월 12일",
  },
  {
    id: 4,
    clubName: "DMS",
    applicantName: "손희찬",
    studentId: "2306",
    deadline: "12월 12일",
  },
  {
    id: 5,
    clubName: "DMS",
    applicantName: "손희찬",
    studentId: "2306",
    deadline: "12월 12일",
  },
];

export default function MyApplicationsPage() {
  const [curPage, setCurPage] = useState(1);
  const limit = 5;

  const offset = (curPage - 1) * limit;
  const currentApplications = mockApplications.slice(offset, offset + limit);

  const handleApplicationClick = (id: number) => {
    // TODO: 지원서 상세 페이지로 이동
    console.log("Application clicked:", id);
  };

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

        {mockApplications.length === 0 ? (
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
                  key={application.id}
                  type="button"
                  onClick={() => handleApplicationClick(application.id)}
                  className="flex w-full items-center gap-6 rounded-2xl bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#7D5C5C]">
                    {application.clubLogo ? (
                      <Image
                        src={application.clubLogo}
                        alt={application.clubName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-xl bg-[#7D5C5C]" />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col items-start gap-2">
                    <span className="font-semibold text-base text-primary-500">
                      {application.clubName}
                    </span>
                    <div className="flex items-center gap-4 text-gray-600 text-sm">
                      <span className="font-medium">
                        {application.applicantName}
                      </span>
                      <span className="font-normal">
                        학번 : {application.studentId}
                      </span>
                      <span className="font-normal">
                        지원 마감일 : {application.deadline}
                      </span>
                    </div>
                  </div>

                  <Image
                    src="/images/clubs/rightArrow.svg"
                    alt="arrow"
                    width={10}
                    height={18}
                  />
                </button>
              ))}
            </div>

            {mockApplications.length > limit && (
              <div className="mt-12">
                <Pagination
                  listLen={mockApplications.length}
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
