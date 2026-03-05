"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError, clearTokens, getAccessToken, getSessionUser } from "utils";
import { getAllAnnouncements } from "@/api/announcement";
import Pagination from "@/components/common/Pagination";
import type { AdminAnnouncementListItem } from "@/types/admin";

const moveToWebLogin = () => {
  const webUrl = (process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000")
    .trim()
    .replace(/\/$/, "");
  window.location.href = `${webUrl}/login`;
};

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) return error.description;
  return fallback;
};

const toDeadlineText = (deadline: [number, number, number] | string) => {
  if (typeof deadline === "string") return deadline;
  return `${deadline[0]}-${String(deadline[1]).padStart(2, "0")}-${String(deadline[2]).padStart(2, "0")}`;
};

export default function AdminAnnouncementsPage() {
  const [booting, setBooting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [announcements, setAnnouncements] = useState<
    AdminAnnouncementListItem[]
  >([]);
  const [curPage, setCurPage] = useState(1);
  const limit = 8;

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();

      if (!accessToken || !sessionUser || sessionUser.role !== "ADMIN") {
        clearTokens();
        moveToWebLogin();
        if (!cancelled) setBooting(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await getAllAnnouncements();
        if (cancelled) return;
        setAnnouncements(
          [...data].sort((a, b) => b.announcementId - a.announcementId),
        );
      } catch (error) {
        toast.error(toErrorMessage(error, "공고 목록을 불러오지 못했습니다."));
        if (!cancelled) setAnnouncements([]);
      } finally {
        if (!cancelled) {
          setIsLoading(false);
          setBooting(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, []);

  if (booting) {
    return (
      <main className="mt-10 flex min-h-screen justify-center bg-white">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <p className="text-gray-500 text-sm">공고 목록을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-3xl text-gray-900">공고 전체 조회</h1>
        </div>

        <div className="mb-10 flex min-h-[660px] flex-wrap gap-7">
          {isLoading ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">불러오는 중...</p>
            </div>
          ) : announcements.length === 0 ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">공고가 없습니다.</p>
            </div>
          ) : (
            announcements
              .slice((curPage - 1) * limit, curPage * limit)
              .map((announcement) => (
                <button
                  key={announcement.announcementId}
                  type="button"
                  onClick={() =>
                    toast("공고 상세 페이지는 준비 중입니다.", {
                      description: `${announcement.title}`,
                    })
                  }
                  className="group relative h-[310px] w-[280px] cursor-pointer select-none overflow-hidden rounded-3xl text-left"
                >
                  <div className="absolute top-0 left-0 h-[268px] w-full bg-[#355849] transition-all duration-300 group-hover:h-[200px]">
                    {announcement.clubImage && (
                      <Image
                        src={announcement.clubImage}
                        alt={announcement.title}
                        fill
                        className="object-cover"
                      />
                    )}
                    <span className="absolute top-6 right-3 z-10 flex h-6 w-6 items-center justify-center">
                      <Image
                        src="/images/clubs/rightArrow.svg"
                        alt="상세보기"
                        width={10}
                        height={10}
                      />
                    </span>
                  </div>

                  <section className="absolute bottom-0 left-0 flex w-full flex-col gap-1 rounded-b-3xl bg-gray-50 px-6 py-4 transition-all duration-300 group-hover:py-5">
                    <h2 className="line-clamp-1 font-semibold text-base text-gray-900 group-hover:line-clamp-none">
                      {announcement.title}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      {announcement.clubName}
                    </p>
                    <p className="text-gray-500 text-xs">
                      모집 기한: {toDeadlineText(announcement.deadline)}
                    </p>
                  </section>
                </button>
              ))
          )}
        </div>

        <Pagination
          listLen={announcements.length}
          limit={limit}
          curPage={curPage}
          setCurPage={setCurPage}
        />
      </div>
    </main>
  );
}
