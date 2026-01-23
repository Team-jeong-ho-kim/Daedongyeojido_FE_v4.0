"use client";

import Link from "next/link";
import { useState } from "react";
import Pagination from "@/components/common/Pagination";

// 임시 데이터 - 실제로는 API에서 가져올 예정
const mockNotifications = [
  {
    id: "1",
    title: "[중요] 신입생 오리엔테이션 안내",
    date: "2023-12-05",
    isRead: false,
  },
  {
    id: "2",
    title: "[공지] 동아리 신입 부원 모집 안내",
    date: "2023-12-03",
    isRead: true,
  },
  {
    id: "3",
    title: "[안내] 2024학년도 1학기 일정 안내",
    date: "2023-12-01",
    isRead: true,
  },
  {
    id: "4",
    title: "[중요] 기숙사 입사 안내",
    date: "2023-11-28",
    isRead: false,
  },
  {
    id: "5",
    title: "[공지] 겨울방학 특강 신청 안내",
    date: "2023-11-25",
    isRead: true,
  },
];

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

export default function NotificationsPage() {
  const [curPage, setCurPage] = useState(1);
  const limit = 10;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <div className="px-6 py-12 md:px-12 lg:px-40">
        <h1 className="text-grayscale-800 text-s-headline-bold">알림함</h1>
      </div>

      {/* 알림 목록 */}
      <div className="flex flex-col gap-0 px-6 pb-20 md:px-12 lg:px-40">
        {mockNotifications.length === 0 ? (
          <div className="py-20 text-center text-grayscale-400 text-l-body">
            알림이 없습니다.
          </div>
        ) : (
          <>
            <div className="flex flex-col">
              {mockNotifications
                .slice((curPage - 1) * limit, curPage * limit)
                .map((notification) => (
                  <NotificationItem key={notification.id} {...notification} />
                ))}
            </div>

            {mockNotifications.length > limit && (
              <div className="mt-12">
                <Pagination
                  listLen={mockNotifications.length}
                  limit={limit}
                  curPage={curPage}
                  setCurPage={setCurPage}
                />
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}

interface NotificationItemProps {
  id: string;
  title: string;
  date: string;
  isRead: boolean;
}

function NotificationItem({ id, title, date, isRead }: NotificationItemProps) {
  return (
    <Link
      href={`/notifications/${id}`}
      className="flex w-full items-center justify-between rounded-3xl bg-grayscale-50 p-11 transition-colors hover:bg-grayscale-100"
    >
      <div className="flex items-center gap-4">
        {!isRead && <span className="size-2 rounded-full bg-primary-500" />}
        <h3
          className={`text-s-title-bold ${isRead ? "text-grayscale-500" : "text-grayscale-800"}`}
        >
          {title}
        </h3>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-grayscale-500 text-s-title">{date}</span>
        <ChevronRightIcon className="size-8 text-grayscale-400" />
      </div>
    </Link>
  );
}
