import type {
  ClubCreationApplicationDetail,
  ClubCreationApplicationReview,
  ClubCreationApplicationStatus,
  ClubCreationReviewerType,
} from "./types";

const REVIEWER_TYPES: ClubCreationReviewerType[] = ["ADMIN", "TEACHER"];

const getReviewTimestamp = (review: ClubCreationApplicationReview) => {
  const timestamp = Date.parse(review.updatedAt);
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const isLaterReview = (
  candidate: ClubCreationApplicationReview,
  current: ClubCreationApplicationReview,
) => {
  if (candidate.revision !== current.revision) {
    return candidate.revision > current.revision;
  }

  const candidateTimestamp = getReviewTimestamp(candidate);
  const currentTimestamp = getReviewTimestamp(current);

  if (candidateTimestamp !== currentTimestamp) {
    return candidateTimestamp > currentTimestamp;
  }

  return candidate.reviewId > current.reviewId;
};

const getLatestReviewsByReviewer = (
  reviews: ClubCreationApplicationReview[],
) => {
  const latestReviewByReviewer = new Map<
    ClubCreationReviewerType,
    ClubCreationApplicationReview
  >();

  for (const review of reviews) {
    const currentReview = latestReviewByReviewer.get(review.reviewerType);

    if (!currentReview || isLaterReview(review, currentReview)) {
      latestReviewByReviewer.set(review.reviewerType, review);
    }
  }

  return latestReviewByReviewer;
};

export const resolveClubCreationApplicationStatus = (
  application: Pick<
    ClubCreationApplicationDetail,
    "status" | "revision" | "currentReviews" | "reviewHistory"
  >,
): ClubCreationApplicationStatus => {
  const currentRevisionReviews = application.currentReviews.filter(
    (review) => review.revision === application.revision,
  );
  const latestReviewByReviewer = getLatestReviewsByReviewer([
    ...application.reviewHistory,
    ...application.currentReviews,
  ]);

  const hasAllReviewerApprovals = REVIEWER_TYPES.every(
    (reviewerType) =>
      latestReviewByReviewer.get(reviewerType)?.decision === "APPROVED",
  );

  if (hasAllReviewerApprovals) {
    return "APPROVED";
  }

  if (currentRevisionReviews.length === 0) {
    return application.status;
  }

  if (currentRevisionReviews.some((review) => review.decision === "REJECTED")) {
    return "REJECTED";
  }

  if (
    currentRevisionReviews.some(
      (review) => review.decision === "CHANGES_REQUESTED",
    )
  ) {
    return "CHANGES_REQUESTED";
  }

  if (
    currentRevisionReviews.length >= 2 &&
    currentRevisionReviews.every((review) => review.decision === "APPROVED")
  ) {
    return "APPROVED";
  }

  return "UNDER_REVIEW";
};
