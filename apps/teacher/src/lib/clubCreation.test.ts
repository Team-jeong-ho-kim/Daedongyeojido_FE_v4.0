import type {
  TeacherClubCreationApplication,
  TeacherClubCreationReview,
} from "@/types/teacher";
import {
  countPendingTeacherApplications,
  formatTeacherDateTime,
  getTeacherReviewLockMessage,
  getTeacherReviewRenderKey,
  sortTeacherApplicationsByLastSubmittedAt,
  sortTeacherReviews,
} from "./clubCreation";

const createApplication = (
  overrides: Partial<TeacherClubCreationApplication> = {},
): TeacherClubCreationApplication => ({
  applicantName: "홍길동",
  applicationId: 1,
  clubImage: null,
  clubName: "테스트동아리",
  introduction: "소개",
  lastSubmittedAt: "2026-03-21T09:00:00",
  majors: ["FE"],
  revision: 1,
  status: "UNDER_REVIEW",
  ...overrides,
});

const createReview = (
  overrides: Partial<TeacherClubCreationReview> = {},
): TeacherClubCreationReview => ({
  decision: "APPROVED",
  feedback: null,
  reviewId: 1,
  reviewerName: "김교사",
  reviewerType: "TEACHER",
  revision: 1,
  updatedAt: "2026-03-21T09:00:00",
  ...overrides,
});

describe("teacher club creation helpers", () => {
  it("formats valid datetimes and preserves invalid ones", () => {
    expect(formatTeacherDateTime("not-a-date")).toBe("not-a-date");
    expect(formatTeacherDateTime(null)).toBe("-");
    expect(formatTeacherDateTime("2026-03-21T09:00:00")).toContain("2026");
  });

  it("counts only pending applications", () => {
    expect(
      countPendingTeacherApplications([
        createApplication({ status: "SUBMITTED" }),
        createApplication({ applicationId: 2, status: "UNDER_REVIEW" }),
        createApplication({ applicationId: 3, status: "APPROVED" }),
      ]),
    ).toBe(2);
  });

  it("sorts applications and reviews by latest timestamps", () => {
    expect(
      sortTeacherApplicationsByLastSubmittedAt([
        createApplication({
          applicationId: 1,
          lastSubmittedAt: "2026-03-21T09:00:00",
        }),
        createApplication({
          applicationId: 2,
          lastSubmittedAt: "2026-03-21T10:00:00",
        }),
      ])[0]?.applicationId,
    ).toBe(2);

    expect(
      sortTeacherReviews([
        createReview({ reviewId: 1, updatedAt: "2026-03-21T09:00:00" }),
        createReview({ reviewId: 2, updatedAt: "2026-03-21T10:00:00" }),
      ])[0]?.reviewId,
    ).toBe(2);
  });

  it("builds stable review keys and review lock messages", () => {
    expect(getTeacherReviewRenderKey(createReview())).toBe(
      "1:1:TEACHER:2026-03-21T09:00:00",
    );
    expect(getTeacherReviewLockMessage("APPROVED")).toContain(
      "이미 승인한 리뷰",
    );
    expect(getTeacherReviewLockMessage("REJECTED")).toContain(
      "학생이 다시 제출",
    );
  });
});
