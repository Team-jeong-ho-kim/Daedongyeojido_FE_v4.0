"use client";

export const runtime = "edge";

import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useId, useState } from "react";
import { useUserStore } from "shared";
import { toast } from "sonner";
import { Button } from "ui";
import { getApplicationSubmissions } from "@/api/applicationForm";
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
import {
  useDissolveClubMutation,
  useRequestAddClubMemberMutation,
  useUpdateClubMutation,
} from "@/hooks/mutations/useClub";
import { useGetClubAlarmsQuery } from "@/hooks/querys/useAlarmQuery";
import { useGetClubAnnouncementsQuery } from "@/hooks/querys/useAnnouncementQuery";
import { useGetClubApplicationFormsQuery } from "@/hooks/querys/useApplicationFormQuery";
import { useGetDetailClubQuery } from "@/hooks/querys/useClubQuery";
import type { ApplicationSubmission } from "@/types";

interface ClubDetailPageProps {
  params: Promise<{ clubId: string }>;
}

export default function ClubDetailPage({ params }: ClubDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clubId } = use(params);
  const { data: clubData } = useGetDetailClubQuery(clubId);
  const { data: announcements } = useGetClubAnnouncementsQuery(clubId);
  const { data: applicationForms } = useGetClubApplicationFormsQuery(clubId);
  const { data: clubAlarms } = useGetClubAlarmsQuery();
  const { mutateAsync: updateClubMutate, isPending: isUpdating } =
    useUpdateClubMutation(clubId);
  const { mutate: dissolveClubMutate, isPending: isDissolvePending } =
    useDissolveClubMutation();
  const { mutate: requestAddMemberMutate, isPending: isAddMemberPending } =
    useRequestAddClubMemberMutation(clubId);

  const role = useUserStore((state) => state.userInfo?.role);

  const isClubMember = role === "CLUB_MEMBER" || role === "CLUB_LEADER";
  const isLeader = role === "CLUB_LEADER";

  // URL 쿼리 파라미터에서 탭 상태 읽기
  const tabFromUrl = searchParams.get("tab") as
    | "intro"
    | "history"
    | "notification"
    | "application"
    | null;
  const subtabFromUrl = searchParams.get("subtab") as "posting" | "form" | null;

  const [activeTab, setActiveTab] = useState<
    "intro" | "history" | "notification" | "application"
  >(tabFromUrl || "intro");
  const [historySubTab, setHistorySubTab] = useState<"posting" | "form">(
    subtabFromUrl || "posting",
  );
  const [postingPage, setPostingPage] = useState(1);
  const [noticePage, setNoticePage] = useState(1);
  const [formPage, setFormPage] = useState(1);
  const [applicationPage, setApplicationPage] = useState(1);
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  // 지원내역 관련 상태
  const [selectedApplicationFormId, setSelectedApplicationFormId] = useState<
    string | null
  >(null);
  const [submissions, setSubmissions] = useState<ApplicationSubmission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);

  const applicationFormSelectId = useId();

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

  // URL 쿼리 파라미터 변경 시 탭 상태 동기화
  useEffect(() => {
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
    if (subtabFromUrl) {
      setHistorySubTab(subtabFromUrl);
    }
  }, [tabFromUrl, subtabFromUrl]);

  // 탭 변경 핸들러
  const handleTabChange = (
    tab: "intro" | "history" | "notification" | "application",
  ) => {
    setActiveTab(tab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    if (tab === "history") {
      params.set("subtab", historySubTab);
    } else {
      params.delete("subtab");
    }
    router.push(`/clubs/${clubId}?${params.toString()}`, { scroll: false });
  };

  // 서브탭 변경 핸들러
  const handleSubTabChange = (subtab: "posting" | "form") => {
    setHistorySubTab(subtab);
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", "history");
    params.set("subtab", subtab);
    router.push(`/clubs/${clubId}?${params.toString()}`, { scroll: false });
  };

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
  const allJobPostings = (announcements || [])
    .map((announcement) => {
      const dateString =
        typeof announcement.deadline === "string"
          ? announcement.deadline
          : `${announcement.deadline[0]}-${String(announcement.deadline[1]).padStart(2, "0")}-${String(announcement.deadline[2]).padStart(2, "0")}`;
      const deadlineDate = new Date(dateString);
      const today = new Date();

      // 서버의 status가 CLOSED면 "준비중", OPEN이면 마감일 기준으로 "진행중"/"종료됨"
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
        content: undefined,
        serverStatus: announcement.status,
      };
    })
    .sort((a, b) => b.id - a.id); // 최신순 정렬

  // 비회원일 때는 OPEN 상태(게시된 공고)만 표시
  const jobPostings = isClubMember
    ? allJobPostings
    : allJobPostings.filter((posting) => posting.serverStatus === "OPEN");

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

  // 지원내역 조회
  useEffect(() => {
    const fetchSubmissions = async () => {
      if (!selectedApplicationFormId) {
        setSubmissions([]);
        return;
      }

      try {
        setIsLoadingSubmissions(true);
        const data = await getApplicationSubmissions(selectedApplicationFormId);
        setSubmissions(data);
      } catch (error) {
        console.error("지원내역 조회 실패:", error);
        toast.error("지원내역을 불러올 수 없습니다.");
        setSubmissions([]);
      } finally {
        setIsLoadingSubmissions(false);
      }
    };

    fetchSubmissions();
  }, [selectedApplicationFormId]);

  // 지원내역 탭 활성화 시 첫 번째 폼 자동 선택
  useEffect(() => {
    if (
      activeTab === "application" &&
      applicationForms &&
      applicationForms.length > 0 &&
      !selectedApplicationFormId
    ) {
      setSelectedApplicationFormId(
        String(applicationForms[0].applicationFormId),
      );
    }
  }, [activeTab, applicationForms, selectedApplicationFormId]);

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
    if (!studentNumber.trim() || !studentName.trim()) {
      toast.error("학번과 이름을 모두 입력해주세요.");
      return;
    }
    setShowConfirmModal(true);
  };

  // 팀원 추가 확인 핸들러
  const handleConfirmAddMember = () => {
    requestAddMemberMutate(
      { userName: studentName.trim(), classNumber: studentNumber.trim() },
      {
        onSuccess: () => {
          setShowConfirmModal(false);
          setStudentNumber("");
          setStudentName("");
        },
      },
    );
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
            onClick={() => handleTabChange("intro")}
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
              onClick={() => handleTabChange("notification")}
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
            onClick={() => handleTabChange("history")}
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
              onClick={() => handleTabChange("application")}
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
            onClick={() => handleSubTabChange("posting")}
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
            onClick={() => handleSubTabChange("form")}
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
          {!clubAlarms || clubAlarms.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              알림이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex min-h-[420px] flex-col gap-4">
                {clubAlarms
                  .slice((noticePage - 1) * 7, noticePage * 7)
                  .map((alarm) => (
                    <NoticeCard
                      key={alarm.id}
                      title={alarm.title}
                      date=""
                      content={alarm.content}
                    />
                  ))}
              </div>
              {clubAlarms.length > 7 && (
                <Pagination
                  listLen={clubAlarms.length}
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
                        onClick={() =>
                          router.push(`/announcements/${posting.id}`)
                        }
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
                          const dateString = form.submissionDuration
                            ? typeof form.submissionDuration === "string"
                              ? form.submissionDuration
                              : form.submissionDuration
                                  .map((n) => String(n).padStart(2, "0"))
                                  .join("-")
                            : "미정";

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
                                  `/application-forms/${form.applicationFormId}?clubId=${clubId}`,
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
          {/* 지원서 폼 선택 */}
          {applicationForms && applicationForms.length > 0 && (
            <div className="mb-6">
              <label
                htmlFor={applicationFormSelectId}
                className="mb-2 block font-medium text-gray-900 text-sm"
              >
                지원서 폼 선택
              </label>
              <select
                id={applicationFormSelectId}
                value={selectedApplicationFormId || ""}
                onChange={(e) => setSelectedApplicationFormId(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-primary-500 focus:outline-none md:w-auto"
              >
                {[...applicationForms]
                  .sort((a, b) => b.applicationFormId - a.applicationFormId)
                  .map((form) => (
                    <option
                      key={form.applicationFormId}
                      value={form.applicationFormId}
                    >
                      {form.applicationFormTitle}
                    </option>
                  ))}
              </select>
            </div>
          )}

          {/* 지원내역 목록 */}
          {isLoadingSubmissions ? (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              지원내역을 불러오는 중...
            </div>
          ) : !selectedApplicationFormId ? (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              지원서 폼을 선택해주세요.
            </div>
          ) : submissions.length === 0 ? (
            <div className="py-12 text-center text-[14px] text-gray-400 md:py-16 md:text-[15px] lg:py-20">
              지원내역이 없습니다.
            </div>
          ) : (
            <div className="flex flex-col gap-6 md:gap-8">
              <div className="flex flex-col gap-4">
                {[...submissions]
                  .sort((a, b) => b.submissionId - a.submissionId)
                  .slice((applicationPage - 1) * 5, applicationPage * 5)
                  .map((applicant) => (
                    <ApplicantCard
                      key={applicant.submissionId}
                      applicant={applicant}
                      onClick={() => {}}
                    />
                  ))}
              </div>
              {submissions.length > 5 && (
                <Pagination
                  listLen={submissions.length}
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
        <div className="mt-32 mb-32">
          <CTASection
            title="이 동아리가 마음에 든다면?"
            subtitle="동아리 가입 신청을 위해 아래 버튼을 눌러주세요!"
            description="아래 버튼을 눌러 지원해보세요!"
            buttonText="이 동아리의 공고로 바로가기"
            buttonHref="/announcements"
          />
        </div>
      )}

      {/* 팀원 추가 확인 모달 */}
      <ApplicationConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmAddMember}
        onBackdropClick={() => setShowConfirmModal(false)}
        title={`${studentNumber} ${studentName}님에게 팀원 추가 신청을 하시겠습니까?`}
        description="이 작업은 되돌릴 수 없습니다."
        cancelText="닫기"
        confirmText={isAddMemberPending ? "신청 중..." : "신청하기"}
      />
    </main>
  );
}
