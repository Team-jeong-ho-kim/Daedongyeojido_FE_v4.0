"use client";

export const runtime = "edge";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useId, useMemo, useState } from "react";
import {
  clearTokens,
  getAccessToken,
  getDocumentDownloadFileName,
  getSessionUser,
  partitionClubCreationReviews,
} from "utils";
import {
  getTeacherClubCreationApplicationDetail,
  reviewTeacherClubCreationApplication,
} from "@/api/teacher";
import { TeacherClubCreationPreviewModal } from "@/components/common";
import { moveToWebLogin } from "@/lib/auth";
import type {
  ClubCreationReviewDecision,
  ClubCreationReviewerType,
  TeacherClubCreationApplicationDetailResponse,
  TeacherClubCreationReview,
} from "@/types/teacher";

const REVIEWER_LABELS: Record<ClubCreationReviewerType, string> = {
  ADMIN: "관리자",
  TEACHER: "지도 교사",
};

const DECISION_LABELS: Record<ClubCreationReviewDecision, string> = {
  APPROVED: "승인",
  CHANGES_REQUESTED: "수정 요청",
  REJECTED: "반려",
};

const DECISION_STYLES: Record<ClubCreationReviewDecision, string> = {
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CHANGES_REQUESTED: "border-amber-200 bg-amber-50 text-amber-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
};

const STATUS_LABELS = {
  APPROVED: "승인 완료",
  CHANGES_REQUESTED: "수정 요청",
  REJECTED: "반려",
  SUBMITTED: "제출 완료",
  UNDER_REVIEW: "검토 중",
} as const;

const REVIEW_DECISION_OPTIONS = [
  "APPROVED",
  "CHANGES_REQUESTED",
  "REJECTED",
] as const;

const sortReviews = (reviews: TeacherClubCreationReview[]) =>
  [...reviews].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

const getReviewRenderKey = (review: TeacherClubCreationReview) => {
  return [
    review.revision,
    review.reviewId,
    review.reviewerType,
    review.updatedAt,
  ].join(":");
};

