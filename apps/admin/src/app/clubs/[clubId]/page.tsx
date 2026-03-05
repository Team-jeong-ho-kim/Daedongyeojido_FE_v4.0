"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ApiError, clearTokens, getAccessToken, getSessionUser } from "utils";
import { getClubAnnouncements } from "@/api/announcement";
import { getClubDetail } from "@/api/club";
import CTASection from "@/components/club/item/CTASection";
import JobPostingItem from "@/components/club/item/JobPostingItem";
import ClubHeader from "@/components/common/ClubHeader";
import Pagination from "@/components/common/Pagination";
import type { AdminClubAnnouncement, ClubDetailResponse } from "@/types/admin";

const toErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof ApiError) return error.description;
  return fallback;
};

const moveToWebLogin = () => {
  const webUrl = (process.env.NEXT_PUBLIC_WEB_URL || "http://localhost:3000")
    .trim()
    .replace(/\/$/, "");
  window.location.href = `${webUrl}/login`;
};

type DetailTab = "intro" | "history";

export default function AdminClubDetailPage() {
  const router = useRouter();
  const params = useParams<{ clubId: string }>();
  const clubId = useMemo(() => {
    if (!params?.clubId) return "";
    return Array.isArray(params.clubId) ? params.clubId[0] : params.clubId;
  }, [params]);

  const [booting, setBooting] = useState(true);
  const [loading, setLoading] = useState(false);
  const [clubDetail, setClubDetail] = useState<ClubDetailResponse | null>(null);
  const [clubAnnouncements, setClubAnnouncements] = useState<
    AdminClubAnnouncement[]
  >([]);
  const [activeTab, setActiveTab] = useState<DetailTab>("intro");
  const [postingPage, setPostingPage] = useState(1);

  useEffect(() => {
    let cancelled = false;

    const bootstrap = async () => {
      if (!clubId) {
        toast.error("잘못된 동아리 ID입니다.");
        setBooting(false);
        return;
      }

      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();
      if (!accessToken || !sessionUser || sessionUser.role !== "ADMIN") {
        clearTokens();
        moveToWebLogin();
        if (!cancelled) setBooting(false);
        return;
      }

      try {
        setLoading(true);
        const [detail, announcements] = await Promise.all([
          getClubDetail(clubId),
          getClubAnnouncements(clubId),
        ]);

        if (cancelled) return;
        setClubDetail(detail);
        setClubAnnouncements(
          [...announcements].sort(
            (a, b) => b.announcementId - a.announcementId,
          ),
        );
      } catch (error) {
        toast.error(
          toErrorMessage(error, "동아리 상세 정보를 불러오지 못했습니다."),
        );
        if (!cancelled) {
          setClubDetail(null);
          setClubAnnouncements([]);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
          setBooting(false);
        }
      }
    };

    bootstrap();

    return () => {
      cancelled = true;
    };
  }, [clubId]);

  const postingLimit = 5;
  const jobPostings = clubAnnouncements.map((announcement) => {
    const dateString =
      typeof announcement.deadline === "string"
        ? announcement.deadline
        : `${announcement.deadline[0]}-${String(announcement.deadline[1]).padStart(2, "0")}-${String(announcement.deadline[2]).padStart(2, "0")}`;
    const deadlineDate = new Date(dateString);
    const today = new Date();

    let status: "준비중" | "진행중" | "종료됨";
    if (announcement.status === "CLOSED") {
      status = "준비중";
    } else {
      status = deadlineDate < today ? "종료됨" : "진행중";
    }

    return {
      id: announcement.announcementId,
      status,
      title: announcement.title,
      date: dateString,
    };
  });

  const pagedPostings = jobPostings.slice(
    (postingPage - 1) * postingLimit,
    postingPage * postingLimit,
  );

  if (booting) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-sm">
          동아리 상세 정보를 확인하고 있습니다...
        </p>
      </main>
    );
  }

  if (!clubDetail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-500 text-sm">상세 정보를 찾을 수 없습니다.</p>
          <Link
            href="/clubs"
            className="mt-3 inline-block rounded-lg border border-gray-200 px-3 py-2 text-gray-700 text-xs hover:bg-gray-50"
          >
            동아리 목록으로 돌아가기
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <ClubHeader
        clubImage={clubDetail.club.clubImage}
        clubName={clubDetail.club.clubName}
        title={clubDetail.club.clubName}
        oneLiner={clubDetail.club.oneLiner}
        buttonText="공고 보러가기"
        onButtonClick={() => router.push("/announcements")}
      />

      <div className="px-6 md:px-12 lg:px-24">
        <nav className="flex">
          <button
            type="button"
            onClick={() => setActiveTab("intro")}
            className={`flex-1 pt-4 pb-3 text-[14px] md:pt-5 md:pb-4 md:text-[15px] lg:pt-6 ${
              activeTab === "intro"
                ? "border-gray-900 border-b-2 font-semibold text-gray-900"
                : "text-gray-400"
            }`}
          >
            소개
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex-1 pt-4 pb-3 text-[14px] md:pt-5 md:pb-4 md:text-[15px] lg:pt-6 ${
              activeTab === "history"
                ? "border-gray-900 border-b-2 font-semibold text-gray-900"
                : "text-gray-400"
            }`}
          >
            공고
          </button>
        </nav>
      </div>

      {activeTab === "intro" && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          <section className="rounded-2xl bg-white p-6">
            <h2 className="mb-2 font-semibold text-gray-900 text-lg">
              동아리 소개
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {clubDetail.club.introduction || "동아리 소개가 없습니다."}
            </p>
            <p className="mt-3 text-gray-500 text-xs">
              전공: {clubDetail.club.majors.join(", ") || "-"}
            </p>
          </section>

          <section className="mt-6 rounded-2xl bg-white p-6">
            <h2 className="mb-4 font-semibold text-gray-900 text-lg">
              동아리원
            </h2>
            {clubDetail.clubMembers.length === 0 ? (
              <p className="text-gray-500 text-sm">동아리원이 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {clubDetail.clubMembers.map((member) => (
                  <li
                    key={member.userId}
                    className="rounded-xl border border-gray-200 px-4 py-3"
                  >
                    <p className="font-medium text-gray-900 text-sm">
                      {member.userName}
                    </p>
                    <p className="text-gray-500 text-xs">
                      ID: {member.userId} · {member.majors.join(", ") || "-"}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      {activeTab === "history" && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          {loading ? (
            <div className="flex min-h-[400px] items-center justify-center text-center text-[14px] text-gray-400 md:min-h-[460px] md:text-[15px]">
              불러오는 중...
            </div>
          ) : jobPostings.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center text-center text-[14px] text-gray-400 md:min-h-[460px] md:text-[15px]">
              공고 이력이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex min-h-[400px] flex-col gap-3 md:min-h-[460px] md:gap-4">
                {pagedPostings.map((posting) => (
                  <JobPostingItem
                    key={posting.id}
                    status={posting.status}
                    title={posting.title}
                    date={posting.date}
                    onClick={() => router.push("/announcements")}
                  />
                ))}
              </div>
              {jobPostings.length > postingLimit && (
                <Pagination
                  listLen={jobPostings.length}
                  limit={postingLimit}
                  curPage={postingPage}
                  setCurPage={setPostingPage}
                />
              )}
            </div>
          )}
        </div>
      )}

      <div className="mt-20 mb-24">
        <CTASection
          title="이 동아리가 마음에 든다면?"
          subtitle="동아리 가입 신청을 위해 아래 버튼을 눌러주세요!"
          description="아래 버튼을 눌러 지원해보세요!"
          buttonText="이 동아리의 공고로 바로가기"
          buttonHref="/announcements"
        />
      </div>
    </main>
  );
}
