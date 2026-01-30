"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";

type ApplicationStatus = "합격" | "제출됨" | "불합격";

interface ApplicationHistory {
  id: number;
  clubName: string;
  clubLogo?: string;
  status: ApplicationStatus;
}

// TODO: API 연동 후 실제 데이터로 교체
const mockHistory: ApplicationHistory[] = [
  { id: 1, clubName: "DMS", status: "합격" },
  { id: 2, clubName: "DMS", status: "제출됨" },
  { id: 3, clubName: "DMS", status: "불합격" },
  { id: 4, clubName: "DMS", status: "제출됨" },
  { id: 5, clubName: "DMS", status: "제출됨" },
];

const getStatusStyle = (status: ApplicationStatus) => {
  switch (status) {
    case "합격":
      return "border-blue-500 text-blue-500";
    case "불합격":
      return "border-red-500 text-red-500";
    case "제출됨":
      return "border-gray-800 text-gray-800";
    default:
      return "border-gray-800 text-gray-800";
  }
};

export default function ApplicationHistoryPage() {
  const [curPage, setCurPage] = useState(1);
  const limit = 5;

  const offset = (curPage - 1) * limit;
  const currentHistory = mockHistory.slice(offset, offset + limit);

  const handleHistoryClick = (id: number) => {
    // TODO: 지원 내역 상세 페이지로 이동
    console.log("History clicked:", id);
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

        {mockHistory.length === 0 ? (
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
              {currentHistory.map((history) => (
                <button
                  key={history.id}
                  type="button"
                  onClick={() => handleHistoryClick(history.id)}
                  className="flex w-full items-center gap-6 rounded-2xl bg-gray-50 px-8 py-6 transition-colors hover:bg-gray-100"
                >
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#7D5C5C]">
                    {history.clubLogo ? (
                      <Image
                        src={history.clubLogo}
                        alt={history.clubName}
                        width={64}
                        height={64}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full rounded-xl bg-[#7D5C5C]" />
                    )}
                  </div>

                  <div className="flex flex-1 items-center gap-4">
                    <span className="font-semibold text-base text-primary-500">
                      {history.clubName}
                    </span>
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <span className="font-normal">지원서 상태 :</span>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs ${getStatusStyle(history.status)}`}
                      >
                        {history.status}
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

            {mockHistory.length > limit && (
              <div className="mt-12">
                <Pagination
                  listLen={mockHistory.length}
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
