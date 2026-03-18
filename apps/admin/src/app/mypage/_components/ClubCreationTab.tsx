import Image from "next/image";
import { useEffect, useId, useMemo, useState } from "react";
import { ManualPdfPreviewModal } from "ui";
import type {
  ClubCreationApplicationReview,
  ClubCreationReviewDecision,
  ClubCreationReviewerType,
} from "utils";
import { ClubHeader } from "@/components/common";
import { useReviewClubCreationApplicationMutation } from "@/hooks/mutations";
import {
  useGetClubCreationApplicationDetailQuery,
  useGetClubCreationApplicationsQuery,
} from "@/hooks/querys";
import { getDownloadFileName } from "@/lib";
import { toErrorMessage } from "../_lib";
import { PanelCard } from "./PanelCard";

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

const REVIEW_DECISION_OPTIONS = [
  "APPROVED",
  "CHANGES_REQUESTED",
  "REJECTED",
] as const;

const STATUS_LABELS = {
  APPROVED: "승인 완료",
  CHANGES_REQUESTED: "수정 요청",
  REJECTED: "반려",
  SUBMITTED: "제출 완료",
  UNDER_REVIEW: "검토 중",
} as const;

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

const sortReviews = (reviews: ClubCreationApplicationReview[]) =>
  [...reviews].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

