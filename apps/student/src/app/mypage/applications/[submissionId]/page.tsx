"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { use, useEffect, useState } from "react";
import { toast } from "sonner";
import type { MySubmissionDetail } from "@/api/applicationForm";
import {
  deleteMySubmission,
  getMySubmissionDetail,
  submitMySubmission,
} from "@/api/applicationForm";
import { ApplicationConfirmModal } from "@/components/modal/ApplicationConfirmModal";

interface MySubmissionDetailPageProps {
  params: Promise<{ submissionId: string }>;
}

export default function MySubmissionDetailPage({
  params,
}: MySubmissionDetailPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { submissionId } = use(params);
  const [submission, setSubmission] = useState<MySubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchSubmission = async () => {
      try {
        setIsLoading(true);
        const data = await getMySubmissionDetail(submissionId);
        setSubmission(data);
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

  const formatDeadline = (
    submissionDuration: string | [number, number, number],
  ) => {
    if (typeof submissionDuration === "string") {
      return submissionDuration;
    }
    return submissionDuration.map((n) => String(n).padStart(2, "0")).join("-");
  };

  const fromHistory = searchParams.get("from") === "history";
  const statusParam = searchParams.get("status");
  const isSubmitted =
    statusParam === "SUBMITTED" ||
    submission?.user_application_status === "SUBMITTED";

  const handleSubmitApplication = async () => {
    setIsSubmitting(true);
    try {
      await submitMySubmission(submissionId);
      toast.success("지원서가 제출되었습니다.");
      setShowSubmitModal(false);
      router.push("/mypage/history");
    } catch (error) {
      console.error("지원서 제출 실패:", error);
      toast.error("지원서 제출에 실패했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteApplication = async () => {
    setIsDeleting(true);
    try {
      await deleteMySubmission(submissionId);
      toast.success("지원서가 삭제되었습니다.");
      setShowDeleteModal(false);
      router.push("/mypage/applications");
    } catch (error) {
      console.error("지원서 삭제 실패:", error);
      toast.error("지원서 삭제에 실패했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading || !submission) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <p className="text-gray-500 text-lg">
          {isLoading
            ? "지원내역을 불러오는 중..."
            : "지원내역을 찾을 수 없습니다."}
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        {/* 상단 네비게이션 */}
        <div className="mb-8 flex items-center gap-2 text-gray-400 text-sm">
          <Link href="/mypage" className="hover:text-gray-600">
            마이페이지
          </Link>
          <span>&gt;</span>
          <Link
            href={fromHistory ? "/mypage/history" : "/mypage/applications"}
            className="hover:text-gray-600"
          >
            {fromHistory ? "지원 내역" : "나의 지원서"}
          </Link>
          <span>&gt;</span>
          <span className="text-gray-600">지원서 상세</span>
        </div>

        {/* 동아리 정보 헤더 */}
        <div className="mb-12 flex items-center gap-6">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl">
            {submission.clubImage ? (
              <Image
                src={submission.clubImage}
                alt={submission.clubName}
                fill
                className="object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[#7D5C5C]">
                <span className="font-bold text-2xl text-white">
                  {submission.clubName[0]}
                </span>
              </div>
            )}
          </div>
          <div>
            <h1 className="mb-2 font-extrabold text-3xl tracking-tight">
              {submission.clubName}
            </h1>
            <p className="text-gray-600 text-sm">
              지원 마감일: {formatDeadline(submission.submissionDuration)}
            </p>
          </div>
        </div>

        {/* 지원자 정보 */}
        <div className="mb-12 rounded-2xl bg-gray-50 p-8">
          <h2 className="mb-6 font-bold text-xl">지원자 정보</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="w-24 text-gray-600 text-sm">이름</span>
              <span className="font-medium text-gray-900">
                {submission.userName}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-gray-600 text-sm">학번</span>
              <span className="font-medium text-gray-900">
                {submission.classNumber}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="w-24 text-gray-600 text-sm">지원 전공</span>
              <span className="rounded-full border border-primary-500 bg-primary-50 px-3 py-1 font-medium text-primary-500 text-sm">
                {submission.major}
              </span>
            </div>
          </div>
        </div>

        {/* 자기소개 */}
        <div className="mb-12">
          <h2 className="mb-4 font-bold text-xl">자기소개</h2>
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <p className="text-gray-700 leading-relaxed">
              {submission.introduction}
            </p>
          </div>
        </div>

        {/* 질문 답변 */}
        <div className="mb-12">
          <h2 className="mb-6 font-bold text-xl">질문 답변</h2>
          <div className="space-y-6">
            {submission.contents.map((item, index) => (
              <div
                key={item.applicationQuestionId}
                className="rounded-2xl border border-gray-200 bg-white p-6"
              >
                <div className="mb-4 flex items-start gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary-500 font-medium text-sm text-white">
                    {index + 1}
                  </span>
                  <p className="flex-1 font-semibold text-gray-900">
                    Q. {item.question}
                  </p>
                </div>
                <div className="ml-9">
                  <p className="text-gray-700 leading-relaxed">{item.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex justify-center gap-4">
          {!isSubmitted && !fromHistory && (
            <>
              <button
                type="button"
                onClick={() =>
                  router.push(`/mypage/applications/${submissionId}/edit`)
                }
                className="rounded-xl bg-primary-500 px-8 py-3 font-medium text-white transition-colors hover:bg-primary-600"
              >
                수정하기
              </button>
              <button
                type="button"
                onClick={() => setShowSubmitModal(true)}
                disabled={isSubmitting}
                className="rounded-xl bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors hover:bg-[#d14d4d] disabled:cursor-not-allowed disabled:bg-gray-400"
              >
                {isSubmitting ? "제출 중..." : "제출하기"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteModal(true)}
                disabled={isDeleting}
                className="rounded-xl border border-red-500 bg-white px-8 py-3 font-medium text-red-500 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400"
              >
                {isDeleting ? "삭제 중..." : "삭제하기"}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() =>
              router.push(
                fromHistory || isSubmitted
                  ? "/mypage/history"
                  : "/mypage/applications",
              )
            }
            className="rounded-xl border border-gray-300 bg-white px-8 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            목록으로
          </button>
        </div>
      </div>

      <ApplicationConfirmModal
        isOpen={showSubmitModal}
        onClose={() => setShowSubmitModal(false)}
        onConfirm={handleSubmitApplication}
        onBackdropClick={() => setShowSubmitModal(false)}
        title="지원서를 제출하시겠습니까?"
        description="제출 후에는 수정이 제한될 수 있습니다."
        cancelText="취소"
        confirmText="제출하기"
      />

      <ApplicationConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteApplication}
        onBackdropClick={() => setShowDeleteModal(false)}
        title="지원서를 삭제하시겠습니까?"
        description="삭제된 지원서는 복구할 수 없습니다."
        cancelText="취소"
        confirmText="삭제하기"
      />
    </div>
  );
}
