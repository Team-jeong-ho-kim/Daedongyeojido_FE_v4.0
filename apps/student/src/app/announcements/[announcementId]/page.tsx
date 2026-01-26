"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useUserStore } from "shared";
import { toast } from "sonner";
import { CalendarIcon, CheckIcon, InterviewIcon, NoteIcon } from "ui";
import {
  ApplicantCard,
  ApplicationConfirmModal,
  ClubHeader,
  Pagination,
} from "@/components";
import { MOCK_APPLICANTS } from "@/constants/clubDetailMock";
import { useDeleteAnnouncementMutation } from "@/hooks/mutations/useAnnouncement";
import { useGetDetailAnnounceQuery } from "@/hooks/querys/useAnnouncementQuery";
import { useGetDetailClubQuery } from "@/hooks/querys/useClubQuery";

interface AnnouncementDetailPageProps {
  params: Promise<{ announcementId: string }>;
}

// 면접 절차
const interviewSteps = [
  { id: 1, name: "지원서 접수" },
  { id: 2, name: "과제 제출" },
  { id: 3, name: "서류 합격 발표" },
  { id: 4, name: "면접 일정 조율" },
  { id: 5, name: "실습 면접" },
  { id: 6, name: "최종 합격 발표" },
];

// localStorage 키 생성 함수
const getTempSaveKey = (announcementId: string) => `tempSave_${announcementId}`;

const getStepIcon = (stepName: string) => {
  const iconColor = "text-[#FF6B6B]";

  if (stepName.includes("지원서") || stepName.includes("과제")) {
    return <NoteIcon className={iconColor} />;
  }
  if (stepName.includes("합격") || stepName.includes("발표")) {
    return <CheckIcon className={iconColor} />;
  }
  if (stepName.includes("일정") || stepName.includes("조율")) {
    return <CalendarIcon className={iconColor} />;
  }
  if (stepName.includes("면접")) {
    return <InterviewIcon className={iconColor} />;
  }
  return <NoteIcon className={iconColor} />;
};

