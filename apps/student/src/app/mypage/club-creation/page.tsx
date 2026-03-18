"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Button, ManualPdfPreviewModal } from "ui";
import type {
  ClubCreationApplicationReview,
  ClubCreationApplicationStatus,
  ClubCreationReviewDecision,
  ClubCreationReviewerType,
} from "utils";
import { getDocumentDownloadFileName, getDocumentFileExtensionLabel } from "utils";
import { useGetMyClubCreationApplicationQuery } from "@/hooks/querys";

const STATUS_LABELS: Record<ClubCreationApplicationStatus, string> = {
  SUBMITTED: "제출 완료",
  UNDER_REVIEW: "검토 중",
  CHANGES_REQUESTED: "수정 요청",
  APPROVED: "승인 완료",
  REJECTED: "반려",
};

const STATUS_STYLES: Record<
  ClubCreationApplicationStatus,
  { badge: string; panel: string; title: string; description: string }
> = {
  SUBMITTED: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    panel: "border-blue-100 bg-blue-50/70",
    title: "신청서가 정상적으로 제출되었습니다.",
    description: "관리자와 지도 교사의 검토가 모두 끝날 때까지 기다려 주세요.",
  },
  UNDER_REVIEW: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    panel: "border-blue-100 bg-blue-50/70",
    title: "현재 신청서가 검토 중입니다.",
    description: "일부 리뷰가 등록되었을 수 있으며, 최종 상태는 아직 확정되지 않았습니다.",
  },
  CHANGES_REQUESTED: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    panel: "border-amber-100 bg-amber-50/80",
    title: "수정 요청이 도착했습니다.",
    description: "현재 리뷰를 확인한 뒤 신청서를 수정하고 다시 제출해 주세요.",
  },
  APPROVED: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    panel: "border-emerald-100 bg-emerald-50/80",
    title: "개설 신청이 승인되었습니다.",
    description: "관리자와 지도 교사의 승인이 모두 완료되어 기존 개설 성공 흐름으로 이어집니다.",
  },
  REJECTED: {
    badge: "border-red-200 bg-red-50 text-red-700",
    panel: "border-red-100 bg-red-50/80",
    title: "개설 신청이 반려되었습니다.",
    description: "현재 revision의 검토 결과를 확인해 주세요. 이 신청은 더 이상 재제출할 수 없습니다.",
  },
};

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

