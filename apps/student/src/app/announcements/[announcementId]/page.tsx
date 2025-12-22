"use client";

import Link from "next/link";
import { use, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { CalendarIcon, CheckIcon, InterviewIcon, NoteIcon } from "ui";
import { ClubHeader } from "@/components";
import type { AnnouncementDetailResponse } from "@/types/announcement";

interface AnnouncementDetailPageProps {
  params: Promise<{ announcementId: string }>;
}

// 동아리 정보 (전체조회에서 props로 받아올 예정)
const mockClubInfo = {
  clubType: "전공동아리",
  clubName: "떡넷",
  clubImage: "/logo.png",
  oneLiner: "대마고의 모든 정보를 한눈에",
};

// 면접 절차 (정적 데이터)
const interviewSteps = [
  { id: 1, name: "지원서 접수" },
  { id: 2, name: "과제 제출" },
  { id: 3, name: "서류 합격 발표" },
  { id: 4, name: "면접 일정 조율" },
  { id: 5, name: "실습 면접" },
  { id: 6, name: "최종 합격 발표" },
];

// mock data (서버 응답 형식)
const mockAnnouncement: AnnouncementDetailResponse = {
  title: "대동여지도 동아리 신입모집",
  major: ["BE", "FE"],
  phoneNumber: "대표자 연락처",
  deadline: "2025-12-01",
  introduction: "AI에 관심 있는 학우들의 많은 지원 바랍니다.",
  talent_description: "머신러닝 기초지식, 학습 열정",
  assignment: "TensorFlow 혹은 PyTorch 사용 프로젝트 제출",
};

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
  const [activeTab, setActiveTab] = useState<"details" | "apply">("details");

  const announcement = mockAnnouncement;

  // 임시저장 성공 토스트
  useEffect(() => {
    if (localStorage.getItem("tempSaveSuccess")) {
      toast.success("임시저장이 완료되었습니다.");
      localStorage.removeItem("tempSaveSuccess");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ClubHeader
        clubImage={mockClubInfo.clubImage}
        clubName={mockClubInfo.clubName}
        title={`${mockClubInfo.clubName} - ${announcement.title}`}
        subtitle={mockClubInfo.clubType}
        oneLiner={mockClubInfo.oneLiner}
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
        </nav>
      </div>

      {/* 공고 내용 */}
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
              {mockClubInfo.clubName}
            </p>
          </section>

          {/* 모집 전공 */}
          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              모집 전공
            </h2>
            <div className="flex flex-wrap gap-2">
              {announcement.major.map((major) => (
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
              {announcement.talent_description}
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

          {/* 지원서 작성하기 버튼 */}
          <div className="flex justify-center pt-4">
            <Link
              href={`/announcements/${announcementId}/apply`}
              className="w-full max-w-md cursor-pointer rounded-lg bg-primary-500 py-3 text-center font-medium text-[15px] text-white contain-paint hover:bg-primary-400 md:text-[16px]"
            >
              지원서 작성하기
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
