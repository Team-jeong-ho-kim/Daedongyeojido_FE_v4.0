"use client";

import Image from "next/image";
import { use, useState } from "react";
import { CalendarIcon, CheckIcon, InterviewIcon, NoteIcon } from "ui";

interface AnnouncementDetailPageProps {
  params: Promise<{ announcementId: string }>;
}

// mock data
const mockAnnouncement = {
  title: "떡넷 - 신입생 모집 안하고 2학년 모집",
  clubType: "전공동아리",
  clubName: "떡넷",
  clubImage: "/logo.png",
  oneLiner: "대마고의 모든 정보를 한눈에",
  majors: ["Frontend", "Backend", "Design", "iOS"],
  introduction:
    "대덕소프트웨어마이스터고 전공 동아리입니다. 학교의 모든 정보를 한눈에 볼 수 있도록 서비스를 개발합니다.",
  applicationDeadline: "12월 14일 (일) ~ 12월 25일 (목) 오후 9시 까지",
  interviewFormat: [
    "1. 인사성이 바르면 좋겠음.",
    "2. 열심히 하는 면접이 좋음.",
    "3. 알잘딱",
  ],
  interviewSteps: [
    { id: 1, name: "지원서 접수", completed: false },
    { id: 2, name: "과제 제출", completed: false },
    { id: 3, name: "서류 합격 발표", completed: true },
    { id: 4, name: "면접 일정 조율", completed: false },
    { id: 5, name: "실습 면접", completed: false },
    { id: 6, name: "최종 합격 발표", completed: true },
  ],
  tasks: ["1. 노션에 정리하실", "2. 이거 해왔으면 내라", "3. 알잘딱"],
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
  const { announcementId: _announcementId } = use(params);
  const [activeTab, setActiveTab] = useState<"details" | "apply">("details");

  const announcement = mockAnnouncement;

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-start px-6 pt-8 pb-6 md:px-12 md:pt-10 lg:px-24 lg:pt-12 lg:pb-8">
        <div className="flex items-start gap-4 md:gap-6 lg:gap-8">
          <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[16px] bg-blue-600 md:h-[88px] md:w-[88px] md:rounded-[18px] lg:h-[104px] lg:w-[104px] lg:rounded-[20px]">
            <Image
              src={announcement.clubImage}
              alt={announcement.clubName}
              width={104}
              height={104}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-1 pt-2 md:pt-3">
            <h1 className="font-semibold text-[22px] text-gray-900 md:text-[25px] lg:text-[28px]">
              {announcement.title}
            </h1>
            <p className="text-[13px] text-gray-400 md:text-[14px] lg:text-[15px]">
              {announcement.clubType}
            </p>
          </div>
        </div>
      </div>

      {/* 한 줄 소개 */}
      <div className="flex flex-col items-center gap-4 px-6 py-6 md:flex-row md:justify-center md:gap-6 md:px-12 md:py-8 lg:gap-8 lg:px-24 lg:py-10">
        <div className="flex w-full max-w-[1200px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 md:rounded-3xl md:px-7 md:py-3.5 lg:px-9">
          <p className="text-center text-[13px] text-gray-600 md:text-[14px] lg:text-[15px]">
            " {announcement.oneLiner} "
          </p>
        </div>
        <button
          type="button"
          className="w-full flex-shrink-0 cursor-pointer rounded-[10px] bg-[#FF6B6B] px-8 py-3 font-medium text-[14px] text-white hover:bg-[#FF5252] md:w-auto md:px-12 md:py-3.5 md:text-[15px] lg:px-20"
        >
          동아리 소개 보러가기
        </button>
      </div>

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
              {announcement.clubName}
            </p>
          </section>

          {/* 모집 전공 */}
          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              모집 전공
            </h2>
            <div className="flex flex-wrap gap-2">
              {announcement.majors.map((major) => (
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
              {announcement.applicationDeadline}
            </p>
          </section>

          {/* 인재상 */}
          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              인재상
            </h2>
            <div className="flex flex-col gap-1">
              {announcement.interviewFormat.map((item) => (
                <p
                  key={item}
                  className="text-[14px] text-gray-700 md:text-[15px]"
                >
                  {item}
                </p>
              ))}
            </div>
          </section>

          {/* 면접 절차 */}
          <section className="flex flex-col gap-4 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
              면접 절차
            </h2>
            <div className="grid grid-cols-3 gap-4 md:grid-cols-6 md:gap-6">
              {announcement.interviewSteps.map((step) => (
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
            <div className="flex flex-col gap-1">
              {announcement.tasks.map((task) => (
                <p
                  key={task}
                  className="text-[14px] text-gray-700 md:text-[15px]"
                >
                  {task}
                </p>
              ))}
            </div>
          </section>

          {/* 지원서 작성하기 버튼 */}
          <div className="flex justify-center pt-4">
            <button
              type="button"
              className="w-full max-w-md cursor-pointer rounded-lg bg-primary-500 py-3 font-medium text-[15px] text-white contain-paint hover:bg-primary-400 md:text-[16px]"
            >
              지원서 작성하기
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
