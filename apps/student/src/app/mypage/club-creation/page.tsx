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
import {
  getDocumentDownloadFileName,
  getDocumentFileExtensionLabel,
  resolveClubCreationApplicationStatus,
} from "utils";
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
  {
    badge: string;
    panel: string;
    title: string;
    description: string;
    timelineAccent: string;
  }
> = {
  SUBMITTED: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    panel: "border-blue-200 bg-[#f6f8ff]",
    title: "신청서가 정상적으로 제출되었습니다.",
    description: "관리자와 지도 교사의 검토가 모두 끝날 때까지 기다려 주세요.",
    timelineAccent: "border-blue-200 bg-blue-50 text-blue-700",
  },
  UNDER_REVIEW: {
    badge: "border-blue-200 bg-blue-50 text-blue-700",
    panel: "border-blue-200 bg-[#f6f8ff]",
    title: "현재 신청서가 검토 중입니다.",
    description:
      "일부 리뷰가 등록되었을 수 있으며, 최종 상태는 아직 확정되지 않았습니다.",
    timelineAccent: "border-blue-200 bg-blue-50 text-blue-700",
  },
  CHANGES_REQUESTED: {
    badge: "border-amber-200 bg-amber-50 text-amber-700",
    panel: "border-amber-200 bg-[#fff8ef]",
    title: "수정 요청이 도착했습니다.",
    description:
      "수정 요청된 의견을 반영해 신청서를 수정하고 다시 제출해 주세요. 이미 승인된 리뷰는 유지될 수 있습니다.",
    timelineAccent: "border-amber-200 bg-amber-50 text-amber-800",
  },
  APPROVED: {
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
    panel: "border-emerald-200 bg-[#f4fbf6]",
    title: "개설 신청이 승인되었습니다.",
    description: "관리자와 지도 교사의 최신 승인 결과가 모두 반영되었습니다.",
    timelineAccent: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  REJECTED: {
    badge: "border-red-200 bg-red-50 text-red-700",
    panel: "border-red-200 bg-[#fff6f6]",
    title: "개설 신청이 반려되었습니다.",
    description:
      "현재 검토 차수의 결과를 확인해 주세요. 이 신청은 더 이상 재제출할 수 없습니다.",
    timelineAccent: "border-red-200 bg-red-50 text-red-700",
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
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
};

const getReviewRenderKey = (review: ClubCreationApplicationReview) => {
  return [
    review.revision,
    review.reviewId,
    review.reviewerType,
    review.updatedAt,
  ].join(":");
};

const dedupeReviews = (reviews: ClubCreationApplicationReview[]) => {
  const seenKeys = new Set<string>();

  return reviews.filter((review) => {
    const reviewKey = getReviewRenderKey(review);

    if (seenKeys.has(reviewKey)) {
      return false;
    }

    seenKeys.add(reviewKey);
    return true;
  });
};

const REVIEWER_ACCENT_STYLES: Record<ClubCreationReviewerType, string> = {
  ADMIN: "border-violet-200 bg-violet-50 text-violet-700",
  TEACHER: "border-sky-200 bg-sky-50 text-sky-700",
};

const getReviewerInitial = (reviewerType: ClubCreationReviewerType) => {
  return REVIEWER_LABELS[reviewerType].slice(0, 1);
};

function SidebarCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-gray-200 border-b bg-[#f6f8fa] px-4 py-3">
        <h2 className="font-semibold text-[14px] text-gray-900">{title}</h2>
      </div>
      <div className="px-4 py-4">{children}</div>
    </section>
  );
}

