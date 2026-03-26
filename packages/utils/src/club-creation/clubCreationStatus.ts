import { getLatestClubCreationReviewsByReviewer } from "./clubCreationReviews";
import type {
  ClubCreationApplicationDetail,
  ClubCreationApplicationStatus,
  ClubCreationReviewerType,
} from "../types";

const REVIEWER_TYPES: ClubCreationReviewerType[] = ["ADMIN", "TEACHER"];

export const resolveClubCreationApplicationStatus = (
  application: Pick<
    ClubCreationApplicationDetail,
    | "status"
    | "revision"
    | "lastSubmittedAt"
    | "currentReviews"
    | "reviewHistory"
  >,
): ClubCreationApplicationStatus => {
  const latestReviewTimestamp = [
    ...application.reviewHistory,
    ...application.currentReviews,
  ].reduce((latestTimestamp, review) => {
    const reviewTimestamp = Date.parse(review.updatedAt);

    if (Number.isNaN(reviewTimestamp)) {
      return latestTimestamp;
    }

    return Math.max(latestTimestamp, reviewTimestamp);
  }, 0);
  const lastSubmittedTimestamp = application.lastSubmittedAt
    ? Date.parse(application.lastSubmittedAt)
    : Number.NaN;

  if (
    application.status === "UNDER_REVIEW" &&
    application.currentReviews.length === 0 &&
    latestReviewTimestamp > 0 &&
    !Number.isNaN(lastSubmittedTimestamp) &&
    lastSubmittedTimestamp > latestReviewTimestamp
  ) {
    return "UNDER_REVIEW";
  }

  const latestReviewByReviewer =
    getLatestClubCreationReviewsByReviewer(application);

  const hasRejectedReview = REVIEWER_TYPES.some(
    (reviewerType) =>
      latestReviewByReviewer.get(reviewerType)?.decision === "REJECTED",
  );

  if (hasRejectedReview) {
    return "REJECTED";
  }

  const hasChangesRequestedReview = REVIEWER_TYPES.some(
    (reviewerType) =>
      latestReviewByReviewer.get(reviewerType)?.decision ===
      "CHANGES_REQUESTED",
  );

  if (hasChangesRequestedReview) {
    return "CHANGES_REQUESTED";
  }

  const hasAllReviewerApprovals = REVIEWER_TYPES.every(
    (reviewerType) =>
      latestReviewByReviewer.get(reviewerType)?.decision === "APPROVED",
  );

  if (hasAllReviewerApprovals) {
    return "APPROVED";
  }

  if (
    application.currentReviews.length === 0 &&
    application.reviewHistory.length === 0
  ) {
    return application.status;
  }

  return "UNDER_REVIEW";
};
