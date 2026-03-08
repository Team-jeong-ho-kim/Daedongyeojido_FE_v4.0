"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ApiError, clearTokens, getAccessToken, getSessionUser } from "utils";
import { getAllClubs } from "@/api/club";
import Pagination from "@/components/common/Pagination";
import type { ClubSummary } from "@/types/admin";

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

export default function AdminClubsPage() {
  const [booting, setBooting] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [clubs, setClubs] = useState<ClubSummary[]>([]);
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
        const data = await getAllClubs();
        if (cancelled) return;
        setClubs(data);
      } catch (error) {
        toast.error(
          toErrorMessage(error, "동아리 목록을 불러오지 못했습니다."),
        );
        if (!cancelled) setClubs([]);
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
          <p className="text-gray-500 text-sm">동아리 목록을 불러오는 중...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-3xl text-gray-900">동아리 전체 조회</h1>
        </div>

        <div className="mb-10 flex min-h-[660px] flex-wrap gap-7">
          {isLoading ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">불러오는 중...</p>
            </div>
          ) : clubs.length === 0 ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">등록된 동아리가 없습니다.</p>
            </div>
          ) : (
            clubs.slice((curPage - 1) * limit, curPage * limit).map((club) => (
              <Link key={club.clubId} href={`/clubs/${club.clubId}`}>
                <article className="group relative h-[310px] w-[280px] cursor-pointer select-none overflow-hidden rounded-3xl">
                  <div className="absolute top-0 left-0 h-[268px] w-full bg-[#355849] transition-all duration-300 ease-out group-hover:h-[200px]">
                    {club.clubImage && (
                      <img
                        src={club.clubImage}
                        alt={club.clubName}
                        className="h-full w-full object-cover"
                      />
                    )}
                    <span className="absolute top-6 right-3 z-10 flex h-6 w-6 items-center justify-center">
                      <img
                        src="/images/clubs/rightArrow.svg"
                        alt=""
                        aria-hidden
                        className="h-[10px] w-[10px]"
                      />
                    </span>
                  </div>

                  <section className="absolute bottom-0 left-0 flex w-full flex-col gap-2 rounded-b-3xl bg-gray-50 px-6 py-4 transition-all duration-300 ease-out group-hover:py-5">
                    <h2 className="font-semibold text-2xl text-gray-900">
                      {club.clubName}
                    </h2>
                    <p className="text-[13px] text-gray-400">
                      동아리 ID: {club.clubId}
                    </p>
                    <p className="line-clamp-1 text-gray-500 text-sm opacity-70 transition-opacity delay-150 duration-300 ease-out group-hover:line-clamp-none group-hover:opacity-100">
                      {club.introduction}
                    </p>
                  </section>
                </article>
              </Link>
            ))
          )}
        </div>

        <Pagination
          listLen={clubs.length}
          limit={limit}
          curPage={curPage}
          setCurPage={setCurPage}
        />
      </div>
    </main>
  );
}
