import { resolveClubCreationApplicationStatus } from "./clubCreationStatus";
import type { ClubCreationApplicationDetail } from "./types";

const createDetail = (
  overrides: Partial<ClubCreationApplicationDetail> = {},
): ClubCreationApplicationDetail => ({
  applicant: {
    classNumber: "3212",
    userId: 1,
    userName: "정승우",
  },
  applicationId: 1,
  clubCreationForm: null,
  clubImage: null,
  clubName: "테스트동아리",
  currentReviews: [],
  introduction: "소개",
  lastSubmittedAt: "2026-03-20T10:00:00",
  links: [],
  majors: ["FE"],
  oneLiner: "한 줄 소개",
  reviewHistory: [],
  revision: 2,
  status: "UNDER_REVIEW",
  submittedAt: "2026-03-20T10:00:00",
  ...overrides,
});

describe("resolveClubCreationApplicationStatus", () => {
  it("returns approved when both reviewers approved the latest revision", () => {
    const status = resolveClubCreationApplicationStatus(
      createDetail({
        currentReviews: [
          {
            decision: "APPROVED",
            feedback: null,
            reviewId: 1,
            reviewerName: "관리자",
            reviewerType: "ADMIN",
            revision: 2,
            updatedAt: "2026-03-20T11:00:00",
          },
          {
            decision: "APPROVED",
            feedback: null,
            reviewId: 2,
            reviewerName: "김교사",
            reviewerType: "TEACHER",
            revision: 2,
            updatedAt: "2026-03-20T11:30:00",
          },
        ],
      }),
    );

    expect(status).toBe("APPROVED");
  });

  it("returns changes requested when either latest review requests changes", () => {
    const status = resolveClubCreationApplicationStatus(
      createDetail({
        currentReviews: [
          {
            decision: "CHANGES_REQUESTED",
            feedback: "보완 필요",
            reviewId: 3,
            reviewerName: "관리자",
            reviewerType: "ADMIN",
            revision: 2,
            updatedAt: "2026-03-20T11:00:00",
          },
        ],
      }),
    );

    expect(status).toBe("CHANGES_REQUESTED");
  });

  it("returns rejected when one reviewer rejected the latest review", () => {
    const status = resolveClubCreationApplicationStatus(
      createDetail({
        currentReviews: [
          {
            decision: "REJECTED",
            feedback: "반려",
            reviewId: 4,
            reviewerName: "김교사",
            reviewerType: "TEACHER",
            revision: 2,
            updatedAt: "2026-03-20T11:00:00",
          },
        ],
      }),
    );

    expect(status).toBe("REJECTED");
  });

  it("stays under review when the student resubmitted after prior reviews", () => {
    const status = resolveClubCreationApplicationStatus(
      createDetail({
        currentReviews: [],
        lastSubmittedAt: "2026-03-20T13:00:00",
        reviewHistory: [
          {
            decision: "CHANGES_REQUESTED",
            feedback: "다시 제출해 주세요",
            reviewId: 5,
            reviewerName: "관리자",
            reviewerType: "ADMIN",
            revision: 1,
            updatedAt: "2026-03-20T12:00:00",
          },
        ],
      }),
    );

    expect(status).toBe("UNDER_REVIEW");
  });

  it("keeps the original status when there are no reviews", () => {
    expect(
      resolveClubCreationApplicationStatus(
        createDetail({
          status: "SUBMITTED",
        }),
      ),
    ).toBe("SUBMITTED");
  });
});
