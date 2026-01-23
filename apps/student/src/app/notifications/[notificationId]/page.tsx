"use client";

import Link from "next/link";
import { use } from "react";

interface NotificationDetailPageProps {
  params: Promise<{ notificationId: string }>;
}

// 임시 데이터 - 실제로는 API에서 가져올 예정
const mockNotification = {
  id: "1",
  title: "[중요] 신입생 오리엔테이션 안내",
  date: "2023-12-05",
  content: `신입생 오리엔테이션 책자에 있는 입학전 과제의 양식입니다.
첨부파일을 다운받아 사용하시고,
영어와 전공은 특별한 양식이 없으니 내용에 맞게 작성하여 학교 홈페이지에 제출하시기 바랍니다.

■ 과제 제출 마감: 2024년 2월 20일 화요일
■ 학교 홈페이지 학생 회원가입 -> 학교 담당자가 승인
■ 학교 홈페이지 로그인 후 [과제제출 – 신입생 - 각 교과] 게시판에 제출
■ 과제 중 자기소개 PPT는 첨부한 파일을 참고하되, 자유롭게 만들어도 됩니다.`,
  results: [
    { id: "1", title: "결과", date: "2025.12.24" },
    { id: "2", title: "결과", date: "2025.12.24" },
  ],
};

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>다음</title>
      <path
        d="M9 18L15 12L9 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function NotificationDetailPage({
  params,
}: NotificationDetailPageProps) {
  // TODO: notificationId를 사용하여 API에서 데이터 가져오기
  const { notificationId: _notificationId } = use(params);
  const notification = mockNotification;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 브레드크럼 */}
      <div className="px-6 py-12 md:px-12 lg:px-40">
        <nav className="flex items-center gap-3">
          <Link
            href="/notifications"
            className="text-grayscale-300 text-s-title hover:text-grayscale-500"
          >
            알림함
          </Link>
          <ChevronRightIcon className="size-6 text-grayscale-300" />
          <span className="truncate text-grayscale-600 text-s-title">
            {notification.title.length > 12
              ? `${notification.title.slice(0, 12)}...`
              : notification.title}
          </span>
        </nav>
      </div>

      {/* 메인 컨텐츠 */}
      <div className="flex flex-col gap-8 px-6 pb-40 md:px-12 lg:px-40">
        {/* 공지 내용 카드 */}
        <article className="flex flex-col gap-9 rounded-xl bg-grayscale-50 px-8 py-12 md:px-12 md:py-17">
          <h1 className="text-grayscale-800 text-s-headline-bold">
            {notification.title}
          </h1>
          <time className="text-grayscale-900 text-s-title">
            {notification.date}
          </time>
          <div className="whitespace-pre-line text-body text-grayscale-900 leading-relaxed">
            {notification.content}
          </div>
        </article>

        {/* 결과 카드 목록 */}
        <div className="flex flex-col gap-0">
          {notification.results.map((result) => (
            <ResultCard
              key={result.id}
              title={result.title}
              date={result.date}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

interface ResultCardProps {
  title: string;
  date: string;
}

function ResultCard({ title, date }: ResultCardProps) {
  return (
    <button
      type="button"
      className="flex w-full items-center justify-between rounded-3xl bg-grayscale-50 p-11 transition-colors hover:bg-grayscale-100"
    >
      <h3 className="text-grayscale-800 text-s-title-bold">{title}</h3>
      <div className="flex items-center gap-4">
        <span className="text-grayscale-500 text-s-title">{date}</span>
        <ChevronRightIcon className="size-8 text-grayscale-400" />
      </div>
    </button>
  );
}
