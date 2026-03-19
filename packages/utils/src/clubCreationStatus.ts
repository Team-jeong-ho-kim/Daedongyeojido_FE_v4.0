import type {
  ClubCreationApplicationDetail,
  ClubCreationApplicationStatus,
} from "./types";

export const resolveClubCreationApplicationStatus = (
  application: Pick<
    ClubCreationApplicationDetail,
    "status" | "revision" | "currentReviews"
  >,
): ClubCreationApplicationStatus => {
  const currentRevisionReviews = application.currentReviews.filter(
    (review) => review.revision === application.revision,
  );

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
