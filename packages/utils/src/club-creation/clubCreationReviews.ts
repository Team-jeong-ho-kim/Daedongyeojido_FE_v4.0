import type {
  ClubCreationApplicationDetail,
  ClubCreationApplicationReview,
  ClubCreationReviewerType,
} from "../types";

type ReviewBuckets = {
  currentRevisionReviews: ClubCreationApplicationReview[];
  historicalReviews: ClubCreationApplicationReview[];
};

type ReviewCollection = Pick<
  ClubCreationApplicationDetail,
  "currentReviews" | "reviewHistory"
>;

const getReviewKey = (review: ClubCreationApplicationReview) => {
  return [
    review.reviewId,
    review.reviewerType,
    review.revision,
    review.updatedAt,
  ].join(":");
};

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

export const getLatestClubCreationReviewsByReviewer = (
  detail: ReviewCollection,
) => {
  const latestReviewByReviewer = new Map<
    ClubCreationReviewerType,
    ClubCreationApplicationReview
  >();

  for (const review of [...detail.reviewHistory, ...detail.currentReviews]) {
    const currentReview = latestReviewByReviewer.get(review.reviewerType);

    if (!currentReview || isLaterReview(review, currentReview)) {
      latestReviewByReviewer.set(review.reviewerType, review);
    }
  }

  return latestReviewByReviewer;
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
