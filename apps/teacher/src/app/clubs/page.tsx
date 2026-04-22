"use client";

import { useEffect, useState } from "react";
import { SkeletonClubCard, useDeferredLoading } from "ui";
import { clearTokens, getAccessToken, getSessionUser } from "utils";
import { getTeacherClubs } from "@/api/teacher";
import { ClubItem, Pagination } from "@/components";
import { moveToWebLogin } from "@/lib/auth";
import type { TeacherClubSummary } from "@/types/teacher";

export default function TeacherClubsPage() {
  const [curPage, setCurPage] = useState(1);
  const limit = 8;
  const [clubs, setClubs] = useState<TeacherClubSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const showSkeleton = useDeferredLoading(isLoading);

  useEffect(() => {
    let isMounted = true;

    const loadClubs = async () => {
      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();

      if (!accessToken || !sessionUser || sessionUser.role !== "TEACHER") {
        clearTokens();
        moveToWebLogin();
        return;
      }

      try {
        const response = await getTeacherClubs();
        if (!isMounted) return;
        setClubs(response);
        setErrorMessage("");
      } catch {
        if (!isMounted) return;
        setErrorMessage("동아리 목록을 불러오지 못했습니다.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadClubs();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-3xl text-gray-900">동아리 전체 조회</h1>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-red-700 text-sm">
            {errorMessage}
          </div>
        ) : null}

        <div className="mb-10 flex min-h-[660px] flex-wrap gap-7">
          {showSkeleton ? (
            Array.from({ length: limit }, () => (
              <SkeletonClubCard key={crypto.randomUUID()} />
            ))
          ) : clubs.length === 0 ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">등록된 동아리가 없습니다.</p>
            </div>
          ) : (
            clubs
              .slice((curPage - 1) * limit, curPage * limit)
              .map((club) => (
                <ClubItem
                  key={club.clubId}
                  clubId={club.clubId}
                  clubImage={club.clubImage}
                  clubName={club.clubName}
                  introduction={club.introduction}
                />
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