function ReviewSection({
  emptyMessage,
  reviews,
  title,
}: {
  emptyMessage: string;
  reviews: ClubCreationApplicationReview[];
  title: string;
}) {
  const sortedReviews = useMemo(() => sortReviews(reviews), [reviews]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-gray-900 text-lg">{title}</h4>
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
              key={review.reviewId}
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
                  revision {review.revision}
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

export function ClubCreationTab() {
  const reviewMutation = useReviewClubCreationApplicationMutation();
  const clubCreationApplicationsQuery = useGetClubCreationApplicationsQuery();
  const feedbackFieldId = useId();
  const [isDetailOverlayOpen, setIsDetailOverlayOpen] = useState(false);
  const [selectedApplicationId, setSelectedApplicationId] = useState<
    number | null
  >(null);
  const [isClubCreationFormPreviewOpen, setIsClubCreationFormPreviewOpen] =
    useState(false);
  const [isReviewConfirmOpen, setIsReviewConfirmOpen] = useState(false);
  const [decision, setDecision] = useState<ClubCreationReviewDecision | null>(
    null,
  );
  const [feedback, setFeedback] = useState("");
  const [reviewError, setReviewError] = useState("");

  const applications = clubCreationApplicationsQuery.data ?? [];
  const selectedApplicationIdValue = selectedApplicationId
    ? String(selectedApplicationId)
    : "";
  const selectedApplicationSummary =
    applications.find(
      (application) => application.applicationId === selectedApplicationId,
    ) ?? null;
  const detailQuery = useGetClubCreationApplicationDetailQuery(
    selectedApplicationIdValue,
    isDetailOverlayOpen,
  );
  const applicationDetail = detailQuery.data;
  const previewFileName = applicationDetail?.clubCreationForm
    ? getDownloadFileName(
        `${applicationDetail.clubName} 개설 신청 양식`,
        applicationDetail.clubCreationForm,
      )
    : "";
  const currentAdminReview =
    applicationDetail?.currentReviews.find(
      (review) => review.reviewerType === "ADMIN",
    ) ?? null;
  const hasSubmittedOwnReview = currentAdminReview !== null;
  const uniqueLinks = applicationDetail
    ? [...new Set(applicationDetail.links.map((link) => link.trim()))]
        .filter(Boolean)
        .sort()
    : [];

  useEffect(() => {
    if (!applicationDetail) {
      return;
    }

    setDecision(currentAdminReview?.decision ?? null);
    setFeedback(currentAdminReview?.feedback ?? "");
    setReviewError("");
  }, [
    applicationDetail,
    currentAdminReview?.decision,
    currentAdminReview?.feedback,
  ]);

  useEffect(() => {
    if (!applicationDetail?.clubCreationForm) {
      setIsClubCreationFormPreviewOpen(false);
    }
  }, [applicationDetail?.clubCreationForm]);

  useEffect(() => {
    if (!isDetailOverlayOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDetailOverlayOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDetailOverlayOpen]);

  const handleOpenDetailOverlay = (applicationId: number) => {
    setSelectedApplicationId(applicationId);
    setIsDetailOverlayOpen(true);
  };

  const handleCloseDetailOverlay = () => {
    setIsDetailOverlayOpen(false);
    setSelectedApplicationId(null);
    setIsClubCreationFormPreviewOpen(false);
    setIsReviewConfirmOpen(false);
    setReviewError("");
  };

  const validateReviewForm = () => {
    if (!selectedApplicationId) {
      return false;
    }

    if (hasSubmittedOwnReview) {
      setReviewError(
        "리뷰는 1회만 작성 가능하며 저장 후 수정할 수 없습니다.",
      );
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
    if (!selectedApplicationId || decision === null || hasSubmittedOwnReview) {
      setIsReviewConfirmOpen(false);
      return;
    }

    const normalizedFeedback = feedback.trim();

    try {
      await reviewMutation.mutateAsync({
        applicationId: String(selectedApplicationId),
        payload: {
          decision,
          feedback: normalizedFeedback || undefined,
        },
      });
      await detailQuery.refetch();
      setReviewError("");
    } catch {} finally {
      setIsReviewConfirmOpen(false);
    }
  };

  return (
    <>
      <PanelCard
        title="동아리 개설 신청 검토"
        description="접수된 개설 신청을 확인하고 관리자 리뷰를 저장합니다."
      >
        {clubCreationApplicationsQuery.isLoading ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-5 text-gray-500 text-sm">
            개설 신청 목록을 불러오는 중입니다...
          </div>
        ) : null}

        {clubCreationApplicationsQuery.isError ? (
          <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-5 text-red-700 text-sm">
            {toErrorMessage(
              clubCreationApplicationsQuery.error,
              "동아리 개설 신청 목록을 불러오지 못했습니다.",
            )}
          </div>
        ) : null}

        {!clubCreationApplicationsQuery.isLoading &&
        !clubCreationApplicationsQuery.isError &&
        applications.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 border-dashed bg-gray-50 px-5 py-6 text-gray-500 text-sm">
            현재 검토할 동아리 개설 신청이 없습니다.
          </div>
        ) : null}

        {!clubCreationApplicationsQuery.isLoading &&
        !clubCreationApplicationsQuery.isError &&
        applications.length > 0 ? (
          <div className="space-y-3">
            {applications.map((application) => (
              <button
                key={application.applicationId}
                type="button"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-5 text-left transition hover:border-gray-300 hover:bg-white"
                onClick={() =>
                  handleOpenDetailOverlay(application.applicationId)
                }
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
                  <div className="flex items-start gap-4">
                    <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                      {application.clubImage ? (
                        <Image
                          src={application.clubImage}
                          alt={application.clubName}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                          이미지 없음
                        </div>
                      )}
                    </div>

                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold text-base text-gray-900">
                          {application.clubName}
                        </p>
                        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 font-medium text-[12px] text-gray-600">
                          #{application.applicationId}
                        </span>
                        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 font-medium text-[12px] text-gray-600">
                          {STATUS_LABELS[application.status]}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-500 text-sm">
                        신청자 {application.applicantName} · revision{" "}
                        {application.revision}
                      </p>
                      <p className="mt-1 text-gray-400 text-xs">
                        최종 제출 {formatDateTime(application.lastSubmittedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {application.majors.map((major) => (
                      <span
                        key={`${application.applicationId}-${major}`}
                        className="rounded-full border border-gray-300 bg-white px-2.5 py-1 text-[11px] text-gray-600"
                      >
                        {major}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : null}
      </PanelCard>

      {isDetailOverlayOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="상세 조회 오버레이 닫기"
            className="pointer-events-auto absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseDetailOverlay}
          />
          <div className="pointer-events-none relative h-full overflow-y-auto">
            <div className="flex min-h-full items-start justify-center px-4 py-8 md:px-6">
              <section
                role="dialog"
                aria-modal="true"
                className="pointer-events-auto relative z-10 w-full max-w-5xl overflow-hidden rounded-[12px] bg-white shadow-2xl"
              >
                <div className="relative border-gray-100 border-b">
                  <ClubHeader
                    clubImage={
                      applicationDetail?.clubImage ??
                      selectedApplicationSummary?.clubImage ??
                      ""
                    }
                    clubName={
                      applicationDetail?.clubName ??
                      selectedApplicationSummary?.clubName ??
                      ""
                    }
                    title={
                      applicationDetail?.clubName ??
                      selectedApplicationSummary?.clubName ??
                      "상세 정보를 불러오는 중..."
                    }
                    subtitle="동아리 개설 신청"
                    metaText={`신청 ID #${selectedApplicationId ?? "-"}`}
                    oneLiner={applicationDetail?.oneLiner}
                  />
                  <button
                    type="button"
                    aria-label="상세 조회 닫기"
                    className="absolute top-6 right-6 flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white/90 text-gray-500 text-xl transition hover:bg-gray-50 hover:text-gray-700"
                    onClick={handleCloseDetailOverlay}
                  >
                    ×
                  </button>
                </div>

                <div className="bg-gray-50 px-6 py-8 md:px-10 md:py-10">
                  {detailQuery.isPending ? (
                    <div className="rounded-2xl border border-gray-200 bg-white px-6 py-12 text-center text-gray-500 text-sm">
                      상세 정보를 불러오는 중...
                    </div>
                  ) : null}

                  {detailQuery.isError ? (
                    <div className="rounded-2xl border border-red-100 bg-red-50 px-6 py-12 text-center text-red-700 text-sm">
                      {toErrorMessage(
                        detailQuery.error,
                        "상세 정보를 불러오지 못했습니다.",
                      )}
                    </div>
                  ) : null}

                  {applicationDetail ? (
                    <div className="space-y-8">
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="rounded-2xl bg-white px-5 py-5 shadow-sm">
                          <p className="text-gray-400 text-sm">신청자</p>
                          <p className="mt-2 font-semibold text-gray-900">
                            {applicationDetail.applicant.userName}
                          </p>
                          <p className="mt-1 text-gray-500 text-sm">
                            {applicationDetail.applicant.classNumber}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white px-5 py-5 shadow-sm">
                          <p className="text-gray-400 text-sm">현재 상태</p>
                          <p className="mt-2 font-semibold text-gray-900">
                            {STATUS_LABELS[applicationDetail.status]}
                          </p>
                          <p className="mt-1 text-gray-500 text-sm">
                            revision {applicationDetail.revision}
                          </p>
                        </div>
                        <div className="rounded-2xl bg-white px-5 py-5 shadow-sm">
                          <p className="text-gray-400 text-sm">
                            최종 제출 시각
                          </p>
                          <p className="mt-2 font-semibold text-gray-900">
                            {formatDateTime(applicationDetail.lastSubmittedAt)}
                          </p>
                        </div>
                      </div>

                      <section className="rounded-2xl bg-white px-6 py-6 shadow-sm">
                        <h4 className="font-bold text-gray-900 text-lg">
                          동아리 소개
                        </h4>
                        <p className="mt-4 text-gray-700 text-sm leading-7">
                          {applicationDetail.introduction}
                        </p>
                      </section>

                      <section className="rounded-2xl bg-white px-6 py-6 shadow-sm">
                        <h4 className="font-bold text-gray-900 text-lg">
                          전공 및 링크
                        </h4>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {applicationDetail.majors.map((major) => (
                            <span
                              key={`${applicationDetail.applicationId}-${major}`}
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
                            <p className="text-gray-500 text-sm">
                              등록된 링크가 없습니다.
                            </p>
                          )}
                        </div>
                      </section>

                      <section className="rounded-2xl bg-white px-6 py-6 shadow-sm">
                        <h4 className="font-bold text-gray-900 text-lg">
                          개설 신청 양식
                        </h4>
                        <div className="mt-4 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
                          {applicationDetail.clubCreationForm ? (
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
                                onClick={() =>
                                  setIsClubCreationFormPreviewOpen(true)
                                }
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
                        reviews={applicationDetail.currentReviews}
                        emptyMessage="현재 revision에 등록된 리뷰가 없습니다."
                      />

                      <section className="rounded-2xl bg-white px-6 py-6 shadow-sm">
                        <h4 className="font-bold text-gray-900 text-lg">
                          관리자 리뷰 저장
                        </h4>
                        {hasSubmittedOwnReview ? (
                          <div className="mt-5 space-y-4">
                            <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-4 text-gray-600 text-sm leading-6">
                              리뷰는 1회만 작성 가능하며 저장 후 수정할 수 없습니다.
                            </div>
                            <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-5">
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`rounded-full border px-3 py-1 font-medium text-[12px] ${DECISION_STYLES[currentAdminReview.decision]}`}
                                >
                                  {DECISION_LABELS[currentAdminReview.decision]}
                                </span>
                              </div>
                              <div className="mt-4 rounded-xl bg-white px-4 py-4 text-gray-700 text-sm leading-7">
                                {currentAdminReview.feedback?.trim()
                                  ? currentAdminReview.feedback
                                  : "남겨진 코멘트가 없습니다."}
                              </div>
                            </div>
                          </div>
                        ) : (
                          <>
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
                                className={`w-full rounded-2xl border bg-white px-4 py-4 text-sm outline-none placeholder:text-gray-400 transition ${
                                  reviewError
                                    ? "border-red-300"
                                    : "border-gray-200 focus:border-primary-300"
                                }`}
                              />
                              {reviewError ? (
                                <p className="mt-2 text-red-500 text-xs">
                                  {reviewError}
                                </p>
                              ) : null}
                            </div>

                            <div className="mt-5 flex justify-end">
                              <button
                                type="button"
                                onClick={handleOpenReviewConfirm}
                                disabled={reviewMutation.isPending}
                                className="rounded-xl bg-primary-500 px-6 py-3 font-semibold text-sm text-white transition hover:bg-primary-600 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                {reviewMutation.isPending
                                  ? "저장 중..."
                                  : "리뷰 저장"}
                              </button>
                            </div>
                          </>
                        )}
                      </section>

                      <ReviewSection
                        title="리뷰 이력"
                        reviews={applicationDetail.reviewHistory}
                        emptyMessage="과거 revision 리뷰 이력이 없습니다."
                      />
                    </div>
                  ) : null}
                </div>
              </section>
            </div>
          </div>
        </div>
      ) : null}

      <ManualPdfPreviewModal
        fileName={previewFileName}
        isOpen={isClubCreationFormPreviewOpen}
        onClose={() => setIsClubCreationFormPreviewOpen(false)}
        pdfPath={applicationDetail?.clubCreationForm ?? null}
      />
      {isReviewConfirmOpen ? (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <button
            type="button"
            aria-label="리뷰 저장 확인 닫기"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setIsReviewConfirmOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative z-10 w-[90%] max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <h5 className="font-bold text-[18px] text-gray-900">
              리뷰를 저장하시겠습니까?
            </h5>
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
                disabled={reviewMutation.isPending}
                className="rounded-[12px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition hover:bg-[#d14d4d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
