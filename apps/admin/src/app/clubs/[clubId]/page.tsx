"use client";

export const runtime = "edge";

import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import JobPostingItem from "@/components/club/item/JobPostingItem";
import MemberItem from "@/components/club/item/MemberItem";
import ClubHeader from "@/components/common/ClubHeader";
import Pagination from "@/components/common/Pagination";
import {
  useGetClubAnnouncementsQuery,
  useGetClubDetailQuery,
} from "@/hooks/querys";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryErrorToast } from "@/hooks/useQueryErrorToast";

type DetailTab = "intro" | "history";

export default function AdminClubDetailPage() {
  const router = useRouter();
  const params = useParams<{ clubId: string }>();
  const clubId = useMemo(() => {
    if (!params?.clubId) return "";
    return Array.isArray(params.clubId) ? params.clubId[0] : params.clubId;
  }, [params]);

  const [activeTab, setActiveTab] = useState<DetailTab>("intro");
  const [postingPage, setPostingPage] = useState(1);
  const [memberPage, setMemberPage] = useState(1);
  const { isAuthorized, isBooting } = useAdminAuth();
  const clubDetailQuery = useGetClubDetailQuery(clubId, isAuthorized);
  const clubAnnouncementsQuery = useGetClubAnnouncementsQuery(
    clubId,
    isAuthorized && activeTab === "history",
  );
  const clubDetail = clubDetailQuery.data ?? null;
  const clubAnnouncements = clubAnnouncementsQuery.data ?? [];
  useQueryErrorToast(
    clubDetailQuery.error,
    "동아리 상세 정보를 불러오지 못했습니다.",
  );
  useQueryErrorToast(
    clubAnnouncementsQuery.error,
    "동아리 공고 목록을 불러오지 못했습니다.",
  );

  const postingLimit = 5;
  const memberLimit = 8;
  const uniqueLinks = clubDetail ? [...new Set(clubDetail.club.links)] : [];
  const memberNames = clubDetail?.clubMembers ?? [];

  const jobPostings = clubAnnouncements
    .filter((announcement) => announcement.status === "OPEN")
    .map((announcement) => {
      const dateString =
        typeof announcement.deadline === "string"
          ? announcement.deadline
          : `${announcement.deadline[0]}-${String(announcement.deadline[1]).padStart(2, "0")}-${String(announcement.deadline[2]).padStart(2, "0")}`;
      const deadlineDate = new Date(dateString);
      const today = new Date();

      return {
        id: announcement.announcementId,
        status:
          deadlineDate < today ? ("종료됨" as const) : ("진행중" as const),
        title: announcement.title,
        date: dateString,
      };
    });

  const pagedPostings = jobPostings.slice(
    (postingPage - 1) * postingLimit,
    postingPage * postingLimit,
  );
  const pagedMembers = (clubDetail?.clubMembers ?? []).slice(
    (memberPage - 1) * memberLimit,
    memberPage * memberLimit,
  );

  if (!clubId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">잘못된 동아리 ID입니다.</p>
      </main>
    );
  }

  if (
    isBooting ||
    (isAuthorized &&
      (clubDetailQuery.isLoading || clubAnnouncementsQuery.isLoading))
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">동아리 정보를 불러오는 중...</p>
      </main>
    );
  }

  if (!clubDetail) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">동아리 정보를 찾을 수 없습니다.</p>
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
        metaText={`동아리 ID: ${clubId}`}
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
          <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 이미지
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200 bg-gray-100">
                  {clubDetail.club.clubImage ? (
                    <img
                      src={clubDetail.club.clubImage}
                      alt="동아리 이미지"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[12px] text-gray-400">
                      No Image
                    </div>
                  )}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리명
              </h2>
              <div className="flex flex-1 items-center rounded-lg border border-gray-100 bg-white px-4 py-2.5">
                <p className="flex-1 text-[14px] text-gray-700 md:text-[15px]">
                  {clubDetail.club.clubName}
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                한줄 소개
              </h2>
              <div className="flex flex-1 items-center rounded-lg border border-gray-100 bg-white px-4 py-2.5">
                <p className="flex-1 text-[14px] text-gray-700 md:text-[15px]">
                  {clubDetail.club.oneLiner}
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 전공
              </h2>
              <div className="flex flex-wrap gap-2">
                {[...new Set(clubDetail.club.majors)].map((major) => (
                  <span
                    key={major}
                    className="rounded-full border border-primary-300 px-3 py-1 text-[12px] text-primary-500 md:text-[13px]"
                  >
                    {major}
                  </span>
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 소개
              </h2>
              <div className="flex flex-1 items-start rounded-lg border border-gray-100 bg-white p-4">
                <p className="flex-1 text-[14px] text-gray-700 md:text-[15px]">
                  {clubDetail.club.introduction}
                </p>
              </div>
            </section>

            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 관련 링크
              </h2>
              <div className="flex flex-1 items-start rounded-lg border border-gray-100 bg-white p-4">
                <div className="flex flex-1 flex-col gap-1">
                  {uniqueLinks.length === 0 ? (
                    <p className="text-[14px] text-gray-400 md:text-[15px]">
                      등록된 링크가 없습니다.
                    </p>
                  ) : (
                    uniqueLinks.map((link) => (
                      <a
                        key={link}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate text-[14px] text-gray-500 underline md:text-[15px]"
                      >
                        {link}
                      </a>
                    ))
                  )}
                </div>
              </div>
            </section>

            <section className="flex flex-col gap-4 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 팀원
              </h2>

              <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex flex-wrap gap-2">
                  {memberNames.map((member, index) => (
                    <span
                      key={`name-${member.userId}`}
                      className="text-[14px] text-gray-700 md:text-[15px]"
                    >
                      {member.userName}
                      {index < memberNames.length - 1 && ","}
                    </span>
                  ))}
                </div>

                <div className="grid min-h-[590px] grid-cols-2 content-start items-start gap-5 md:grid-cols-3 lg:grid-cols-4">
                  {pagedMembers.map((member) => (
                    <MemberItem
                      key={`${member.userId}-${member.userName}`}
                      userName={member.userName}
                      majors={member.majors}
                      introduction={member.introduction}
                      profileImage={member.profileImage}
                    />
                  ))}
                </div>

                {clubDetail.clubMembers.length > memberLimit && (
                  <Pagination
                    listLen={clubDetail.clubMembers.length}
                    limit={memberLimit}
                    curPage={memberPage}
                    setCurPage={setMemberPage}
                  />
                )}
              </div>
            </section>
          </div>
        </div>
      )}

      {activeTab === "history" && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          {clubAnnouncementsQuery.isFetching ? (
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
                    onClick={() => router.push(`/announcements/${posting.id}`)}
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
    </main>
  );
}
