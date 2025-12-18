"use client";

import Image from "next/image";
import { use, useState } from "react";
import CTASection from "@/components/CTASection";
import JobPostingItem from "@/components/JobPostingItem";
import MemberItem from "@/components/MemberItem";
import Pagination from "@/components/Pagination";
import type { ClubDetail, ClubMember, JobPosting } from "@/types";

interface ClubDetailPageProps {
  params: Promise<{ clubId: string }>;
}

// mock data
const mockClub: ClubDetail = {
  clubName: "대동여지도",
  oneLiner: "혼자가기 싫어요... 같이 가요, 레~츠고",
  introduction:
    "대덕소프트웨어마이스터고 전공 동아리입니다. 학교의 모든 정보를 한눈에 볼 수 있도록 서비스를 개발합니다.",
  clubImage: "/logo.png",
  majors: ["BE", "FE"],
  links: ["https://github.com/example", "https://example.com"],
};

const mockClubMembers: ClubMember[] = [
  {
    userName: "김경민",
    majors: ["BE", "FE"],
    introduce:
      "김경민입니다.ㅁㄴㅇㄹㄴㅁㄹㄴㅁㄹㅁㄴㅁㄴㄹㅁㄴㄴㅇㄹㅁㄴㅇㄹㄴㅁㅇㄹㅁㄴㅇㄹㄴㅁㅇㄹ",
  },
  { userName: "지도현", majors: ["BE"], introduce: "지도현입니다." },
  { userName: "박민수", majors: ["FE"], introduce: "박민수입니다." },
  { userName: "이준호", majors: ["BE"], introduce: "이준호입니다." },
  { userName: "최유진", majors: ["FE"], introduce: "최유진입니다." },
  { userName: "정수빈", majors: ["BE"], introduce: "정수빈입니다." },
  { userName: "한지민", majors: ["FE"], introduce: "한지민입니다." },
  { userName: "김도윤", majors: ["BE"], introduce: "김도윤입니다." },
  { userName: "윤서연", majors: ["FE"], introduce: "윤서연입니다." },
];

const mockJobPostings: JobPosting[] = [
  { status: "진행중", title: "2025년 상반기 신입 모집", date: "2025.03.01" },
  { status: "종료됨", title: "iOS 추가 모집합니다", date: "2025.12.24" },
  { status: "종료됨", title: "백엔드 개발자 모집", date: "2025.11.15" },
  { status: "종료됨", title: "프론트엔드 개발자 모집", date: "2025.10.20" },
  { status: "종료됨", title: "디자이너 모집", date: "2025.09.10" },
  { status: "종료됨", title: "PM 모집", date: "2025.08.05" },
];

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { clubId: _clubId } = use(params);

  const [activeTab, setActiveTab] = useState<"intro" | "history">("intro");
  const [memberPage, setMemberPage] = useState(1);
  const [postingPage, setPostingPage] = useState(1);

  const memberLimit = 8;
  const postingLimit = 5;

  const club = mockClub;
  const clubMembers = mockClubMembers;
  const jobPostings = mockJobPostings;

  const pagedMembers = clubMembers.slice(
    (memberPage - 1) * memberLimit,
    memberPage * memberLimit,
  );

  const pagedPostings = jobPostings.slice(
    (postingPage - 1) * postingLimit,
    postingPage * postingLimit,
  );

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <div className="flex items-start px-6 pt-8 pb-6 md:px-12 md:pt-10 lg:px-24 lg:pt-12 lg:pb-8">
        <div className="flex items-start gap-4 md:gap-6 lg:gap-8">
          <div className="h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[16px] bg-blue-600 md:h-[88px] md:w-[88px] md:rounded-[18px] lg:h-[104px] lg:w-[104px] lg:rounded-[20px]">
            <Image
              src={club.clubImage}
              alt={club.clubName}
              width={104}
              height={104}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex flex-col gap-1 pt-2 md:pt-3">
            <h1 className="font-semibold text-[22px] text-gray-900 md:text-[25px] lg:text-[28px]">
              {club.clubName}
            </h1>
            <p className="text-[13px] text-gray-400 md:text-[14px] lg:text-[15px]">
              전공동아리
            </p>
          </div>
        </div>
      </div>

      {/* 한 줄 소개 */}
      <div className="flex flex-col items-center gap-4 px-6 py-6 md:flex-row md:justify-center md:gap-6 md:px-12 md:py-8 lg:gap-8 lg:px-24 lg:py-10">
        <div className="flex w-full max-w-[1200px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 md:rounded-3xl md:px-7 md:py-3.5 lg:px-9">
          <p className="text-center text-[13px] text-gray-600 md:text-[14px] lg:text-[15px]">
            " {club.oneLiner} "
          </p>
        </div>
        <button
          type="button"
          className="w-full flex-shrink-0 cursor-pointer rounded-[10px] bg-[#FF6B6B] px-8 py-3 font-medium text-[14px] text-white hover:bg-[#FF5252] md:w-auto md:px-12 md:py-3.5 md:text-[15px] lg:px-20"
        >
          공고 보러가기
        </button>
      </div>

      {/* 탭 */}
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
            공고 이력
          </button>
        </nav>
      </div>

      {activeTab === "intro" ? (
        <>
          {/* 회색 배경 영역 */}
          <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
            <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
              <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                  동아리명
                </h2>
                <p className="text-[14px] text-gray-700 md:text-[15px]">
                  {club.clubName}
                </p>
              </section>

              <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                  동아리 전공
                </h2>
                <div className="flex gap-2">
                  {club.majors.map((major) => (
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
                  {club.introduction}
                </p>
              </section>

              <section className="flex flex-col gap-2 md:flex-row md:gap-0">
                <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                  동아리 관련 링크
                </h2>
                <div className="flex flex-col gap-1">
                  {club.links.map((link) => (
                    <a
                      key={link}
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="truncate text-[14px] text-gray-500 underline md:text-[15px]"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </section>

              <section className="flex flex-col gap-4 md:flex-row md:gap-0">
                <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                  동아리 팀원
                </h2>

                <div className="flex flex-col gap-6 md:gap-8">
                  <div className="grid min-h-[590px] grid-cols-4 content-start items-start gap-5">
                    {pagedMembers.map((member) => (
                      <MemberItem
                        key={`${member.userName}-${member.introduce}`}
                        {...member}
                      />
                    ))}
                  </div>

                  {clubMembers.length > memberLimit && (
                    <Pagination
                      listLen={clubMembers.length}
                      limit={memberLimit}
                      curPage={memberPage}
                      setCurPage={setMemberPage}
                    />
                  )}
                </div>
              </section>
            </div>
          </div>
        </>
      ) : (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          {jobPostings.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              공고 이력이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex min-h-[400px] flex-col gap-3 md:min-h-[460px] md:gap-4">
                {pagedPostings.map((posting, index) => (
                  <JobPostingItem
                    key={`${posting.title}-${posting.date}-${index}`}
                    status={posting.status}
                    title={posting.title}
                    date={posting.date}
                    onClick={() => {
                      console.log("공고 클릭:", posting.title);
                    }}
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

      {/* CTA */}
      <CTASection
        title="이 동아리가 마음에 든다면?"
        subtitle="동아리 가입 신청을 위해 아래 버튼을 눌러주세요!"
        description="아래 버튼을 눌러 지원해보세요!"
        buttonText="이 동아리의 공고로 바로가기"
      />
    </main>
  );
}
