"use client";

import { useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import { useUserStore } from "shared";
import { toast } from "sonner";
import type {
  InterviewScheduleDetail,
  SubmissionDetail,
} from "@/api/applicationForm";
import {
  createInterviewSchedule,
  decidePass,
  getInterviewSchedule,
  getSubmissionDetail,
} from "@/api/applicationForm";
import { InterviewScheduleSetModal } from "@/components/modal/InterviewScheduleSetModal";
import { InterviewScheduleViewModal } from "@/components/modal/InterviewScheduleViewModal";

interface SubmissionDetailPageProps {
  params: Promise<{ submissionId: string }>;
}

export default function SubmissionDetailPage({
  params,
}: SubmissionDetailPageProps) {
  const router = useRouter();
  const { submissionId } = use(params);
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showSetScheduleModal, setShowSetScheduleModal] = useState(false);
  const [showViewScheduleModal, setShowViewScheduleModal] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);
  const [scheduleDetail, setScheduleDetail] =
    useState<InterviewScheduleDetail | null>(null);
  const [isInterviewCompleted, setIsInterviewCompleted] = useState(false);

  const role = useUserStore((state) => state.userInfo?.role);
  const isClubMember = role === "CLUB_MEMBER" || role === "CLUB_LEADER";
  const isClubLeader = role === "CLUB_LEADER";

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        const data = await getSubmissionDetail(submissionId);
        setSubmission(data);
        setHasSchedule(data.hasInterviewSchedule);
      } catch (error) {
        console.error("지원내역 조회 실패:", error);
        toast.error("지원내역을 불러올 수 없습니다.");
        router.back();
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmission();
  }, [submissionId, router]);

  const handleSetSchedule = async (data: {
    interviewSchedule: string;
    place: string;
    interviewTime: string;
  }) => {
    if (!submission?.applicantId) {
      toast.error("지원자 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      await createInterviewSchedule(submission.applicantId.toString(), data);
      toast.success("면접 일정이 설정되었습니다.");
      setHasSchedule(true);
      setShowSetScheduleModal(false);
    } catch (error) {
      console.error("면접 일정 설정 실패:", error);

      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status: number; data?: { description?: string } };
        };

        // 400 에러 (유효성 검증 실패) 처리
        if (axiosError.response?.status === 400) {
          const errorMessage =
            axiosError.response.data?.description ||
            "입력값이 올바르지 않습니다.";
          toast.error(errorMessage);
          return;
        }

        // 409 에러 (이미 존재) 처리
        if (axiosError.response?.status === 409) {
          toast.error("이미 면접 일정이 존재합니다.");
          setHasSchedule(true);
          setShowSetScheduleModal(false);
          return;
        }
      }

      toast.error("면접 일정 설정에 실패했습니다.");
    }
  };

  const handleViewSchedule = async () => {
    if (!submission?.applicantId) {
      toast.error("지원자 정보를 찾을 수 없습니다.");
      return;
    }

    try {
      const data = await getInterviewSchedule(
        submission.applicantId.toString(),
      );
      setScheduleDetail(data);
      setShowViewScheduleModal(true);
    } catch (error) {
      console.error("면접 일정 조회 실패:", error);
      toast.error("면접 일정을 불러올 수 없습니다.");
    }
  };

  const handleScheduleUpdate = async () => {
    if (!submission?.applicantId) return;

    try {
      const data = await getInterviewSchedule(
        submission.applicantId.toString(),
      );
      setScheduleDetail(data);
    } catch (error) {
      console.error("면접 일정 재조회 실패:", error);
    }
  };

  const handleInterviewComplete = () => {
    setIsInterviewCompleted(true);
  };

  const handleDecidePass = async (isPassed: boolean) => {
    try {
      await decidePass(submissionId, { isPassed });
      toast.success(isPassed ? "합격 처리되었습니다." : "탈락 처리되었습니다.");
      router.back();
    } catch (error) {
      console.error("합격/탈락 처리 실패:", error);
      toast.error("처리에 실패했습니다. 다시 시도해주세요.");
    }
  };

  if (isLoading || !submission) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">
          {isLoading
            ? "지원내역을 불러오는 중..."
            : "지원내역을 찾을 수 없습니다."}
        </p>
      </main>
    );
  }

  // major를 배열로 변환 (쉼표로 구분된 경우 처리)
  const majorArray =
    typeof submission.major === "string"
      ? submission.major.split(",").map((m) => m.trim())
      : [submission.major];

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-8 py-16 md:px-16 md:py-20">
        {/* 헤더 - 동아리 로고 + 제목 */}
        <div className="mb-16 flex items-start gap-6">
          {/* 동아리 로고 (placeholder) */}
          <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-2xl bg-primary-500">
            <span className="font-bold text-4xl text-white">D</span>
          </div>
          {/* 제목 */}
          <div className="flex-1">
            <h1 className="mb-2 font-bold text-2xl text-gray-900 md:text-3xl">
              지원서 상세
            </h1>
            <p className="text-gray-400 text-sm md:text-base">전공동아리</p>
          </div>
        </div>

        {/* 인적 사항 */}
        <section className="mb-16">
          <h2 className="mb-6 font-bold text-gray-900 text-xl">인적 사항</h2>

          {/* 이름 */}
          <div className="mb-6">
            <p className="mb-3 text-gray-900 text-sm">이름</p>
            <div className="rounded-lg bg-gray-100 px-5 py-4 text-base text-gray-900">
              {submission.userName}
            </div>
          </div>

          {/* 학번 */}
          <div className="mb-6">
            <p className="mb-3 text-gray-900 text-sm">학번</p>
            <div className="rounded-lg bg-gray-100 px-5 py-4 text-base text-gray-900">
              {submission.classNumber}
            </div>
          </div>

          {/* 자기소개 */}
          <div>
            <p className="mb-3 text-gray-900 text-sm">자기소개</p>
            <div className="min-h-48 rounded-lg bg-gray-100 px-5 py-4 text-base text-gray-900 leading-relaxed">
              {submission.introduction}
            </div>
          </div>
        </section>

        {/* 지원 전공 */}
        <section className="mb-16">
          <h2 className="mb-6 font-bold text-gray-900 text-xl">지원 전공</h2>
          <div className="flex flex-wrap gap-3">
            {majorArray.map((major, index) => (
              <span
                key={major}
                className={`rounded-full px-5 py-2 font-medium text-sm ${
                  index === 0
                    ? "border border-primary-500 bg-primary-50 text-primary-500"
                    : "border border-gray-300 bg-white text-gray-700"
                }`}
              >
                {major}
              </span>
            ))}
          </div>
        </section>

        {/* 질문 답변 */}
        <section className="mb-16">
          <h2 className="mb-6 font-bold text-gray-900 text-xl">질문 답변</h2>
          <div className="space-y-8">
            {submission.answers.map((answer, index) => (
              <div key={answer.questionId}>
                {/* 질문 */}
                <p className="mb-3 text-base text-gray-900">
                  Q{index + 1}. {answer.questionContent}
                </p>
                {/* 답변 */}
                <div className="min-h-32 rounded-lg bg-gray-100 px-5 py-4 text-base text-gray-900 leading-relaxed">
                  {answer.content}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 버튼 */}
        {isClubMember && (
          <div className="flex justify-end gap-4">
            {isInterviewCompleted && isClubLeader ? (
              <>
                <button
                  type="button"
                  onClick={() => handleDecidePass(false)}
                  className="rounded-lg bg-gray-400 px-8 py-3 font-medium text-base text-white transition-colors hover:bg-gray-500"
                >
                  탈락
                </button>
                <button
                  type="button"
                  onClick={() => handleDecidePass(true)}
                  className="rounded-lg bg-primary-500 px-8 py-3 font-medium text-base text-white transition-colors hover:bg-primary-600"
                >
                  합격
                </button>
              </>
            ) : (
              <>
                {hasSchedule && (
                  <button
                    type="button"
                    onClick={handleViewSchedule}
                    className="rounded-lg border border-gray-900 bg-white px-8 py-3 font-medium text-base text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    면접 일정 조회
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setShowSetScheduleModal(true)}
                  className="rounded-lg bg-primary-500 px-8 py-3 font-medium text-base text-white transition-colors hover:bg-primary-600"
                >
                  면접 일정 설정
                </button>
              </>
            )}
          </div>
        )}
      </div>

      {/* 면접 일정 설정 모달 */}
      <InterviewScheduleSetModal
        isOpen={showSetScheduleModal}
        onClose={() => setShowSetScheduleModal(false)}
        onConfirm={handleSetSchedule}
        onBackdropClick={() => setShowSetScheduleModal(false)}
      />

      {/* 면접 일정 조회 모달 */}
      <InterviewScheduleViewModal
        isOpen={showViewScheduleModal}
        onClose={() => setShowViewScheduleModal(false)}
        onBackdropClick={() => setShowViewScheduleModal(false)}
        schedule={scheduleDetail}
        onUpdate={handleScheduleUpdate}
        onInterviewComplete={handleInterviewComplete}
        isClubLeader={isClubLeader}
      />
    </main>
  );
}
