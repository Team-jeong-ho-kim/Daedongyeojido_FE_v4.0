import {
  getLatestClubCreationReviewsByReviewer,
  partitionClubCreationReviews,
} from "../clubCreationReviews";
import type { ClubCreationApplicationReview } from "../../types";

const createReview = (
  overrides: Partial<ClubCreationApplicationReview> = {},
): ClubCreationApplicationReview => ({
  decision: "APPROVED",
  feedback: null,
  reviewId: 1,
  reviewerName: "관리자",
  reviewerType: "ADMIN",
  revision: 1,
  updatedAt: "2026-03-20T10:00:00",
  ...overrides,
});

describe("club creation reviews", () => {
  it("picks the latest review per reviewer using revision, timestamp, then id", () => {
    const latestReviews = getLatestClubCreationReviewsByReviewer({
      currentReviews: [
        createReview({
          decision: "CHANGES_REQUESTED",
          reviewId: 11,
          revision: 2,
          updatedAt: "2026-03-20T11:00:00",
        }),
        createReview({
          decision: "REJECTED",
          reviewId: 12,
          reviewerType: "TEACHER",
          revision: 2,
          reviewerName: "김교사",
          updatedAt: "2026-03-20T11:00:00",
        }),
      ],
      reviewHistory: [
        createReview({
          decision: "APPROVED",
          reviewId: 3,
          revision: 1,
          updatedAt: "2026-03-20T09:00:00",
        }),
        createReview({
          decision: "APPROVED",
          reviewId: 10,
          reviewerType: "TEACHER",
          reviewerName: "김교사",
          revision: 2,
          updatedAt: "2026-03-20T11:00:00",
        }),
      ],
    });

    expect(latestReviews.get("ADMIN")?.reviewId).toBe(11);
    expect(latestReviews.get("TEACHER")?.reviewId).toBe(12);
  });

  it("splits current revision reviews from deduplicated history", () => {
    const duplicateHistory = createReview({
      decision: "CHANGES_REQUESTED",
      reviewId: 5,
      revision: 1,
      updatedAt: "2026-03-19T12:00:00",
    });

    const partitioned = partitionClubCreationReviews({
      currentReviews: [
        createReview({
          reviewId: 8,
          revision: 2,
          updatedAt: "2026-03-20T14:00:00",
        }),
      ],
      reviewHistory: [duplicateHistory, duplicateHistory],
      revision: 2,
    });

    expect(partitioned.currentRevisionReviews).toHaveLength(1);
    expect(partitioned.historicalReviews).toHaveLength(1);
    expect(partitioned.historicalReviews[0]?.reviewId).toBe(5);
  });
});
