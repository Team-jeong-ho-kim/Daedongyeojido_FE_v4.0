import type {
  ClubCreationApplicationDetail,
  ClubCreationApplicationReview,
} from "./types";

type ReviewBuckets = {
  currentRevisionReviews: ClubCreationApplicationReview[];
  historicalReviews: ClubCreationApplicationReview[];
};

const getReviewKey = (review: ClubCreationApplicationReview) => {
  return [
    review.reviewId,
    review.reviewerType,
    review.revision,
    review.updatedAt,
  ].join(":");
};

export const partitionClubCreationReviews = (
  detail: Pick<
    ClubCreationApplicationDetail,
    "revision" | "currentReviews" | "reviewHistory"
  >,
): ReviewBuckets => {
  const currentRevisionReviews = detail.currentReviews.filter(
    (review) => review.revision === detail.revision,
  );
  const historicalReviewMap = new Map<string, ClubCreationApplicationReview>();

  for (const review of [...detail.reviewHistory, ...detail.currentReviews]) {
    if (review.revision >= detail.revision) {
      continue;
    }

    const reviewKey = getReviewKey(review);
    if (!historicalReviewMap.has(reviewKey)) {
      historicalReviewMap.set(reviewKey, review);
    }
  }

  return {
    currentRevisionReviews,
    historicalReviews: Array.from(historicalReviewMap.values()),
  };
};