export default function AnnouncementDetailPage({
  params,
}: AnnouncementDetailPageProps) {
  const { announcementId } = use(params);
  const { data: announcementData } = useGetDetailAnnounceQuery(announcementId);
  const { mutate: deleteAnnouncementMutate } = useDeleteAnnouncementMutation();

  const clubId = announcementData?.clubId?.toString() || "";
  const { data: clubData } = useGetDetailClubQuery(clubId);

  const [activeTab, setActiveTab] = useState<"details" | "applications">(
    "details",
  );
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [applicationPage, setApplicationPage] = useState(1);

  const role = useUserStore((state) => state.userInfo?.role);
  const isClubMember = role === "CLUB_MEMBER" || role === "CLUB_LEADER";

  const announcement = announcementData;

  // 공고 삭제 핸들러
  const handleDeleteAnnouncement = () => {
    deleteAnnouncementMutate(announcementId);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const tempSaveKey = getTempSaveKey(announcementId);
      const hasTempSave = localStorage.getItem(tempSaveKey);

      if (hasTempSave) {
        toast.success("임시저장이 완료되었습니다.");
        localStorage.removeItem(tempSaveKey);
      }
    } catch (error) {
      console.error("localStorage 접근 실패:", error);
    }
  }, [announcementId]);

  if (!announcement || !clubData) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">공고 정보를 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ClubHeader
        clubImage={clubData.club.clubImage}
        clubName={clubData.club.clubName}
        title={`${clubData.club.clubName} - ${announcement.title}`}
        oneLiner={clubData.club.oneLiner}
        buttonText="동아리 소개 보러가기"
      />

      {/* 탭 */}
      <div className="px-6 md:px-12 lg:px-24">
        <nav className="flex border-gray-200 border-b">
          <button
            type="button"
            onClick={() => setActiveTab("details")}
            className={`flex-1 px-4 py-4 text-[14px] md:text-[15px] ${
              activeTab === "details"
                ? "border-gray-800 border-b-2 font-semibold text-gray-800"
                : "text-gray-400"
            }`}
          >
            공고 내용
          </button>
          {isClubMember && (
            <button
              type="button"
              onClick={() => setActiveTab("applications")}
              className={`flex-1 px-4 py-4 text-[14px] md:text-[15px] ${
                activeTab === "applications"
                  ? "border-gray-800 border-b-2 font-semibold text-gray-800"
                  : "text-gray-400"
              }`}
            >
              지원내역
            </button>
          )}
        </nav>
      </div>

      {/* 공고 내용 탭 */}
      {activeTab === "details" && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
            {/* 공고 제목 */}
            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                공고 제목
              </h2>
              <p className="text-[14px] text-gray-700 md:text-[15px]">
                {announcement.title}
              </p>
            </section>

            {/* 동아리명 */}
            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리명
              </h2>
              <p className="text-[14px] text-gray-700 md:text-[15px]">
                {clubData.club.clubName}
              </p>
            </section>

            {/* 모집 전공 */}
            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                모집 전공
              </h2>
              <div className="flex flex-wrap gap-2">
                {[...new Set(announcement.major)].map((major) => (
                  <span
                    key={major}
                    className="rounded-full border border-red-300 px-3 py-1 text-[12px] text-red-500 md:text-[13px]"
                  >
                    {major}
                  </span>
                ))}
              </div>
            </section>

            {/* 동아리 소개 */}
            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 소개
              </h2>
              <p className="max-w-[700px] text-[14px] text-gray-700 md:text-[15px]">
                {announcement.introduction}
              </p>
            </section>

            {/* 지원 마감일 */}
            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                지원 마감일
              </h2>
              <p className="text-[14px] text-gray-700 md:text-[15px]">
                {announcement.deadline}
              </p>
            </section>

            {/* 인재상 */}
            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                인재상
              </h2>
              <p className="text-[14px] text-gray-700 md:text-[15px]">
                {announcement.talentDescription}
              </p>
            </section>

            {/* 면접 절차 */}
            <section className="flex flex-col gap-4 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                면접 절차
              </h2>
              <div className="grid grid-cols-3 gap-4 md:grid-cols-6 md:gap-6">
                {interviewSteps.map((step) => (
                  <div
                    key={step.id}
                    className="flex flex-col items-center gap-3 rounded-lg border border-gray-200 bg-white px-12 py-5"
                  >
                    <div className="flex items-center justify-center">
                      {getStepIcon(step.name)}
                    </div>
                    <p className="whitespace-nowrap text-center text-[12px] text-gray-900 md:text-[13px]">
                      {step.name}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* 과제 */}
            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                과제
              </h2>
              <p className="text-[14px] text-gray-700 md:text-[15px]">
                {announcement.assignment}
              </p>
            </section>

            {isClubMember && activeTab === "details" && (
              <div className="flex justify-end pt-6">
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="rounded-md bg-gray-500 px-4 py-2 font-medium text-[12px] text-white hover:bg-gray-600"
                >
                  공고 삭제하기
                </button>
              </div>
            )}

            {/* 지원서 작성하기 버튼 */}
            {!isClubMember && (
              <div className="flex justify-center pt-4">
                <Link
                  href={`/announcements/${announcementId}/apply`}
                  className="w-full max-w-md cursor-pointer rounded-lg bg-primary-500 py-3 text-center font-medium text-[15px] text-white contain-paint hover:bg-primary-400 md:text-[16px]"
                >
                  지원서 작성하기
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 지원내역 탭 */}
      {activeTab === "applications" && isClubMember && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          {MOCK_APPLICANTS.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              지원내역이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-4">
                {MOCK_APPLICANTS.slice(
                  (applicationPage - 1) * 5,
                  applicationPage * 5,
                ).map((applicant) => (
                  <ApplicantCard
                    key={applicant.studentId}
                    applicant={applicant}
                    onClick={() =>
                      console.log("지원내역 조회:", applicant.name)
                    }
                  />
                ))}
              </div>
              {MOCK_APPLICANTS.length > 5 && (
                <Pagination
                  listLen={MOCK_APPLICANTS.length}
                  limit={5}
                  curPage={applicationPage}
                  setCurPage={setApplicationPage}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* 공고 삭제 확인 모달 */}
      <ApplicationConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAnnouncement}
        onBackdropClick={() => setShowDeleteModal(false)}
        title="정말 공고를 삭제하시겠습니까?"
        description="이 작업은 되돌릴 수 없습니다."
        cancelText="취소"
        confirmText="삭제"
      />
    </main>
  );
}
