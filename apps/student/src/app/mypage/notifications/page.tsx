"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Pagination } from "@/components/common/Pagination";

interface Notification {
  id: number;
  title: string;
  date: string;
  content: string;
}

// TODO: API 연동 후 실제 데이터로 교체
const mockNotifications: Notification[] = [
  {
    id: 1,
    title: "대동여지도 면접 결과",
    date: "2025.12.24",
    content: "면접에 합격하셨습니다. 축하드립니다!",
  },
  {
    id: 2,
    title: "결과",
    date: "2025.12.24",
    content: "알림 내용입니다.",
  },
  {
    id: 3,
    title: "결과",
    date: "2025.12.24",
    content: "알림 내용입니다.",
  },
  {
    id: 4,
    title: "결과",
    date: "2025.12.24",
    content: "알림 내용입니다.",
  },
  {
    id: 5,
    title: "결과",
    date: "2025.12.24",
    content: "알림 내용입니다.",
  },
  {
    id: 6,
    title: "결과",
    date: "2025.12.24",
    content: "알림 내용입니다.",
  },
  {
    id: 7,
    title: "결과",
    date: "2025.12.24",
    content: "알림 내용입니다.",
  },
  {
    id: 8,
    title: "결과",
    date: "2025.12.24",
    content: "알림 내용입니다.",
  },
];

export default function NotificationsPage() {
  const [curPage, setCurPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const limit = 5;

  const offset = (curPage - 1) * limit;
  const currentNotifications = mockNotifications.slice(offset, offset + limit);

  const handleNotificationClick = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        <div className="mb-8 flex items-center gap-2 text-gray-400 text-sm">
          <Link href="/mypage" className="hover:text-gray-600">
            마이페이지
          </Link>
          <span>&gt;</span>
          <span className="text-gray-600">알림함</span>
        </div>
        <h1 className="mb-12 font-extrabold text-3xl tracking-tight">알림함</h1>

        <div className="space-y-4">
          {currentNotifications.map((notification) => {
            const isExpanded = expandedId === notification.id;
            return (
              <div
                key={notification.id}
                className="overflow-hidden rounded-2xl bg-gray-50 transition-colors hover:bg-gray-100"
              >
                <button
                  type="button"
                  onClick={() => handleNotificationClick(notification.id)}
                  className="flex w-full items-center justify-between px-8 py-6"
                >
                  <span className="font-medium text-base text-gray-900">
                    {notification.title}
                  </span>
                  <div className="flex items-center gap-6">
                    <span className="font-normal text-gray-500 text-sm">
                      {notification.date}
                    </span>
                    <div
                      className="transition-transform duration-300"
                      style={{
                        transform: isExpanded
                          ? "rotate(90deg)"
                          : "rotate(0deg)",
                      }}
                    >
                      <Image
                        src="/images/clubs/rightArrow.svg"
                        alt="arrow"
                        width={10}
                        height={18}
                      />
                    </div>
                  </div>
                </button>
                <div
                  className="transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: isExpanded ? "200px" : "0px",
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  <div className="border-gray-200 border-t px-8 py-6">
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {notification.content}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
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
      </div>
    </div>
  );
}
