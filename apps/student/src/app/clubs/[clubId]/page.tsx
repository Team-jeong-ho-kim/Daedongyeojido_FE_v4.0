"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useUserStore } from "shared";
import { toast } from "sonner";
import { Button } from "ui";
import {
  ApplicantCard,
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
import { MOCK_APPLICANTS, MOCK_NOTICES } from "@/constants/clubDetailMock";
import {
  useDissolveClubMutation,
  useUpdateClubMutation,
} from "@/hooks/mutations/useClub";
import { useGetClubAnnouncementsQuery } from "@/hooks/querys/useAnnouncementQuery";
import { useGetClubApplicationFormsQuery } from "@/hooks/querys/useApplicationFormQuery";
import { useGetDetailClubQuery } from "@/hooks/querys/useClubQuery";

interface ClubDetailPageProps {
  params: Promise<{ clubId: string }>;
}

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  const router = useRouter();
  const { clubId } = use(params);
  const { data: clubData } = useGetDetailClubQuery(clubId);
  const { data: announcements } = useGetClubAnnouncementsQuery(clubId);
  const { data: applicationForms } = useGetClubApplicationFormsQuery(clubId);
  const { mutateAsync: updateClubMutate, isPending: isUpdating } =
    useUpdateClubMutation(clubId);
  const { mutate: dissolveClubMutate, isPending: isDissolvePending } =
    useDissolveClubMutation();

  const role = useUserStore((state) => state.userInfo?.role);

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
  const [applicationPage, setApplicationPage] = useState(1);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // 팀원 추가 상태
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [studentNumber, setStudentNumber] = useState("");
  const [studentName, setStudentName] = useState("");

  // 편집 상태
  const [editClubName, setEditClubName] = useState("");
  const [editClubImage, setEditClubImage] = useState("");
  const [editClubImageFile, setEditClubImageFile] = useState<File | null>(null);
  const [editOneLiner, setEditOneLiner] = useState("");
  const [editIntroduction, setEditIntroduction] = useState("");
  const [editLinks, setEditLinks] = useState<{ id: string; url: string }[]>([]);
  const [editMajors, setEditMajors] = useState<string[]>([]);

  // clubData가 로드되면 편집 상태 초기화
  useEffect(() => {
    if (clubData) {
      setEditClubName(clubData.club.clubName);
      setEditClubImage(clubData.club.clubImage);
      setEditOneLiner(clubData.club.oneLiner);
      setEditIntroduction(clubData.club.introduction);

      // 중복 제거하여 링크 설정
      const uniqueLinks = [...new Set(clubData.club.links)];
      setEditLinks(
        uniqueLinks.map((url: string, i: number) => ({
          id: `initial-${i}`,
          url,
        })),
      );

      // 중복 제거하여 전공 설정
      setEditMajors([...new Set(clubData.club.majors)]);
    }
  }, [clubData]);

  const postingLimit = 5;
  const club = clubData;
  const clubMembers = clubData?.clubMembers || [];

  // ClubAnnouncement를 JobPosting 형태로 변환
  const jobPostings = (announcements || []).map((announcement) => {
    const dateString = `${announcement.deadline[0]}-${String(announcement.deadline[1]).padStart(2, "0")}-${String(announcement.deadline[2]).padStart(2, "0")}`;
    const deadlineDate = new Date(dateString);
    const today = new Date();
    const status = deadlineDate < today ? "종료됨" : "진행중";

    return {
      id: announcement.announcementId,
      status: status as "종료됨" | "진행중",
      title: announcement.title,
      date: dateString,
      content: undefined,
    };
  });

  // 변경 사항 확인
  const editLinksUrls = editLinks.map((l) => l.url);

  // 중복 제거 및 정렬하여 비교
  const normalizedEditLinks = [...new Set(editLinksUrls)].sort();
  const normalizedClubLinks = [...new Set(club?.club.links || [])].sort();
  const normalizedEditMajors = [...new Set(editMajors)].sort();
  const normalizedClubMajors = [...new Set(club?.club.majors || [])].sort();

  const hasChanges =
    editClubName !== club?.club.clubName ||
    editClubImage !== club?.club.clubImage ||
    editClubImageFile !== null || // 새 이미지 파일이 선택된 경우
    editOneLiner !== club?.club.oneLiner ||
    editIntroduction !== club?.club.introduction ||
    JSON.stringify(normalizedEditLinks) !==
      JSON.stringify(normalizedClubLinks) ||
    JSON.stringify(normalizedEditMajors) !==
      JSON.stringify(normalizedClubMajors);

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

  // 빈 더미 파일 생성 (이미지 변경하지 않은 경우 사용)
  const createDummyFile = (): File => {
    const blob = new Blob([], { type: "image/jpeg" });
    return new File([blob], "dummy.jpg", { type: "image/jpeg" });
  };

  // 저장 핸들러
  const handleSave = async () => {
    if (!hasChanges) {
      toast.error("변경 사항이 없습니다");
      return;
    }

    // 필수 필드 검증
    if (!editClubName.trim()) {
      toast.error("동아리 이름을 입력해주세요.");
      return;
    }
    if (!editOneLiner.trim()) {
      toast.error("한 줄 소개를 입력해주세요.");
      return;
    }
    if (!editIntroduction.trim()) {
      toast.error("동아리 소개를 입력해주세요.");
      return;
    }
    if (editMajors.length === 0) {
      toast.error("최소 하나의 전공을 선택해주세요.");
      return;
    }

    // 중복 제거하여 링크 URL 추출
    const linkUrls = editLinks
      .map((l) => l.url)
      .filter((url) => url.trim() !== "");
    const uniqueLinks = [...new Set(linkUrls)];

    const updateData = {
      clubName: editClubName.trim(),
      oneLiner: editOneLiner.trim(),
      introduction: editIntroduction.trim(),
      major: [...new Set(editMajors)], // 중복 제거
      link: uniqueLinks, // 중복 제거된 링크
    };

    // 이미지 파일 준비 -> 새로 선택한 파일이 있으면 그걸 사용, 없으면 빈 더미 파일 사용
    let imageFileToSend: File;
    let imageChanged = false;

    if (editClubImageFile) {
      // 새 이미지를 선택한 경우
      imageFileToSend = editClubImageFile;
      imageChanged = true;
    } else {
      // 이미지를 변경하지 않은 경우 -> 빈 더미 파일 사용
      imageFileToSend = createDummyFile();
      imageChanged = false;
    }

    try {
      await updateClubMutate({
        data: updateData,
        imageFile: imageFileToSend,
        imageChanged,
      });
      // 성공 후 이미지 파일 상태 리셋
      setEditClubImageFile(null);
    } catch {
      // 에러는 mutation hook의 onError에서 처리됨
    }
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

  if (!club) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">동아리 정보를 불러오는 중...</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-white">
      {/* 헤더 */}
      <ClubHeader
        clubImage={club.club.clubImage}
        clubName={club.club.clubName}
        title={club.club.clubName}
        oneLiner={club.club.oneLiner}
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
              club={club.club}
              isClubMember={isClubMember}
              editClubImage={editClubImage}
              setEditClubImage={setEditClubImage}
              setEditClubImageFile={setEditClubImageFile}
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
              clubId={clubId}
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
                  disabled={isUpdating || !hasChanges}
                  size="lg"
                  className="flex-1 bg-primary-500 py-2 text-white hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isUpdating ? "저장 중..." : "변경 사항 저장"}
                </Button>
              </section>
            )}

            {/* 동아리 해체 신청 */}
            {isLeader && (
              <section className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={() => {
                    if (
                      window.confirm(
                        "정말로 동아리 해체를 신청하시겠습니까? 이 작업은 되돌릴 수 없습니다.",
                      )
                    ) {
                      dissolveClubMutate();
                    }
                  }}
                  disabled={isDissolvePending}
                  className="rounded-lg border border-red-500 px-4 py-2 text-[14px] text-red-500 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isDissolvePending ? "신청 중..." : "동아리 해체 신청"}
                </button>
              </section>
            )}
          </div>
        </div>
      )}

      {/* 알림 탭 */}
      {activeTab === "notification" && isClubMember && (
        <div className="mb-16 bg-gray-50 px-6 py-8 md:mb-20 md:px-12 md:py-12 lg:mb-30 lg:px-24 lg:py-16">
          {MOCK_NOTICES.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              알림이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex min-h-[420px] flex-col gap-4">
                {MOCK_NOTICES.slice((noticePage - 1) * 7, noticePage * 7).map(
                  (notice) => (
                    <NoticeCard
                      key={notice.id}
                      title={notice.title}
                      date={notice.date}
                      content={notice.content}
                    />
                  ),
                )}
              </div>
              {MOCK_NOTICES.length > 7 && (
                <Pagination
                  listLen={MOCK_NOTICES.length}
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
                    key={posting.id}
                    status={posting.status}
                    title={posting.title}
                    date={posting.date}
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
                  onClick={() => router.push("/announcements/create")}
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
                        key={posting.id}
                        status={posting.status}
                        title={posting.title}
                        date={posting.date}
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
              <ApplicationForm
                onExit={() => {
                  setShowApplicationForm(false);
                  window.scroll({ top: 0, behavior: "smooth" });
                }}
              />
            ) : (
              <div className="flex flex-col gap-6 md:gap-8">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="rounded-lg bg-primary-500 px-4 py-2 font-medium text-[14px] text-white hover:bg-primary-600"
                    onClick={() => setShowApplicationForm(true)}
                  >
                    지원서 폼 생성하기
                  </button>
                </div>
                {!applicationForms || applicationForms.length === 0 ? (
                  <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
                    지원서 폼이 없습니다.
                  </div>
                ) : (
                  <>
                    <div className="flex flex-col gap-10">
                      {[...applicationForms]
                        .sort(
                          (a, b) => b.applicationFormId - a.applicationFormId,
                        )
                        .slice((formPage - 1) * 3, formPage * 3)
                        .map((form) => {
                          const [year, month, day] = form.submissionDuration;
                          const dateString = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

                          return (
                            <ApplicationCard
                              key={form.applicationFormId}
                              application={{
                                id: form.applicationFormId,
                                title: form.applicationFormTitle,
                                deadline: dateString,
                              }}
                              onClick={() =>
                                router.push(
                                  `/application-forms/${form.applicationFormId}`,
                                )
                              }
                            />
                          );
                        })}
                    </div>
                    {applicationForms.length > 3 && (
                      <Pagination
                        listLen={applicationForms.length}
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
                    onClick={() => {}}
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