const formatDateTime = (value: string | null) => {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

function ReviewSection({
  emptyMessage,
  reviews,
  title,
}: {
  emptyMessage: string;
  reviews: TeacherClubCreationReview[];
  title: string;
}) {
  const sortedReviews = useMemo(() => sortReviews(reviews), [reviews]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-xl">{title}</h2>
        <span className="text-gray-400 text-sm">{sortedReviews.length}건</span>
      </div>

      {sortedReviews.length === 0 ? (
        <div className="rounded-2xl border border-gray-200 border-dashed bg-gray-50 px-5 py-5 text-gray-500 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => (
            <article
              key={getReviewRenderKey(review)}
              className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm"
            >
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 font-medium text-[12px] text-gray-600">
                  {REVIEWER_LABELS[review.reviewerType]}
                </span>
                <span
                  className={`rounded-full border px-3 py-1 font-medium text-[12px] ${DECISION_STYLES[review.decision]}`}
                >
                  {DECISION_LABELS[review.decision]}
                </span>
                <span className="text-gray-400 text-xs">
                  검토 차수 {review.revision}차
                </span>
              </div>

              <div className="mt-3">
                <p className="font-semibold text-gray-900 text-sm">
                  {review.reviewerName}
                </p>
                <p className="mt-1 text-gray-400 text-xs">
                  {formatDateTime(review.updatedAt)}
                </p>
              </div>

              <div className="mt-4 rounded-xl bg-gray-50 px-4 py-4 text-gray-700 text-sm leading-7">
                {review.feedback?.trim()
                  ? review.feedback
                  : "남겨진 코멘트가 없습니다."}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export default function TeacherClubCreationApplicationDetailPage() {
  const params = useParams<{ applicationId: string }>();
  const feedbackFieldId = useId();
  const applicationId = useMemo(() => {
    if (!params?.applicationId) return "";
    return Array.isArray(params.applicationId)
      ? params.applicationId[0]
      : params.applicationId;
  }, [params]);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isClubCreationFormPreviewOpen, setIsClubCreationFormPreviewOpen] =
    useState(false);
  const [isReviewConfirmOpen, setIsReviewConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [detail, setDetail] =
    useState<TeacherClubCreationApplicationDetailResponse | null>(null);
  const [decision, setDecision] = useState<ClubCreationReviewDecision | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

  const loadDetail = async () => {
    const accessToken = getAccessToken();
    const sessionUser = getSessionUser();

    if (!accessToken || !sessionUser || sessionUser.role !== "TEACHER") {
      clearTokens();
      moveToWebLogin();
      return;
    }

    if (!applicationId) {
      setErrorMessage("잘못된 개설 신청 ID입니다.");
      setIsCheckingSession(false);
      return;
    }

    try {
      const response =
        await getTeacherClubCreationApplicationDetail(applicationId);
      const normalizedReviewBuckets = partitionClubCreationReviews(response);
      const currentTeacherReview =
        normalizedReviewBuckets.currentRevisionReviews.find(
          (review) => review.reviewerType === "TEACHER",
        ) ?? null;

      setDetail(response);
      setDecision(currentTeacherReview?.decision ?? null);
      setFeedback(currentTeacherReview?.feedback ?? "");
      setReviewError("");
      setErrorMessage("");
    } catch {
      setErrorMessage("개설 신청 상세 정보를 불러오지 못했습니다.");
    } finally {
      setIsCheckingSession(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      if (!isMounted) return;
      await loadDetail();
    };

    void run();

    return () => {
      isMounted = false;
    };
  }, [applicationId]);

  const uniqueLinks = detail
    ? [...new Set(detail.links.map((link) => link.trim()))].filter(Boolean)
    : [];
  const normalizedReviewBuckets = detail
    ? partitionClubCreationReviews(detail)
    : null;
  const currentRevisionReviews =
    normalizedReviewBuckets?.currentRevisionReviews ?? [];
  const historicalReviews = normalizedReviewBuckets?.historicalReviews ?? [];
  const previewFileName = detail?.clubCreationForm
    ? getDocumentDownloadFileName(
        `${detail.clubName} 개설 신청 양식`,
        detail.clubCreationForm,
      )
    : "";

  const validateReviewForm = () => {
    if (!detail || isReviewSubmitting) {
      return false;
    }

    const normalizedFeedback = feedback.trim();

    if (decision === null) {
      setReviewError("검토 결과를 선택해주세요.");
      return false;
    }

    if (decision !== "APPROVED" && !normalizedFeedback) {
      setReviewError(
        "수정 요청 또는 반려일 때는 코멘트를 반드시 입력해주세요.",
      );
      return false;
    }

    return true;
  };

  const handleOpenReviewConfirm = () => {
    if (!validateReviewForm()) {
      return;
    }

    setIsReviewConfirmOpen(true);
  };

  const handleSubmitReview = async () => {
    if (!detail || isReviewSubmitting || decision === null) {
      setIsReviewConfirmOpen(false);
      return;
    }

    const normalizedFeedback = feedback.trim();

    setIsReviewSubmitting(true);

    try {
      await reviewTeacherClubCreationApplication(String(detail.applicationId), {
        decision,
        feedback: normalizedFeedback || undefined,
      });
      await loadDetail();
    } catch {
      setReviewError("리뷰 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsReviewConfirmOpen(false);
      setIsReviewSubmitting(false);
    }
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-gray-500 text-sm">
          개설 신청 상세 정보를 불러오고 있습니다...
        </p>
      </main>
    );
  }

  if (errorMessage || !detail) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-[#111827]">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-gray-200 bg-[#fbfbfb] p-8 shadow-sm">
          <p className="font-semibold text-[#E85D5D] text-sm">Teacher</p>
          <h1 className="font-bold text-3xl">개설 신청 상세 조회</h1>
          <p className="text-base text-gray-500 leading-7">
            {errorMessage || "상세 정보를 찾을 수 없습니다."}
          </p>
          <div className="flex justify-end">
            <Link
              href="/mypage"
              className="rounded-xl bg-[#1F2937] px-6 py-3 font-semibold text-sm text-white transition hover:bg-black"
            >
              마이페이지로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <section className="px-6 pt-8 pb-6 md:px-12 md:pt-10 lg:px-24 lg:pt-12 lg:pb-8">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-6">
          <div className="flex items-start gap-4 md:gap-6 lg:gap-8">
            <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[16px] bg-gray-200 md:h-[88px] md:w-[88px] md:rounded-[18px] lg:h-[104px] lg:w-[104px] lg:rounded-[20px]">
              {detail.clubImage?.trim() ? (
                <Image
                  src={detail.clubImage}
                  alt={detail.clubName}
                  fill
                  sizes="104px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1 pt-2 md:pt-3">
              <h1 className="font-semibold text-[22px] text-gray-900 md:text-[25px] lg:text-[28px]">
                {detail.clubName}
              </h1>
              <p className="text-[13px] text-gray-400 md:text-[14px] lg:text-[15px]">
                동아리 개설 신청
              </p>
              <p className="text-[13px] text-gray-400 md:text-[14px] lg:text-[15px]">
                신청 ID #{detail.applicationId}
              </p>
            </div>
          </div>

          <Link
            href="/mypage"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-[10px] border border-gray-300 bg-white px-5 font-medium text-[14px] text-gray-900 transition hover:border-gray-400 hover:bg-gray-50 md:h-11 md:text-[15px]"
          >
            마이페이지로 돌아가기
          </Link>
        </div>
      </section>

      {detail.oneLiner ? (
        <section className="flex flex-col items-center gap-4 px-6 py-6 md:px-12 md:py-8 lg:px-24 lg:py-10">
          <div className="flex w-full max-w-[1200px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 md:rounded-3xl md:px-7 md:py-3.5 lg:px-9">
            <p className="text-center text-[13px] text-gray-600 md:text-[14px] lg:text-[15px]">
              " {detail.oneLiner} "
            </p>
          </div>
        </section>
      ) : null}

      <section className="bg-gray-50 px-6 py-8 md:px-12 md:py-12 lg:px-24 lg:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:gap-12 lg:gap-16">
          <section className="grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
              <p className="text-gray-400 text-sm">신청자</p>
              <p className="mt-2 font-semibold text-gray-900">
                {detail.applicant.userName}
              </p>
              <p className="mt-1 text-gray-500 text-sm">
                {detail.applicant.classNumber}
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
              <p className="text-gray-400 text-sm">현재 상태</p>
              <p className="mt-2 font-semibold text-gray-900">
                {STATUS_LABELS[detail.status]}
              </p>
              <p className="mt-1 text-gray-500 text-sm">
                검토 차수 {detail.revision}차
              </p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white px-5 py-5 shadow-sm">
              <p className="text-gray-400 text-sm">최종 제출 시각</p>
              <p className="mt-2 font-semibold text-gray-900">
                {formatDateTime(detail.lastSubmittedAt)}
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
            <h2 className="font-bold text-gray-900 text-xl">동아리 소개</h2>
            <p className="mt-4 text-gray-700 text-sm leading-7">
              {detail.introduction}
            </p>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
            <h2 className="font-bold text-gray-900 text-xl">전공 및 링크</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {detail.majors.map((major) => (
                <span
                  key={`${detail.applicationId}-${major}`}
                  className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 font-medium text-[12px] text-primary-700"
                >
                  {major}
                </span>
              ))}
            </div>
            <div className="mt-5 space-y-3">
              {uniqueLinks.length > 0 ? (
                uniqueLinks.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block break-all text-gray-700 text-sm underline underline-offset-2 hover:text-gray-900"
                  >
                    {link}
                  </a>
                ))
              ) : (
                <p className="text-gray-500 text-sm">등록된 링크가 없습니다.</p>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
            <h2 className="font-bold text-gray-900 text-xl">개설 신청 양식</h2>
            <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              {detail.clubCreationForm ? (
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="break-all font-medium text-gray-900 text-sm md:text-base">
                      {previewFileName}
                    </p>
                    <p className="mt-1 text-[12px] text-gray-500">
                      제출된 개설 신청 양식
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsClubCreationFormPreviewOpen(true)}
                    className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50"
                  >
                    미리보기
                  </button>
                </div>
              ) : (
                <p className="text-gray-500 text-sm">
                  등록된 개설 신청 양식이 없습니다.
                </p>
              )}
            </div>
          </section>

          <ReviewSection
            title="현재 리뷰"
            reviews={currentRevisionReviews}
            emptyMessage="현재 검토 차수에 등록된 리뷰가 없습니다."
          />

          <section className="rounded-2xl border border-gray-200 bg-white px-6 py-6 shadow-sm">
            <h2 className="font-bold text-gray-900 text-xl">
              지도 교사 리뷰 저장
            </h2>
            <div className="mt-5 grid gap-3 md:grid-cols-3">
              {REVIEW_DECISION_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    setDecision(option);
                    setReviewError("");
                  }}
                  className={`rounded-2xl border px-4 py-4 text-left transition ${
                    decision === option
                      ? "border-primary-300 bg-primary-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <p className="font-semibold text-gray-900 text-sm">
                    {DECISION_LABELS[option]}
                  </p>
                  <p className="mt-2 text-gray-500 text-xs leading-6">
                    {option === "APPROVED"
                      ? "피드백 없이도 저장할 수 있습니다."
                      : "피드백을 반드시 함께 남겨야 합니다."}
                  </p>
                </button>
              ))}
            </div>

            <div className="mt-5">
              <label
                htmlFor={feedbackFieldId}
                className="mb-2 block font-medium text-gray-700 text-sm"
              >
                코멘트
              </label>
              <textarea
                id={feedbackFieldId}
                value={feedback}
                onChange={(event) => {
                  setFeedback(event.target.value);
                  if (reviewError) {
                    setReviewError("");
                  }
                }}
                rows={5}
                placeholder="학생에게 전달할 코멘트를 입력해주세요."
                className={`w-full rounded-2xl border bg-white px-4 py-4 text-sm outline-none transition placeholder:text-gray-400 ${
                  reviewError
                    ? "border-red-300"
                    : "border-gray-200 focus:border-primary-300"
                }`}
              />
              {reviewError ? (
                <p className="mt-2 text-red-500 text-xs">{reviewError}</p>
              ) : null}
            </div>

            <div className="mt-5 flex justify-end">
              <button
                type="button"
                onClick={handleOpenReviewConfirm}
                disabled={isReviewSubmitting}
                className="rounded-xl bg-primary-500 px-6 py-3 font-semibold text-sm text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isReviewSubmitting ? "저장 중..." : "리뷰 저장"}
              </button>
            </div>
          </section>

          <ReviewSection
            title="리뷰 이력"
            reviews={historicalReviews}
            emptyMessage="이전 검토 차수의 리뷰 이력이 없습니다."
          />
        </div>
      </section>

      <TeacherClubCreationPreviewModal
        fileName={previewFileName}
        isOpen={isClubCreationFormPreviewOpen}
        onClose={() => setIsClubCreationFormPreviewOpen(false)}
        pdfPath={detail.clubCreationForm}
      />
      {isReviewConfirmOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <button
            type="button"
            aria-label="리뷰 저장 확인 닫기"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsReviewConfirmOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <h2 className="font-bold text-[18px] text-gray-900">
              리뷰를 저장하시겠습니까?
            </h2>
            <p className="mt-2 text-gray-400 text-sm leading-6">
              리뷰를 저장하면 수정할 수 없습니다.
            </p>
            <div className="mt-8 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsReviewConfirmOpen(false)}
                className="rounded-[12px] bg-gray-400 px-8 py-3 font-medium text-white transition hover:bg-gray-500"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleSubmitReview}
                disabled={isReviewSubmitting}
                className="rounded-[12px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition hover:bg-[#d14d4d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
