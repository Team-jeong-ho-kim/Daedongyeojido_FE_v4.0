"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { SkeletonListItem, useDeferredLoading } from "ui";
import { Pagination } from "@/components/common/Pagination";
import { useGetUserAlarmsQuery } from "@/hooks/querys/useApplicationFormQuery";

export default function NotificationsPage() {
  const [curPage, setCurPage] = useState(1);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const limit = 5;

  const { data: alarmsData, isPending } = useGetUserAlarmsQuery();
  const showSkeleton = useDeferredLoading(isPending);

  // 최신순 정렬 (ID 내림차순)
  const alarms = (alarmsData || []).sort((a, b) => b.id - a.id);

  const offset = (curPage - 1) * limit;
  const currentAlarms = alarms.slice(offset, offset + limit);

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

        {showSkeleton ? (
          <div className="space-y-4">
            {Array.from({ length: limit }, () => (
              <SkeletonListItem key={crypto.randomUUID()} />
            ))}
          </div>
        ) : alarms.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Image
              src="/images/icons/redTiger.svg"
              alt="알림 없음"
              width={194}
              height={201}
              className="mb-8"
            />
            <p className="text-center text-base text-gray-500">
              알림함이 비어있어요
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentAlarms.map((alarm) => {
                const isExpanded = expandedId === alarm.id;
                return (
                  <div
                    key={alarm.id}
                    className="overflow-hidden rounded-2xl bg-gray-50 transition-colors hover:bg-gray-100"
                  >
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(alarm.id)}
                      className="flex w-full items-center justify-between px-8 py-6"
                    >
                      <span className="font-medium text-base text-gray-900">
                        {alarm.title}
                      </span>
                      <div className="flex items-center gap-6">
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
                            alt="상세보기"
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
                          {alarm.content}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {alarms.length > limit && (
              <div className="mt-12">
                <Pagination
                  listLen={alarms.length}
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
