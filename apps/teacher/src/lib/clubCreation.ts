import type {
  ClubCreationReviewDecision,
  ClubCreationReviewerType,
  TeacherClubCreationApplication,
  TeacherClubCreationReview,
} from "@/types/teacher";

export const TEACHER_REVIEWER_LABELS: Record<ClubCreationReviewerType, string> =
  {
    ADMIN: "관리자",
    TEACHER: "지도 교사",
  };

export const TEACHER_DECISION_LABELS: Record<
  ClubCreationReviewDecision,
  string
> = {
  APPROVED: "승인",
  CHANGES_REQUESTED: "수정 요청",
  REJECTED: "반려",
};

export const TEACHER_DECISION_STYLES: Record<
  ClubCreationReviewDecision,
  string
> = {
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CHANGES_REQUESTED: "border-amber-200 bg-amber-50 text-amber-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
};

export const TEACHER_STATUS_LABELS = {
  APPROVED: "승인 완료",
  CHANGES_REQUESTED: "수정 요청",
  REJECTED: "반려",
  SUBMITTED: "제출 완료",
  UNDER_REVIEW: "검토 중",
} as const;

export const TEACHER_STATUS_STYLES = {
  APPROVED: "border-emerald-200 bg-emerald-50 text-emerald-700",
  CHANGES_REQUESTED: "border-amber-200 bg-amber-50 text-amber-700",
  REJECTED: "border-red-200 bg-red-50 text-red-700",
  SUBMITTED: "border-blue-200 bg-blue-50 text-blue-700",
  UNDER_REVIEW: "border-sky-200 bg-sky-50 text-sky-700",
} as const;

export const TEACHER_REVIEW_DECISION_OPTIONS = [
  "APPROVED",
  "CHANGES_REQUESTED",
  "REJECTED",
] as const;

export const formatTeacherDateTime = (value: string | null) => {
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

export const countPendingTeacherApplications = (
  applications: TeacherClubCreationApplication[],
) => {
  return applications.filter((application) => {
    return (
      application.status === "SUBMITTED" ||
      application.status === "UNDER_REVIEW"
    );
  }).length;
};

export const sortTeacherApplicationsByLastSubmittedAt = (
  applications: TeacherClubCreationApplication[],
) => {
  return [...applications].sort((a, b) => {
    return (
      new Date(b.lastSubmittedAt).getTime() -
      new Date(a.lastSubmittedAt).getTime()
    );
  });
};

export const getTeacherReviewLockMessage = (
  decision: ClubCreationReviewDecision | null | undefined,
) => {
  if (decision === "APPROVED") {
    return "이미 승인한 리뷰가 유지되고 있어 현재 추가 리뷰를 남길 수 없습니다.";
  }

  return "이미 최신 리뷰가 반영되었습니다. 학생이 다시 제출하면 다음 차수에서 다시 리뷰할 수 있습니다.";
};

export const sortTeacherReviews = (reviews: TeacherClubCreationReview[]) => {
  return [...reviews].sort((a, b) => {
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
};

export const getTeacherReviewRenderKey = (
  review: TeacherClubCreationReview,
) => {
  return [
    review.revision,
    review.reviewId,
    review.reviewerType,
    review.updatedAt,
  ].join(":");
};