const sortReviews = (reviews: ClubCreationApplicationReview[]) => {
  return [...reviews].sort((a, b) => {
    return (
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  });
};

function ReviewSection({
  highlightChangesRequested = false,
  reviews,
  title,
  emptyMessage,
}: {
  emptyMessage: string;
  highlightChangesRequested?: boolean;
  reviews: ClubCreationApplicationReview[];
  title: string;
}) {
  const sortedReviews = useMemo(() => sortReviews(reviews), [reviews]);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-xl text-gray-900">{title}</h2>
        <span className="text-gray-400 text-sm">
          {sortedReviews.length}건
        </span>
      </div>

      {sortedReviews.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-gray-50 px-5 py-6 text-gray-500 text-sm">
          {emptyMessage}
        </div>
      ) : (
        <div className="space-y-4">
          {sortedReviews.map((review) => {
            const shouldHighlight =
              highlightChangesRequested &&
              review.decision === "CHANGES_REQUESTED";

            return (
              <article
                key={review.reviewId}
                className={`rounded-2xl border bg-white px-5 py-5 shadow-sm ${
                  shouldHighlight
                    ? "border-amber-300 ring-2 ring-amber-100"
                    : "border-gray-200"
                }`}
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

                <div
                  className={`mt-4 rounded-xl px-4 py-4 text-sm leading-7 ${
                    shouldHighlight
                      ? "bg-amber-50 text-amber-900"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  {review.feedback?.trim()
                    ? review.feedback
                    : "남겨진 코멘트가 없습니다."}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function ClubCreationApplicationDetailPage() {
  const myApplicationQuery = useGetMyClubCreationApplicationQuery();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  if (myApplicationQuery.isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-gray-500 text-sm">
          내 개설 신청 정보를 불러오고 있습니다...
        </p>
      </div>
    );
  }

  if (myApplicationQuery.isError) {
    return (
      <div className="min-h-screen bg-white px-6 py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-gray-200 bg-gray-50 px-8 py-10 text-center">
          <h1 className="font-bold text-3xl text-gray-900">
            아직 개설 신청이 없습니다
          </h1>
          <p className="mt-4 text-gray-500 text-sm leading-6">
            동아리 개설 신청서를 새로 작성해 제출하면 이 화면에서 상태와 리뷰를
            확인할 수 있습니다.
          </p>
          <Link
            href="/clubs/create"
            className="mt-8 inline-flex rounded-xl bg-primary-500 px-6 py-3 font-semibold text-sm text-white transition hover:bg-primary-600"
          >
            개설 신청 작성하기
          </Link>
        </div>
      </div>
    );
  }

  const application = myApplicationQuery.data;
  const statusConfig = STATUS_STYLES[application.status];
  const previewFileName = application.clubCreationForm
    ? getDocumentDownloadFileName(
        `${application.clubName} 개설 신청 양식`,
        application.clubCreationForm,
      )
    : "";
  const previewFileExtensionLabel = application.clubCreationForm
    ? getDocumentFileExtensionLabel(
        `${application.clubName} 개설 신청 양식`,
        application.clubCreationForm,
      )
    : "PDF";

  return (
    <div className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1000px] px-6 py-16">
        <div className="mb-8 flex items-center gap-2 text-gray-400 text-sm">
          <Link href="/mypage" className="hover:text-gray-600">
            마이페이지
          </Link>
          <span>&gt;</span>
          <span className="text-gray-600">내 개설 신청</span>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="font-extrabold text-3xl tracking-tight">
              내 개설 신청
            </h1>
            <p className="mt-3 text-gray-500 text-sm">
              신청 상태와 현재 리뷰를 한 곳에서 확인할 수 있습니다.
            </p>
          </div>
          <span
            className={`inline-flex w-fit rounded-full border px-4 py-2 font-semibold text-sm ${statusConfig.badge}`}
          >
            {STATUS_LABELS[application.status]}
          </span>
        </div>

        <section
          className={`mt-8 rounded-3xl border px-6 py-6 ${statusConfig.panel}`}
        >
          <h2 className="font-bold text-xl text-gray-900">
            {statusConfig.title}
          </h2>
          <p className="mt-3 text-gray-600 text-sm leading-7">
            {statusConfig.description}
          </p>
          {application.status === "CHANGES_REQUESTED" ? (
            <div className="mt-5">
              <Link href="/mypage/club-creation/edit">
                <Button className="rounded-xl bg-primary-500 px-5 py-3 font-semibold text-sm text-white hover:bg-primary-600">
                  수정 후 다시 제출하기
                </Button>
              </Link>
            </div>
          ) : null}
        </section>

        <div className="mt-10 space-y-10">
          <ReviewSection
            title="현재 리뷰"
            reviews={application.currentReviews}
            emptyMessage="아직 현재 revision에 등록된 리뷰가 없습니다."
            highlightChangesRequested={application.status === "CHANGES_REQUESTED"}
          />

          <section className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-5 md:flex-row md:items-start">
              <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-gray-100">
                {application.clubImage ? (
                  <Image
                    src={application.clubImage}
                    alt={application.clubName}
                    fill
                    className="object-cover"
                    sizes="96px"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gray-100 font-semibold text-gray-400 text-sm">
                    No Image
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <h2 className="font-bold text-2xl text-gray-900">
                    {application.clubName}
                  </h2>
                  <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-[12px] text-gray-500">
                    revision {application.revision}
                  </span>
                </div>
                <p className="mt-3 text-gray-600 text-sm leading-7">
                  {application.oneLiner}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {application.majors.map((major) => (
                    <span
                      key={major}
                      className="rounded-full border border-primary-200 bg-primary-50 px-3 py-1 font-medium text-[12px] text-primary-700"
                    >
                      {major}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl bg-gray-50 px-5 py-4">
                <p className="text-gray-400 text-sm">신청자</p>
                <p className="mt-2 font-semibold text-gray-900">
                  {application.applicant.userName}
                </p>
                <p className="mt-1 text-gray-500 text-sm">
                  {application.applicant.classNumber}
                </p>
              </div>
              <div className="rounded-2xl bg-gray-50 px-5 py-4">
                <p className="text-gray-400 text-sm">최종 제출 시각</p>
                <p className="mt-2 font-semibold text-gray-900">
                  {formatDateTime(application.lastSubmittedAt)}
                </p>
                <p className="mt-1 text-gray-500 text-sm">
                  최초 제출: {formatDateTime(application.submittedAt)}
                </p>
              </div>
            </div>

            <div className="mt-8 space-y-6">
              <section>
                <h3 className="font-bold text-lg text-gray-900">동아리 소개</h3>
                <div className="mt-3 rounded-2xl bg-gray-50 px-5 py-5 text-gray-700 text-sm leading-7">
                  {application.introduction}
                </div>
              </section>

              <section>
                <h3 className="font-bold text-lg text-gray-900">
                  동아리 관련 링크
                </h3>
                <div className="mt-3 rounded-2xl bg-gray-50 px-5 py-5">
                  {application.links.length > 0 ? (
                    <div className="space-y-3">
                      {application.links.map((link) => (
                        <a
                          key={link}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block break-all text-gray-700 text-sm underline underline-offset-2 hover:text-gray-900"
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      등록된 링크가 없습니다.
                    </p>
                  )}
                </div>
              </section>

              <section>
                <h3 className="font-bold text-lg text-gray-900">
                  개설 신청 양식
                </h3>
                <div className="mt-3 rounded-2xl bg-gray-50 px-5 py-5">
                  {application.clubCreationForm ? (
                    <article className="rounded-2xl border border-gray-200 bg-white px-4 py-4">
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white font-semibold text-[11px] text-gray-700">
                            {previewFileExtensionLabel}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="break-all font-medium text-gray-900 text-sm md:text-base">
                              {previewFileName}
                            </p>
                            <p className="mt-1 text-[12px] text-gray-500">
                              제출된 개설 신청 양식
                            </p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setIsPreviewOpen(true)}
                          className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50"
                        >
                          미리보기
                        </button>
                      </div>
                    </article>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      제출된 개설 신청 양식이 없습니다.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </section>

          <ReviewSection
            title="리뷰 이력"
            reviews={application.reviewHistory}
            emptyMessage="과거 revision 리뷰 이력이 아직 없습니다."
          />
        </div>
      </div>

      <ManualPdfPreviewModal
        fileName={previewFileName}
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfPath={application.clubCreationForm}
      />
    </div>
  );
}
