"use client";

export const runtime = "edge";

import { useParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import { toast } from "sonner";
import { ClubHeader } from "@/components/common";
import {
  useGetAnnouncementDetailQuery,
  useGetClubDetailQuery,
} from "@/hooks/querys";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useQueryErrorToast } from "@/hooks/useQueryErrorToast";

const iconClassName = "h-6 w-6 text-[#FF6B6B]";

const NoteStepIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={iconClassName}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M8 3h6l5 5v11a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M14 3v5h5M9 13h6M9 17h4"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckStepIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={iconClassName}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M9 12.75 11.25 15 15.75 9.75"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
  </svg>
);

const CalendarStepIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={iconClassName}
    aria-hidden="true"
    focusable="false"
  >
    <rect
      x="4"
      y="5"
      width="16"
      height="15"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M8 3v4M16 3v4M4 9h16"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const InterviewStepIcon = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    className={iconClassName}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M8 10a4 4 0 1 1 8 0v1a4 4 0 0 1-8 0v-1Z"
      stroke="currentColor"
      strokeWidth="1.8"
    />
    <path
      d="M12 15v4M9.5 19h5"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <path
      d="M5 10a7 7 0 1 1 14 0"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const interviewSteps = [
  { id: 1, name: "지원서 접수" },
  { id: 2, name: "과제 제출" },
  { id: 3, name: "서류 합격 발표" },
  { id: 4, name: "면접 일정 조율" },
  { id: 5, name: "실습 면접" },
  { id: 6, name: "최종 합격 발표" },
];

const formatDeadline = (deadline: string | [number, number, number]) => {
  if (!deadline) return "";

  if (Array.isArray(deadline) && deadline.length === 3) {
    const [year, month, day] = deadline;
    return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  }

  if (typeof deadline === "string") {
    if (/^\d{8}$/.test(deadline)) {
      return `${deadline.slice(0, 4)}-${deadline.slice(4, 6)}-${deadline.slice(6)}`;
    }

    if (deadline.includes(".")) {
      return deadline.split(".").join("-");
    }
  }

  return deadline;
};

const formatPhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) return phoneNumber;
  const digits = phoneNumber.replace(/\D/g, "");

  if (digits.length === 11) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }
  if (digits.length === 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  return phoneNumber;
};

const getStepIcon = (stepName: string) => {
  if (stepName.includes("지원서") || stepName.includes("과제")) {
    return <NoteStepIcon />;
  }
  if (stepName.includes("합격") || stepName.includes("발표")) {
    return <CheckStepIcon />;
  }
  if (stepName.includes("일정") || stepName.includes("조율")) {
    return <CalendarStepIcon />;
  }
  if (stepName.includes("면접")) {
    return <InterviewStepIcon />;
  }
  return <NoteStepIcon />;
};

export default function AdminAnnouncementDetailPage() {
  const router = useRouter();
  const params = useParams<{ announcementId: string }>();
  const announcementId = useMemo(() => {
    if (!params?.announcementId) return "";
    return Array.isArray(params.announcementId)
      ? params.announcementId[0]
      : params.announcementId;
  }, [params]);
  const { isAuthorized, isBooting } = useAdminAuth();
  const announcementDetailQuery = useGetAnnouncementDetailQuery(
    announcementId,
    isAuthorized,
  );
  const announcementDetail = announcementDetailQuery.data ?? null;
  const clubDetailQuery = useGetClubDetailQuery(
    String(announcementDetail?.clubId ?? ""),
    isAuthorized && !!announcementDetail?.clubId,
  );
  const clubDetail = clubDetailQuery.data ?? null;
  useQueryErrorToast(
    announcementDetailQuery.error,
    "공고 상세 정보를 불러오지 못했습니다.",
  );
  useQueryErrorToast(
    clubDetailQuery.error,
    "공고 상세 정보를 불러오지 못했습니다.",
  );

  if (!announcementId) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">잘못된 공고 ID입니다.</p>
      </main>
    );
  }

  if (
    isBooting ||
    (isAuthorized &&
      (announcementDetailQuery.isLoading || clubDetailQuery.isLoading)) ||
    !announcementDetail ||
    !clubDetail
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">공고 정보를 불러오는 중...</p>
      </main>
    );
  }

  const formattedDeadline = formatDeadline(announcementDetail.deadline);
  const formattedPhoneNumber = formatPhoneNumber(
    announcementDetail.phoneNumber,
  );
  const isExpired = formattedDeadline
    ? new Date(formattedDeadline) < new Date()
    : false;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      <ClubHeader
        clubImage={clubDetail.club.clubImage}
        clubName={clubDetail.club.clubName}
        title={`${clubDetail.club.clubName} - ${announcementDetail.title}`}
        oneLiner={clubDetail.club.oneLiner}
        buttonText="동아리 소개 보러가기"
        onButtonClick={() => router.push(`/clubs/${announcementDetail.clubId}`)}
      />

      <div className="px-6 md:px-12 lg:px-24">
        <nav className="flex border-gray-200 border-b">
          <button
            type="button"
            className="flex-1 border-gray-800 border-b-2 px-4 py-4 font-semibold text-[14px] text-gray-800 md:text-[15px]"
          >
            공고 내용
          </button>
        </nav>
      </div>

      <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
        <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              공고 제목
            </h2>
            <p className="text-[14px] text-gray-700 md:text-[15px]">
              {announcementDetail.title}
            </p>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              동아리명
            </h2>
            <p className="text-[14px] text-gray-700 md:text-[15px]">
              {clubDetail.club.clubName}
            </p>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              모집 전공
            </h2>
            <div className="flex flex-wrap gap-2">
              {[...new Set(announcementDetail.major)].map((major) => (
                <span
                  key={major}
                  className="rounded-full border border-red-300 px-3 py-1 text-[12px] text-red-500 md:text-[13px]"
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
            <p className="max-w-[700px] text-[14px] text-gray-700 md:text-[15px]">
              {announcementDetail.introduction}
            </p>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              지원 마감일
            </h2>
            <p className="text-[14px] text-gray-700 md:text-[15px]">
              {formattedDeadline}
            </p>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              인재상
            </h2>
            <p className="text-[14px] text-gray-700 md:text-[15px]">
              {announcementDetail.talentDescription}
            </p>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              과제
            </h2>
            <p className="text-[14px] text-gray-700 md:text-[15px]">
              {announcementDetail.assignment}
            </p>
          </section>

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

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              대표자 연락처
            </h2>
            <p className="text-[14px] text-gray-700 md:text-[15px]">
              {formattedPhoneNumber}
            </p>
          </section>

          <div className="flex justify-center pt-4">
            <button
              type="button"
              onClick={() =>
                toast.warning("어드민에서는 공고 상세 조회만 가능합니다.")
              }
              className={`w-full max-w-md rounded-lg py-3 text-center font-medium text-[15px] text-white contain-paint md:text-[16px] ${
                isExpired
                  ? "cursor-not-allowed bg-gray-400"
                  : "cursor-pointer bg-primary-500 hover:bg-primary-400"
              }`}
            >
              지원서 작성하기{isExpired ? " (종료)" : ""}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
