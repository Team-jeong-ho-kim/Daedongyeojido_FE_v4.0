"use client";

import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "ui";
import type { Application } from "@/components";
import {
  ApplicationCard,
  ApplicationConfirmModal,
  ApplicationForm,
  ClubHeader,
  ClubInfoEditSection,
  ClubMemberSection,
  CTASection,
  JobPostingItem,
  NoticeCard,
  Pagination,
} from "@/components";
import type { ClubDetail, ClubMember, JobPosting, UserRole } from "@/types";

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
  {
    status: "진행중",
    title: "2025년 상반기 신입 모집",
    date: "2025.03.01",
    content:
      "2025년 상반기 신입 부원을 모집합니다. 열정 있는 분들의 많은 지원 바랍니다. 모집 분야: FE, BE, iOS, Android",
  },
  {
    status: "종료됨",
    title: "iOS 추가 모집합니다",
    date: "2025.12.24",
    content:
      "iOS 개발자를 추가 모집합니다. Swift 경험자 우대, 포트폴리오 필수 제출.",
  },
  {
    status: "종료됨",
    title: "백엔드 개발자 모집",
    date: "2025.11.15",
    content:
      "백엔드 개발자를 모집합니다. Spring Boot, Node.js 경험자 환영합니다.",
  },
  {
    status: "종료됨",
    title: "프론트엔드 개발자 모집",
    date: "2025.10.20",
    content:
      "프론트엔드 개발자를 모집합니다. React, Next.js 경험자 우대합니다.",
  },
  {
    status: "종료됨",
    title: "디자이너 모집",
    date: "2025.09.10",
    content: "UI/UX 디자이너를 모집합니다. Figma 사용 가능자 환영합니다.",
  },
  {
    status: "종료됨",
    title: "PM 모집",
    date: "2025.08.05",
    content:
      "프로젝트 매니저를 모집합니다. 일정 관리 및 팀 커뮤니케이션 능력 필수.",
  },
];

interface Notice {
  id: string;
  title: string;
  date: string;
  content: string;
}

const mockNotices: Notice[] = [
  {
    id: "1",
    title: "10월 회식 안합니다.",
    date: "2025.12.24",
    content:
      "어떻게 어떻게 과제를 낸 후 난 잘것이야. 진짜 너무 피곤해 어떻게 어떻게 과제를 낸 후 난 잘것이야.",
  },
  {
    id: "2",
    title: "11월 정기 회의 공지",
    date: "2025.11.15",
    content:
      "11월 정기 회의는 15일 오후 6시에 진행됩니다. 모두 참석 부탁드립니다.",
  },
  {
    id: "3",
    title: "프로젝트 마감일 연장 안내",
    date: "2025.11.10",
    content:
      "프로젝트 마감일이 일주일 연장되었습니다. 새로운 마감일은 11월 20일입니다.",
  },
  {
    id: "4",
    title: "신입 부원 환영회",
    date: "2025.10.28",
    content:
      "신입 부원 환영회가 10월 30일에 진행됩니다. 많은 참여 부탁드립니다.",
  },
  {
    id: "5",
    title: "동아리 방 청소 공지",
    date: "2025.10.20",
    content:
      "이번 주 토요일 동아리 방 청소를 진행합니다. 담당자는 아래와 같습니다.",
  },
  {
    id: "6",
    title: "해커톤 참가 안내",
    date: "2025.10.15",
    content:
      "교내 해커톤에 동아리 팀으로 참가합니다. 참가 희망자는 신청해주세요.",
  },
  {
    id: "7",
    title: "동아리 티셔츠 제작 안내",
    date: "2025.10.10",
    content: "동아리 티셔츠를 제작합니다. 사이즈 신청은 이번 주까지입니다.",
  },
  {
    id: "8",
    title: "9월 정기 회의록",
    date: "2025.09.30",
    content: "9월 정기 회의록을 공유드립니다. 확인 부탁드립니다.",
  },
  {
    id: "9",
    title: "외부 강연 안내",
    date: "2025.09.25",
    content: "외부 개발자 강연이 예정되어 있습니다. 많은 참여 부탁드립니다.",
  },
];

