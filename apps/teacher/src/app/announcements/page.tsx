"use client";

import { useEffect, useMemo, useState } from "react";
import { Skeleton, useDeferredLoading } from "ui";
import { clearTokens, getAccessToken, getSessionUser } from "utils";
import { getTeacherAnnouncements } from "@/api/teacher";
import {
  AnnouncementClubFilter,
  type AnnouncementClubFilterOption,
  AnnouncementItem,
  Pagination,
} from "@/components";
import { moveToWebLogin } from "@/lib/auth";
import type { TeacherAnnouncementListItem } from "@/types/teacher";

interface TeacherAnnouncementCard {
  announcement_id: number;
  title: string;
  club_name: string;
  deadline: string;
  club_image?: string;
}

const PAGE_SIZE = 8;

const toDeadlineText = (deadline: [number, number, number] | string) => {
  if (typeof deadline === "string") {
    return deadline;
  }

  return `${deadline[0]}-${String(deadline[1]).padStart(2, "0")}-${String(deadline[2]).padStart(2, "0")}`;
};

const TeacherAnnouncementSkeletonCard = () => {
  return (
    <div className="h-[310px] w-[280px] overflow-hidden rounded-3xl border border-gray-200">
      <Skeleton className="h-[200px] w-full rounded-none" />
      <div className="space-y-2 bg-gray-50 px-6 py-4">
        <Skeleton className="h-5 w-11/12" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
};

export default function TeacherAnnouncementsPage() {
  const [curPage, setCurPage] = useState(1);
  const [selectedClub, setSelectedClub] = useState("전체");
  const [announcementsData, setAnnouncementsData] = useState<
    TeacherAnnouncementListItem[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const showSkeleton = useDeferredLoading(isLoading);

  useEffect(() => {
    let isMounted = true;

    const loadAnnouncements = async () => {
      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();

      if (!accessToken || !sessionUser || sessionUser.role !== "TEACHER") {
        clearTokens();
        moveToWebLogin();
        return;
      }

      try {
        const response = await getTeacherAnnouncements();

        if (!isMounted) {
          return;
        }

        setAnnouncementsData(response);
        setErrorMessage("");
      } catch {
        if (!isMounted) {
          return;
        }

        setErrorMessage("공고 목록을 불러오지 못했습니다.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadAnnouncements();

    return () => {
      isMounted = false;
    };
  }, []);

  const announcements = useMemo<TeacherAnnouncementCard[]>(() => {
    return announcementsData
      .map((item) => ({
        announcement_id: item.announcementId,
        title: item.title,
        club_name: item.clubName,
        deadline: toDeadlineText(item.deadline),
        club_image: item.clubImage,
      }))
      .sort((a, b) => b.announcement_id - a.announcement_id);
  }, [announcementsData]);

  const clubOptions = useMemo<AnnouncementClubFilterOption[]>(() => {
    return [
      { imageUrl: null, name: "전체" },
      ...Array.from(
        announcements.reduce((acc, item) => {
          const imageUrl = item.club_image?.trim() ? item.club_image : null;
          const currentImage = acc.get(item.club_name);

          if (currentImage === undefined || (!currentImage && imageUrl)) {
            acc.set(item.club_name, imageUrl);
          }

          return acc;
        }, new Map<string, string | null>()),
        ([name, imageUrl]) => ({
          imageUrl,
          name,
        }),
      ),
    ];
  }, [announcements]);

  const filteredAnnouncements =
    selectedClub === "전체"
      ? announcements
      : announcements.filter((item) => item.club_name === selectedClub);

  const pagedAnnouncements = filteredAnnouncements.slice(
    (curPage - 1) * PAGE_SIZE,
    curPage * PAGE_SIZE,
  );

  const emptyStateMessage =
    announcements.length === 0
      ? "공고가 없습니다."
      : "선택한 동아리의 공고가 없습니다.";

  return (
    <main className="mt-10 flex min-h-screen justify-center bg-white">
      <div className="container mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-bold text-3xl text-gray-900">공고 전체 조회</h1>
        </div>

        {errorMessage ? (
          <div className="mb-6 rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-red-700 text-sm">
            {errorMessage}
          </div>
        ) : null}

        {!errorMessage && !showSkeleton && announcements.length > 0 && (
          <AnnouncementClubFilter
            clubOptions={clubOptions}
            selectedClub={selectedClub}
            onSelectClub={(clubName) => {
              setSelectedClub(clubName);
              setCurPage(1);
            }}
          />
        )}

        <div className="mb-10 flex min-h-[660px] flex-wrap gap-7">
          {errorMessage ? null : showSkeleton ? (
            Array.from({ length: PAGE_SIZE }, () => (
              <TeacherAnnouncementSkeletonCard key={crypto.randomUUID()} />
            ))
          ) : filteredAnnouncements.length === 0 ? (
            <div className="flex w-full items-center justify-center py-20">
              <p className="text-gray-400 text-lg">{emptyStateMessage}</p>
            </div>
          ) : (
            pagedAnnouncements.map((announcement) => (
              <AnnouncementItem
                key={announcement.announcement_id}
                {...announcement}
              />
            ))
          )}
        </div>

        {!errorMessage && (
          <Pagination
            listLen={filteredAnnouncements.length}
            limit={PAGE_SIZE}
            curPage={curPage}
            setCurPage={setCurPage}
          />
        )}
      </div>
    </main>
  );
}
