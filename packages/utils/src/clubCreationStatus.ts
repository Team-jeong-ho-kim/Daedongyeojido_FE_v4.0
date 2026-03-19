import { getLatestClubCreationReviewsByReviewer } from "./clubCreationReviews";
import type {
  ClubCreationApplicationDetail,
  ClubCreationApplicationStatus,
  ClubCreationReviewerType,
} from "./types";

const REVIEWER_TYPES: ClubCreationReviewerType[] = ["ADMIN", "TEACHER"];

export const resolveClubCreationApplicationStatus = (
  application: Pick<
    ClubCreationApplicationDetail,
    "status" | "revision" | "currentReviews" | "reviewHistory"
  >,
): ClubCreationApplicationStatus => {
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