const mockApplications: Application[] = [
  { id: 1, title: "2025년 상반기 신입 모집 지원서", deadline: "2025.03.15" },
  { id: 2, title: "iOS 개발자 추가 모집 지원서", deadline: "2025.12.31" },
  { id: 3, title: "백엔드 개발자 모집 지원서", deadline: "2025.11.30" },
  { id: 4, title: "프론트엔드 개발자 모집 지원서", deadline: "2025.10.25" },
];

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { clubId: _clubId } = use(params);

  // TODO: 서버에서 권한 가져오기
  const role = "CLUB_MEMBER" as UserRole;

  const isClubMember = role === "CLUB_MEMBER" || role === "CLUB_LEADER";
  const isLeader = role === "CLUB_LEADER";

  const [activeTab, setActiveTab] = useState<
    "intro" | "history" | "notification" | "application"
  >("intro");
  const [historySubTab, setHistorySubTab] = useState<"posting" | "form">(
    "posting",
  );
  const [postingPage, setPostingPage] = useState(1);
  const [noticePage, setNoticePage] = useState(1);
  const [formPage, setFormPage] = useState(1);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // 팀원 추가 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [studentName, setStudentName] = useState("");

  // 편집 상태
  const [editClubName, setEditClubName] = useState(mockClub.clubName);
  const [editClubImage, setEditClubImage] = useState(mockClub.clubImage);
  const [editOneLiner, setEditOneLiner] = useState(mockClub.oneLiner);
  const [editIntroduction, setEditIntroduction] = useState(
    mockClub.introduction,
  );
  const [editLinks, setEditLinks] = useState(
    mockClub.links.map((url, i) => ({ id: `initial-${i}`, url })),
  );
  const [editMajors, setEditMajors] = useState<string[]>(mockClub.majors);

  const postingLimit = 5;
  const club = mockClub;
  const clubMembers = mockClubMembers;
  const jobPostings = mockJobPostings;

  // 변경 사항 확인
  const editLinksUrls = editLinks.map((l) => l.url);
  const hasChanges =
    editClubName !== club.clubName ||
    editClubImage !== club.clubImage ||
    editOneLiner !== club.oneLiner ||
    editIntroduction !== club.introduction ||
    JSON.stringify(editLinksUrls) !== JSON.stringify(club.links) ||
    JSON.stringify(editMajors.sort()) !== JSON.stringify(club.majors.sort());

  // 페이지 이탈 시 변경사항 경고
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  // 전공 토글 핸들러
  const toggleMajor = (major: string) => {
    if (editMajors.includes(major)) {
      setEditMajors(editMajors.filter((m) => m !== major));
    } else {
      setEditMajors([...editMajors, major]);
    }
  };

  // 저장 핸들러
  const handleSave = () => {
    if (!hasChanges) {
      toast.error("변경 사항이 없습니다");
      return;
    }
    toast.success("변경 사항이 저장되었습니다");
  };

  // 팀원 추가 요청 핸들러
  const handleAddMemberRequest = () => {
    setShowConfirmModal(true);
  };

  // 팀원 추가 확인 핸들러
  const handleConfirmAddMember = () => {
    toast.success("팀원 추가 신청이 완료되었습니다");
    setShowConfirmModal(false);
    setStudentNumber("");
    setStudentName("");
  };

  const pagedPostings = jobPostings.slice(
    (postingPage - 1) * postingLimit,
    postingPage * postingLimit,
  );

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ClubHeader
        clubImage={club.clubImage}
        clubName={club.clubName}
        title={club.clubName}
        oneLiner={club.oneLiner}
        buttonText="공고 보러가기"
      />

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
          {isClubMember && (
            <button
              type="button"
              onClick={() => setActiveTab("notification")}
              className={`flex-1 pt-4 pb-3 text-[14px] md:pt-5 md:pb-4 md:text-[15px] lg:pt-6 ${
                activeTab === "notification"
                  ? "border-gray-900 border-b-2 font-semibold text-gray-900"
                  : "text-gray-400"
              }`}
            >
              알림
            </button>
          )}
          <button
            type="button"
            onClick={() => setActiveTab("history")}
            className={`flex-1 pt-4 pb-3 text-[14px] md:pt-5 md:pb-4 md:text-[15px] lg:pt-6 ${
              activeTab === "history"
                ? "border-gray-900 border-b-2 font-semibold text-gray-900"
                : "text-gray-400"
            }`}
          >
            {isClubMember ? "공고/지원서" : "공고 이력"}
          </button>
          {isClubMember && (
            <button
              type="button"
              onClick={() => setActiveTab("application")}
              className={`flex-1 pt-4 pb-3 text-[14px] md:pt-5 md:pb-4 md:text-[15px] lg:pt-6 ${
                activeTab === "application"
                  ? "border-gray-900 border-b-2 font-semibold text-gray-900"
                  : "text-gray-400"
              }`}
            >
              지원내역
            </button>
          )}
        </nav>
      </div>

      {/* 공고/지원서 서브탭 */}
      {isClubMember && activeTab === "history" && (
        <nav className="flex">
          <button
            type="button"
            onClick={() => setHistorySubTab("posting")}
            className={`flex-1 pt-3 pb-2.5 text-[13px] md:pt-4 md:pb-3 md:text-[14px] ${
              historySubTab === "posting"
                ? "border-primary-500 border-b-2 font-semibold text-gray-900"
                : "text-gray-400"
            }`}
          >
            공고
          </button>
          <button
            type="button"
            onClick={() => setHistorySubTab("form")}
            className={`flex-1 pt-3 pb-2.5 text-[13px] md:pt-4 md:pb-3 md:text-[14px] ${
              historySubTab === "form"
                ? "border-primary-500 border-b-2 font-semibold text-gray-900"
                : "text-gray-400"
            }`}
          >
            지원서
          </button>
        </nav>
      )}

      {/* 소개 탭 */}
      {activeTab === "intro" && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          <div className="flex flex-col gap-8 md:gap-12 lg:gap-16">
            <ClubInfoEditSection
              club={club}
              isClubMember={isClubMember}
              editClubImage={editClubImage}
              setEditClubImage={setEditClubImage}
              editClubName={editClubName}
              setEditClubName={setEditClubName}
              editOneLiner={editOneLiner}
              setEditOneLiner={setEditOneLiner}
              editMajors={editMajors}
              toggleMajor={toggleMajor}
              editIntroduction={editIntroduction}
              setEditIntroduction={setEditIntroduction}
              editLinks={editLinks}
              setEditLinks={setEditLinks}
            />

            <ClubMemberSection
              clubMembers={clubMembers}
              isLeader={isLeader}
              studentNumber={studentNumber}
              setStudentNumber={setStudentNumber}
              studentName={studentName}
              setStudentName={setStudentName}
              onAddMemberRequest={handleAddMemberRequest}
            />

            {/* 변경 사항 저장 */}
            {isClubMember && (
              <section className="flex justify-center border-gray-200 border-t px-8 pt-8 md:px-32 lg:px-60">
                <Button
                  onClick={handleSave}
                  size="lg"
                  className="flex-1 bg-primary-500 py-2 text-white hover:bg-primary-600"
                >
                  변경 사항 저장
                </Button>
              </section>
            )}

            {/* 동아리 해체 신청 */}
            {isLeader && (
              <section className="flex justify-end pt-4">
                <button
                  type="button"
                  className="rounded-lg border border-red-500 px-4 py-2 text-[14px] text-red-500 hover:bg-red-50"
                >
                  동아리 해체 신청
                </button>
              </section>
            )}
          </div>
        </div>
      )}

      {/* 알림 탭 */}
      {activeTab === "notification" && isClubMember && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          {mockNotices.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              알림이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex min-h-[420px] flex-col gap-4">
                {mockNotices
                  .slice((noticePage - 1) * 7, noticePage * 7)
                  .map((notice) => (
                    <NoticeCard
                      key={notice.id}
                      title={notice.title}
                      date={notice.date}
                      content={notice.content}
                    />
                  ))}
              </div>
              {mockNotices.length > 7 && (
                <Pagination
                  listLen={mockNotices.length}
                  limit={7}
                  curPage={noticePage}
                  setCurPage={setNoticePage}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* 공고 이력 탭 - 비소속 */}
      {activeTab === "history" && !isClubMember && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          {jobPostings.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              공고 이력이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex min-h-[400px] flex-col gap-3 md:min-h-[460px] md:gap-4">
                {pagedPostings.map((posting) => (
                  <JobPostingItem
                    key={`${posting.title}-${posting.date}`}
                    status={posting.status}
                    title={posting.title}
                    date={posting.date}
                    onClick={() => console.log("공고 클릭:", posting.title)}
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

      {/* 공고/지원서 탭 - 소속 */}
      {activeTab === "history" && isClubMember && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          {historySubTab === "posting" && (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex justify-end">
                <button
                  type="button"
                  className="rounded-lg bg-primary-500 px-4 py-2 font-medium text-[14px] text-white hover:bg-primary-600"
                  onClick={() => console.log("공고 생성하기")}
                >
                  공고 생성하기
                </button>
              </div>
              {jobPostings.length === 0 ? (
                <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
                  공고가 없습니다.
                </div>
              ) : (
                <>
                  <div className="flex min-h-[400px] flex-col gap-3 md:min-h-[460px] md:gap-4">
                    {pagedPostings.map((posting) => (
                      <JobPostingItem
                        key={`${posting.title}-${posting.date}`}
                        status={posting.status}
                        title={posting.title}
                        date={posting.date}
                        onClick={() => console.log("공고 클릭:", posting.title)}
                        isMember={isClubMember}
                        content={posting.content}
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
                </>
              )}
            </div>
          )}
          {historySubTab === "form" &&
            (showApplicationForm ? (
              <ApplicationForm />
            ) : (
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-lg bg-primary-500 px-4 py-2 font-medium text-[14px] text-white hover:bg-primary-600"
                    onClick={() => setShowApplicationForm(true)}
                  >
                    지원서 생성하기
                  </button>
                </div>
                {mockApplications.length === 0 ? (
                  <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
                    지원서가 없습니다.
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-10">
                      {mockApplications
                        .slice((formPage - 1) * 3, formPage * 3)
                        .map((application) => (
                          <ApplicationCard
                            key={application.id}
                            application={application}
                            onClick={() =>
                              console.log("지원서 조회:", application.title)
                            }
                          />
                        ))}
                    </div>
                    {mockApplications.length > 3 && (
                      <Pagination
                        listLen={mockApplications.length}
                        limit={3}
                        curPage={formPage}
                        setCurPage={setFormPage}
                      />
                    )}
                  </>
                )}
              </div>
            ))}
        </div>
      )}

      {/* 지원내역 탭 */}
      {activeTab === "application" && isClubMember && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
            지원내역이 없습니다.
          </div>
        </div>
      )}

      {/* CTA */}
      {!isClubMember && (
        <CTASection
          title="이 동아리가 마음에 든다면?"
          subtitle="동아리 가입 신청을 위해 아래 버튼을 눌러주세요!"
          description="아래 버튼을 눌러 지원해보세요!"
          buttonText="이 동아리의 공고로 바로가기"
        />
      )}

      {/* 팀원 추가 확인 모달 */}
      <ApplicationConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAddMember}
        onBackdropClick={() => setShowConfirmModal(false)}
        title="2306 손희찬님에게 팀원 추가 신청을 하시겠습니까?"
        description="이 작업은 되돌릴 수 없습니다."
        cancelText="닫기"
        confirmText="신청하기"
      />
    </main>
  );
}