function DetailSection({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="px-6 py-6">
      <div className="mb-3 flex items-center gap-2">
        <span className="inline-flex h-2 w-2 rounded-full bg-gray-300" />
        <h2 className="font-semibold text-[15px] text-gray-900">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ReviewTimelineSection({
  highlightChangesRequested = false,
  highlightedReviewKeys = [],
  reviews,
  title,
  emptyMessage,
}: {
  emptyMessage: string;
  highlightChangesRequested?: boolean;
  highlightedReviewKeys?: string[];
  reviews: ClubCreationApplicationReview[];
  title: string;
}) {
  const sortedReviews = useMemo(() => sortReviews(reviews), [reviews]);
  const highlightedReviewKeySet = useMemo(
    () => new Set(highlightedReviewKeys),
    [highlightedReviewKeys],
  );

  return (
    <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-gray-200 border-b bg-[#f6f8fa] px-5 py-4">
        <div>
          <h2 className="font-semibold text-[15px] text-gray-900">{title}</h2>
          <p className="mt-1 text-[13px] text-gray-500">
            리뷰 코멘트를 시간순으로 확인할 수 있습니다.
          </p>
        </div>
        <span className="rounded-full border border-gray-200 bg-white px-3 py-1 font-medium text-[12px] text-gray-600">
          {sortedReviews.length}건
        </span>
      </div>

      <div className="px-5 py-5">
        {sortedReviews.length === 0 ? (
          <div className="rounded-lg border border-gray-200 border-dashed bg-[#f6f8fa] px-4 py-5 text-[14px] text-gray-500">
            {emptyMessage}
          </div>
        ) : (
          <div className="space-y-0">
            {sortedReviews.map((review, index) => {
              const reviewKey = getReviewRenderKey(review);
              const shouldHighlight =
                highlightChangesRequested &&
                highlightedReviewKeySet.has(reviewKey) &&
                review.decision === "CHANGES_REQUESTED";

              return (
                <article
                  key={reviewKey}
                  className={`relative pl-16 ${
                    index === sortedReviews.length - 1 ? "" : "pb-6"
                  }`}
                >
                  {index !== sortedReviews.length - 1 ? (
                    <span className="absolute top-11 bottom-0 left-5 w-px bg-gray-200" />
                  ) : null}

                  <div
                    className={`absolute top-0 left-0 flex h-10 w-10 items-center justify-center rounded-full border bg-white font-semibold text-[13px] shadow-sm ${
                      REVIEWER_ACCENT_STYLES[review.reviewerType]
                    }`}
                  >
                    {getReviewerInitial(review.reviewerType)}
                  </div>

                  <div
                    className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
                      shouldHighlight ? "border-amber-300" : "border-gray-200"
                    }`}
                  >
                    <div
                      className={`flex flex-wrap items-center gap-2 border-b px-4 py-3 text-[13px] ${
                        shouldHighlight
                          ? "border-amber-200 bg-[#fff8ef]"
                          : "border-gray-200 bg-[#f6f8fa]"
                      }`}
                    >
                      <span className="font-semibold text-gray-900">
                        {review.reviewerName}
                      </span>
                      <span className="text-gray-500">
                        님이 코멘트를 남겼습니다
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="text-gray-500">
                        {formatDateTime(review.updatedAt)}
                      </span>
                      <span
                        className={`ml-auto rounded-full border px-2.5 py-1 font-semibold text-[11px] ${DECISION_STYLES[review.decision]}`}
                      >
                        {DECISION_LABELS[review.decision]}
                      </span>
                      <span className="rounded-full border border-gray-200 bg-white px-2.5 py-1 font-medium text-[11px] text-gray-600">
                        검토 차수 {review.revision}차
                      </span>
                    </div>

                    <div
                      className={`px-4 py-4 text-[14px] leading-7 ${
                        shouldHighlight
                          ? "bg-amber-50/40 text-amber-950"
                          : "text-gray-700"
                      }`}
                    >
                      {review.feedback?.trim() ? (
                        <p className="whitespace-pre-line">{review.feedback}</p>
                      ) : (
                        <p className="text-gray-400 italic">
                          남겨진 코멘트가 없습니다.
                        </p>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
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
  const resolvedStatus = resolveClubCreationApplicationStatus(application);
  const statusConfig = STATUS_STYLES[resolvedStatus];
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
  const combinedReviews = [
    ...application.currentReviews,
    ...application.reviewHistory,
  ];
  const dedupedReviews = dedupeReviews(combinedReviews);

  return (
    <div className="min-h-screen bg-white font-sans text-[#1f2328] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-10 lg:py-12">
        <div className="mb-6 flex items-center gap-2 text-[13px] text-gray-500">
          <Link href="/mypage" className="hover:text-gray-600">
            마이페이지
          </Link>
          <span>&gt;</span>
          <span className="text-gray-600">내 개설 신청</span>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span
                className={`inline-flex rounded-full border px-3 py-1 font-semibold text-[12px] ${statusConfig.badge}`}
              >
                {STATUS_LABELS[resolvedStatus]}
              </span>
              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 font-medium text-[12px] text-gray-600">
                검토 차수 {application.revision}차
              </span>
            </div>
            <h1 className="font-bold text-[32px] tracking-tight">
              내 개설 신청
            </h1>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="space-y-6">
            <section
              className={`overflow-hidden rounded-xl border shadow-sm ${statusConfig.panel}`}
            >
              <div className="border-gray-200/80 border-b bg-white/70 px-6 py-5">
                <div className="flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 font-semibold text-[12px] ${statusConfig.timelineAccent}`}
                  >
                    {STATUS_LABELS[resolvedStatus]}
                  </span>
                  <p className="font-semibold text-[15px] text-gray-900">
                    {statusConfig.title}
                  </p>
                </div>
                <p className="mt-3 max-w-3xl text-[14px] text-gray-600 leading-7">
                  {statusConfig.description}
                </p>
              </div>
            </section>

            <section className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-gray-200 border-b bg-[#f6f8fa] px-6 py-5">
                <div className="flex flex-col gap-5 md:flex-row md:items-start">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-white">
                    {application.clubImage ? (
                      <Image
                        src={application.clubImage}
                        alt={application.clubName}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-semibold text-[12px] text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="truncate font-semibold text-[26px] text-gray-900">
                        {application.clubName}
                      </h2>
                      <span className="rounded-md border border-gray-200 bg-white px-2.5 py-1 font-medium text-[12px] text-gray-600">
                        검토 차수 {application.revision}차
                      </span>
                    </div>
                    <p className="mt-3 text-[15px] text-gray-600 leading-7">
                      {application.oneLiner}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {application.majors.map((major) => (
                        <span
                          key={major}
                          className="rounded-full border border-gray-200 bg-white px-3 py-1 font-medium text-[12px] text-gray-700"
                        >
                          {major}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="divide-y divide-gray-200">
                <DetailSection title="동아리 소개">
                  <div className="rounded-lg border border-gray-200 bg-white px-4 py-4 text-[14px] text-gray-700 leading-7">
                    <p className="whitespace-pre-line">
                      {application.introduction}
                    </p>
                  </div>
                </DetailSection>

                <DetailSection title="동아리 관련 링크">
                  {application.links.length > 0 ? (
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                      {application.links.map((link, index) => (
                        <a
                          key={link}
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex items-center gap-3 bg-white px-4 py-3 text-[#0969da] text-[14px] transition hover:bg-[#f6f8fa] hover:text-[#0550ae] ${
                            index === 0 ? "" : "border-gray-200 border-t"
                          }`}
                        >
                          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-gray-200 bg-[#f6f8fa] font-semibold text-[11px] text-gray-600">
                            URL
                          </span>
                          <span className="min-w-0 break-all">{link}</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-gray-200 border-dashed bg-[#f6f8fa] px-4 py-5 text-[14px] text-gray-500">
                      등록된 링크가 없습니다.
                    </div>
                  )}
                </DetailSection>

                <DetailSection title="개설 신청 양식">
                  {application.clubCreationForm ? (
                    <article className="rounded-lg border border-gray-200 bg-white">
                      <div className="flex flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex min-w-0 items-center gap-4">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-[#f6f8fa] font-semibold text-[11px] text-gray-700">
                            {previewFileExtensionLabel}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="break-all font-medium text-[14px] text-gray-900 md:text-[15px]">
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
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 font-semibold text-[14px] text-gray-900 transition hover:border-gray-400 hover:bg-[#f6f8fa]"
                        >
                          미리보기
                        </button>
                      </div>
                    </article>
                  ) : (
                    <div className="rounded-lg border border-gray-200 border-dashed bg-[#f6f8fa] px-4 py-5 text-[14px] text-gray-500">
                      제출된 개설 신청 양식이 없습니다.
                    </div>
                  )}
                </DetailSection>
              </div>
            </section>

            <ReviewTimelineSection
              title="리뷰 이력"
              reviews={dedupedReviews}
              emptyMessage="등록된 리뷰가 아직 없습니다."
              highlightChangesRequested={resolvedStatus === "CHANGES_REQUESTED"}
              highlightedReviewKeys={application.currentReviews.map(
                getReviewRenderKey,
              )}
            />
          </main>

          <aside className="space-y-4">
            <SidebarCard title="신청 메타데이터">
              <div className="space-y-4 text-[14px]">
                <div>
                  <p className="font-medium text-[12px] text-gray-400">상태</p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex rounded-full border px-3 py-1 font-semibold text-[12px] ${statusConfig.badge}`}
                    >
                      {STATUS_LABELS[resolvedStatus]}
                    </span>
                  </div>
                </div>

                <div className="border-gray-200 border-t pt-4">
                  <p className="font-medium text-[12px] text-gray-400">
                    신청자
                  </p>
                  <p className="mt-2 font-semibold text-gray-900">
                    {application.applicant.userName}
                  </p>
                  <p className="mt-1 text-gray-500">
                    {application.applicant.classNumber}
                  </p>
                </div>

                <div className="border-gray-200 border-t pt-4">
                  <p className="font-medium text-[12px] text-gray-400">
                    제출 시각
                  </p>
                  <p className="mt-2 font-medium text-gray-900">
                    {formatDateTime(application.lastSubmittedAt)}
                  </p>
                  <p className="mt-1 text-[13px] text-gray-500">
                    최초 제출: {formatDateTime(application.submittedAt)}
                  </p>
                </div>

                <div className="border-gray-200 border-t pt-4">
                  <p className="font-medium text-[12px] text-gray-400">
                    리뷰 현황
                  </p>
                  <div className="mt-2">
                    <div className="rounded-lg border border-gray-200 bg-[#f6f8fa] px-3 py-3">
                      <p className="text-[12px] text-gray-500">리뷰 이력</p>
                      <p className="mt-1 font-semibold text-gray-900">
                        {dedupedReviews.length}건
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </SidebarCard>

            {resolvedStatus === "CHANGES_REQUESTED" ? (
              <SidebarCard title="다음 단계">
                <p className="text-[14px] text-gray-600 leading-7">
                  수정 요청된 리뷰를 확인한 뒤 신청서를 수정하고 다시
                  제출하세요.
                </p>
                <Link href="/mypage/club-creation/edit" className="mt-4 block">
                  <Button className="w-full rounded-lg border border-[#1f6feb]/20 bg-[#1f6feb] px-4 py-2.5 font-semibold text-[14px] text-white hover:bg-[#1a63d8]">
                    수정 후 다시 제출하기
                  </Button>
                </Link>
              </SidebarCard>
            ) : null}
          </aside>
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
