"use client";

import Image from "next/image";
import { use, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "ui";
import {
  ApplicationConfirmModal,
  ClubHeader,
  CTASection,
  JobPostingItem,
  MemberItem,
  Pagination,
} from "@/components";
import { FIELDS } from "@/constants/club";
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
  { status: "진행중", title: "2025년 상반기 신입 모집", date: "2025.03.01" },
  { status: "종료됨", title: "iOS 추가 모집합니다", date: "2025.12.24" },
  { status: "종료됨", title: "백엔드 개발자 모집", date: "2025.11.15" },
  { status: "종료됨", title: "프론트엔드 개발자 모집", date: "2025.10.20" },
  { status: "종료됨", title: "디자이너 모집", date: "2025.09.10" },
  { status: "종료됨", title: "PM 모집", date: "2025.08.05" },
];

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  const { clubId: _clubId } = use(params);

  // TODO: 서버에서 권한 가져오기
  const role = "CLUB_LEADER" as UserRole; // 더미값: "STUDENTS" | "CLUB_MEMBER" | "CLUB_LEADER"

  const isClubMember = role === "CLUB_MEMBER" || role === "CLUB_LEADER";
  const isLeader = role === "CLUB_LEADER";

  const [activeTab, setActiveTab] = useState<
    "intro" | "history" | "notification" | "application"
  >("intro");
  const [historySubTab, setHistorySubTab] = useState<"posting" | "form">(
    "posting",
  );
  const [memberPage, setMemberPage] = useState(1);
  const [postingPage, setPostingPage] = useState(1);

  // 팀원 추가 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [studentName, setStudentName] = useState("");

  // 편집 상태
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingOneLiner, setIsEditingOneLiner] = useState(false);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);
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

  const nameInputRef = useRef<HTMLInputElement>(null);
  const oneLinerInputRef = useRef<HTMLInputElement>(null);
  const introTextareaRef = useRef<HTMLTextAreaElement>(null);

  // 팀원 추가 요청 핸들러
  const handleAddMemberRequest = () => {
    setShowConfirmModal(true);
  };

  // 팀원 추가 확인 핸들러
  const handleConfirmAddMember = () => {
    // TODO: 실제 팀원 추가 요청 API 호출
    toast.success("팀원 추가 신청이 완료되었습니다");
    setShowConfirmModal(false);
    setStudentNumber("");
    setStudentName("");
  };

  // 동아리명 편집 모드 시 포커스 (텍스트 끝에 커서 위치)
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      const input = nameInputRef.current;
      input.focus();
      input.selectionStart = input.value.length;
      input.selectionEnd = input.value.length;
    }
  }, [isEditingName]);

  // 한줄 소개 편집 모드 시 포커스 (텍스트 끝에 커서 위치)
  useEffect(() => {
    if (isEditingOneLiner && oneLinerInputRef.current) {
      const input = oneLinerInputRef.current;
      input.focus();
      input.selectionStart = input.value.length;
      input.selectionEnd = input.value.length;
    }
  }, [isEditingOneLiner]);

  // textarea 높이 자동 조절
  const adjustTextareaHeight = () => {
    if (introTextareaRef.current) {
      introTextareaRef.current.style.height = "auto";
      introTextareaRef.current.style.height = `${introTextareaRef.current.scrollHeight}px`;
    }
  };

  // 소개 편집 모드 시 포커스 (텍스트 끝에 커서 위치)
  useEffect(() => {
    if (isEditingIntro && introTextareaRef.current) {
      const textarea = introTextareaRef.current;
      textarea.focus();
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.value.length;
      adjustTextareaHeight();
    }
  }, [isEditingIntro]);

  // 소개 내용 변경 시 높이 조절
  useEffect(() => {
    adjustTextareaHeight();
  }, [editIntroduction]);

  const memberLimit = 8;
  const postingLimit = 5;

  const club = mockClub;

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
    // TODO: 실제 저장 API 호출
    toast.success("변경 사항이 저장되었습니다");
  };
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

      {/* 공고/지원서 서브탭 - 동아리 소속이고 history 탭일 때만 */}
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
            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 이미지
              </h2>
              <div className="flex items-center gap-4">
                <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={isClubMember ? editClubImage : club.clubImage}
                    alt="동아리 이미지"
                    fill
                    className="object-cover"
                  />
                </div>
                {isClubMember && (
                  <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50">
                    이미지 변경
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = URL.createObjectURL(file);
                          setEditClubImage(url);
                        }
                      }}
                    />
                  </label>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리명
              </h2>
              <div
                className={`flex flex-1 items-center rounded-lg border bg-white px-4 py-2.5 ${
                  isEditingName
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "border-gray-100"
                }`}
              >
                {isEditingName ? (
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={editClubName}
                    onChange={(e) => setEditClubName(e.target.value)}
                    className="flex-1 bg-transparent text-[14px] text-gray-700 focus:outline-none md:text-[15px]"
                  />
                ) : (
                  <p className="flex-1 text-[14px] text-gray-700 md:text-[15px]">
                    {isClubMember ? editClubName : club.clubName}
                  </p>
                )}
                {isClubMember && !isEditingName && (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(true)}
                    className="ml-2 shrink-0"
                  >
                    <Image
                      src="/images/icons/edit.svg"
                      alt="편집"
                      width={16}
                      height={16}
                    />
                  </button>
                )}
                {isClubMember && isEditingName && (
                  <button
                    type="button"
                    onClick={() => setIsEditingName(false)}
                    className="ml-2 shrink-0 text-[13px] text-primary-500 hover:text-primary-600"
                  >
                    완료
                  </button>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                한줄 소개
              </h2>
              <div
                className={`flex flex-1 items-center rounded-lg border bg-white px-4 py-2.5 ${
                  isEditingOneLiner
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "border-gray-100"
                }`}
              >
                {isEditingOneLiner ? (
                  <div className="flex flex-1 items-center gap-2">
                    <input
                      ref={oneLinerInputRef}
                      type="text"
                      value={editOneLiner}
                      maxLength={30}
                      onChange={(e) => setEditOneLiner(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          editOneLiner.length >= 30 &&
                          e.key !== "Backspace" &&
                          e.key !== "Delete" &&
                          !e.ctrlKey &&
                          !e.metaKey
                        ) {
                          toast.error("한줄 소개는 30자를 초과할 수 없습니다");
                        }
                      }}
                      className="flex-1 bg-transparent text-[14px] text-gray-700 focus:outline-none md:text-[15px]"
                    />
                    <span className="shrink-0 text-[12px] text-gray-400">
                      {editOneLiner.length}/30
                    </span>
                  </div>
                ) : (
                  <p className="flex-1 text-[14px] text-gray-700 md:text-[15px]">
                    {isClubMember ? editOneLiner : club.oneLiner}
                  </p>
                )}
                {isClubMember && !isEditingOneLiner && (
                  <button
                    type="button"
                    onClick={() => setIsEditingOneLiner(true)}
                    className="ml-2 shrink-0"
                  >
                    <Image
                      src="/images/icons/edit.svg"
                      alt="편집"
                      width={16}
                      height={16}
                    />
                  </button>
                )}
                {isClubMember && isEditingOneLiner && (
                  <button
                    type="button"
                    onClick={() => setIsEditingOneLiner(false)}
                    className="ml-2 shrink-0 text-[13px] text-primary-500 hover:text-primary-600"
                  >
                    완료
                  </button>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 전공
              </h2>
              <div className="flex flex-wrap gap-2">
                {isClubMember
                  ? FIELDS.map((field) => (
                      <button
                        key={field}
                        type="button"
                        onClick={() => toggleMajor(field)}
                        className={`rounded-full border px-3 py-1 text-[12px] md:text-[13px] ${
                          editMajors.includes(field)
                            ? "border-primary-500 bg-primary-50 text-primary-500"
                            : "border-gray-300 text-gray-500"
                        }`}
                      >
                        {field}
                      </button>
                    ))
                  : club.majors.map((major) => (
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
              <div
                className={`flex flex-1 items-start rounded-lg border bg-white p-4 ${
                  isEditingIntro
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "border-gray-100"
                }`}
              >
                {isEditingIntro ? (
                  <div className="flex w-full flex-col gap-2">
                    <textarea
                      ref={introTextareaRef}
                      value={editIntroduction}
                      maxLength={500}
                      onChange={(e) => setEditIntroduction(e.target.value)}
                      onKeyDown={(e) => {
                        if (
                          editIntroduction.length >= 500 &&
                          e.key !== "Backspace" &&
                          e.key !== "Delete" &&
                          !e.ctrlKey &&
                          !e.metaKey
                        ) {
                          toast.error(
                            "동아리 소개는 500자를 초과할 수 없습니다",
                          );
                        }
                      }}
                      className="min-h-[100px] w-full resize-none overflow-hidden bg-transparent text-[14px] text-gray-700 focus:outline-none md:text-[15px]"
                    />
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-gray-400">
                        {editIntroduction.length}/500
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsEditingIntro(false)}
                        className="text-[13px] text-primary-500 hover:text-primary-600"
                      >
                        완료
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="flex-1 text-[14px] text-gray-700 md:text-[15px]">
                    {isClubMember ? editIntroduction : club.introduction}
                  </p>
                )}
                {isClubMember && !isEditingIntro && (
                  <button
                    type="button"
                    onClick={() => setIsEditingIntro(true)}
                    className="ml-2 shrink-0"
                  >
                    <Image
                      src="/images/icons/edit.svg"
                      alt="편집"
                      width={16}
                      height={16}
                    />
                  </button>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-2 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 관련 링크
              </h2>
              <div
                className={`flex flex-1 items-start rounded-lg border bg-white p-4 ${
                  isEditingLinks
                    ? "border-primary-500 ring-1 ring-primary-500"
                    : "border-gray-100"
                }`}
              >
                {isEditingLinks ? (
                  <div className="flex w-full flex-col gap-3 pt-1">
                    {editLinks.map((linkItem) => (
                      <div
                        key={linkItem.id}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={linkItem.url}
                          onChange={(e) => {
                            setEditLinks(
                              editLinks.map((l) =>
                                l.id === linkItem.id
                                  ? { ...l, url: e.target.value }
                                  : l,
                              ),
                            );
                          }}
                          className="flex-1 rounded border border-gray-200 px-2 py-1 text-[14px] text-gray-700 focus:border-gray-400 focus:outline-none md:text-[15px]"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setEditLinks(
                              editLinks.filter((l) => l.id !== linkItem.id),
                            );
                          }}
                          className="text-[14px] text-red-500 hover:text-red-600"
                        >
                          삭제
                        </button>
                      </div>
                    ))}
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() =>
                          setEditLinks([
                            ...editLinks,
                            { id: `new-${Date.now()}`, url: "" },
                          ])
                        }
                        className="text-[14px] text-gray-500 hover:text-gray-700"
                      >
                        + 링크 추가
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingLinks(false)}
                        className="mt-7 text-[13px] text-primary-500 hover:text-primary-600"
                      >
                        완료
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col gap-1">
                    {(isClubMember ? editLinksUrls : club.links).map((link) => (
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
                )}
                {isClubMember && !isEditingLinks && (
                  <button
                    type="button"
                    onClick={() => setIsEditingLinks(true)}
                    className="ml-2 shrink-0"
                  >
                    <Image
                      src="/images/icons/edit.svg"
                      alt="편집"
                      width={16}
                      height={16}
                    />
                  </button>
                )}
              </div>
            </section>

            <section className="flex flex-col gap-4 md:flex-row md:gap-0">
              <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
                동아리 팀원
              </h2>

              <div className="flex flex-col gap-6 md:gap-8">
                {/* 팀원 이름 나열 */}
                <div className="flex flex-wrap gap-2">
                  {clubMembers.map((member) => (
                    <span
                      key={`name-${member.userName}-${member.introduce}`}
                      className="text-[14px] text-gray-700 md:text-[15px]"
                    >
                      {member.userName}
                      {clubMembers.indexOf(member) < clubMembers.length - 1 &&
                        ","}
                    </span>
                  ))}
                </div>

                {/* 팀원 추가 섹션 - 리더만 */}
                {isLeader && (
                  <div className="flex flex-col gap-6 rounded-lg border border-gray-200 bg-white p-6">
                    <div>
                      <h3 className="mb-1 font-semibold text-[16px]">
                        동아리 팀원 추가
                      </h3>
                      <p className="text-[13px] text-gray-500">
                        학번으로 검색해서 동아리 팀원을 추가해주세요.
                      </p>
                    </div>

                    {/* 입력 필드 */}
                    <div className="flex gap-4">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="학번"
                          value={studentNumber}
                          onChange={(e) => setStudentNumber(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-[14px] focus:border-gray-400 focus:outline-none"
                        />
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400"
                          aria-hidden="true"
                        >
                          <circle cx="11" cy="11" r="8" strokeWidth="2" />
                          <path
                            d="M21 21l-4.35-4.35"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div className="relative flex-1">
                        <input
                          type="text"
                          placeholder="이름"
                          value={studentName}
                          onChange={(e) => setStudentName(e.target.value)}
                          className="w-full rounded-lg border border-gray-200 px-4 py-2.5 pr-10 text-[14px] focus:border-gray-400 focus:outline-none"
                        />
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400"
                          aria-hidden="true"
                        >
                          <circle cx="11" cy="11" r="8" strokeWidth="2" />
                          <path
                            d="M21 21l-4.35-4.35"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddMemberRequest}
                        className="whitespace-nowrap rounded-lg bg-red-500 px-6 py-2.5 text-[14px] text-white hover:bg-red-600"
                      >
                        팀원 추가 요청
                      </button>
                    </div>
                  </div>
                )}

                <div className="grid min-h-[590px] grid-cols-4 content-start items-start gap-5">
                  {pagedMembers.map((member) => (
                    <MemberItem
                      key={`${member.userName}-${member.introduce}`}
                      {...member}
                      canDelete={isClubMember}
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

            {/* 변경 사항 저장 - 동아리 소속만 */}
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

            {/* 동아리 해체 신청 - 리더만 */}
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

      {/* 알림 탭 - 동아리 소속만 */}
      {activeTab === "notification" && isClubMember && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
            알림이 없습니다.
          </div>
        </div>
      )}

      {/* 공고 이력 탭 - 동아리 비소속 */}
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

      {/* 공고/지원서 탭 - 동아리 소속 */}
      {activeTab === "history" && isClubMember && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          {/* 공고 서브탭 */}
          {historySubTab === "posting" &&
            (jobPostings.length === 0 ? (
              <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
                공고가 없습니다.
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
            ))}

          {/* 지원서 서브탭 */}
          {historySubTab === "form" && (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              지원서가 없습니다.
            </div>
          )}
        </div>
      )}

      {/* 지원내역 탭 - 동아리 소속만 */}
      {activeTab === "application" && isClubMember && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
            지원내역이 없습니다.
          </div>
        </div>
      )}

      {/* CTA - 학생만 */}
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
