import { expect, test } from "@playwright/test";
import {
  DEFAULT_MY_CLUB_CREATION_APPLICATION,
  installStudentApiMocks,
  setAuthSession,
} from "./support/mockApi";

const buildMyApplication = (
  overrides: Partial<typeof DEFAULT_MY_CLUB_CREATION_APPLICATION> = {},
) => {
  return {
    ...DEFAULT_MY_CLUB_CREATION_APPLICATION,
    ...overrides,
    applicant: {
      ...DEFAULT_MY_CLUB_CREATION_APPLICATION.applicant,
      ...(overrides.applicant ?? {}),
    },
    currentReviews:
      overrides.currentReviews ??
      DEFAULT_MY_CLUB_CREATION_APPLICATION.currentReviews,
    reviewHistory:
      overrides.reviewHistory ??
      DEFAULT_MY_CLUB_CREATION_APPLICATION.reviewHistory,
  };
};

test.describe("Student my club creation detail", () => {
  test.beforeEach(async ({ page }) => {
    await setAuthSession(page);
  });

  test("상세 정보와 GitHub 스타일 코멘트 타임라인을 보여준다", async ({
    page,
  }) => {
    const duplicatedReview = {
      reviewId: 1,
      reviewerType: "TEACHER" as const,
      reviewerName: "정은진",
      revision: 2,
      decision: "CHANGES_REQUESTED" as const,
      feedback: "현재 검토 차수 피드백입니다.",
      updatedAt: "2026-03-19T01:56:00",
    };

    await installStudentApiMocks(page, {
      myClubCreationApplication: buildMyApplication({
        currentReviews: [duplicatedReview],
        reviewHistory: [duplicatedReview],
      }),
    });

    await page.goto("/mypage/club-creation");

    await expect(
      page.getByRole("heading", { name: "내 개설 신청" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "동아리 소개" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "리뷰 이력" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "최신 코멘트" }),
    ).toHaveCount(0);
    await expect(page.getByText("신청 메타데이터")).toBeVisible();
    await expect(
      page.getByText("현재 검토 차수 피드백입니다."),
    ).toBeVisible();
    await expect(page.getByText("검토 차수 2차")).toBeVisible();
    await expect(page.getByText("현재 리뷰")).toHaveCount(0);
    await expect(page.getByText("이전 기록")).toHaveCount(0);
    await expect(page.getByText("리뷰 이력")).toHaveCount(2);
    await expect(
      page.locator("article").filter({ hasText: "현재 검토 차수 피드백입니다." }),
    ).toHaveCount(1);
    await expect(page.getByText("1건")).toHaveCount(2);

    const editLinks = page.getByRole("link", { name: "수정 후 다시 제출하기" });
    await expect(editLinks).toHaveCount(1);
    await expect(editLinks.first()).toHaveAttribute(
      "href",
      "/mypage/club-creation/edit",
    );

    await page.getByRole("button", { name: "미리보기" }).click();
    await expect(
      page.getByRole("heading", { name: "문서 미리보기" }),
    ).toBeVisible();
    await expect(page.locator('object[type="application/pdf"]')).toBeVisible();
  });

  test("리뷰가 없으면 비어 있는 코멘트 상태를 보여준다", async ({ page }) => {
    await installStudentApiMocks(page, {
      myClubCreationApplication: buildMyApplication({
        status: "UNDER_REVIEW",
        currentReviews: [],
        reviewHistory: [],
      }),
    });

    await page.goto("/mypage/club-creation");

    await expect(
      page.getByText("등록된 리뷰가 아직 없습니다."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "수정 후 다시 제출하기" }),
    ).toHaveCount(0);
  });
});
