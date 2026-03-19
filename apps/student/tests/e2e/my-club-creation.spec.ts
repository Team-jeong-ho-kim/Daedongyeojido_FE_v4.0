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
    await expect(page.getByText("현재 검토 차수 피드백입니다.")).toBeVisible();
    await expect(
      page
        .locator("article")
        .filter({ hasText: "현재 검토 차수 피드백입니다." })
        .getByText("검토 차수 2차"),
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "현재 리뷰" })).toHaveCount(
      0,
    );
    await expect(page.getByRole("heading", { name: "이전 기록" })).toHaveCount(
      0,
    );
    await expect(
      page
        .locator("article")
        .filter({ hasText: "현재 검토 차수 피드백입니다." }),
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

    await expect(page.getByText("등록된 리뷰가 아직 없습니다.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "수정 후 다시 제출하기" }),
    ).toHaveCount(0);
  });

  test("현재 차수에 반려 리뷰가 하나라도 있으면 최종 상태를 반려로 표시한다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, {
      myClubCreationApplication: buildMyApplication({
        status: "UNDER_REVIEW",
        currentReviews: [
          {
            reviewId: 3,
            reviewerType: "TEACHER",
            reviewerName: "정은진",
            revision: 2,
            decision: "REJECTED",
            feedback: "이번 차수는 반려합니다.",
            updatedAt: "2026-03-19T09:30:00",
          },
        ],
        reviewHistory: [],
      }),
    });

    await page.goto("/mypage/club-creation");

    await expect(page.getByText("개설 신청이 반려되었습니다.")).toBeVisible();
    await expect(page.getByText("이번 차수는 반려합니다.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "수정 후 다시 제출하기" }),
    ).toHaveCount(0);
  });

  test("서로 다른 차수에서 각각 승인했더라도 두 리뷰어가 모두 승인하면 최종 승인으로 표시한다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, {
      myClubCreationApplication: buildMyApplication({
        status: "UNDER_REVIEW",
        revision: 3,
        currentReviews: [
          {
            reviewId: 5,
            reviewerType: "TEACHER",
            reviewerName: "정은진",
            revision: 3,
            decision: "APPROVED",
            feedback: null,
            updatedAt: "2026-03-19T10:47:00",
          },
        ],
        reviewHistory: [
          {
            reviewId: 1,
            reviewerType: "ADMIN",
            reviewerName: "최민수",
            revision: 1,
            decision: "APPROVED",
            feedback: "승인합니다.",
            updatedAt: "2026-03-19T10:44:00",
          },
          {
            reviewId: 2,
            reviewerType: "TEACHER",
            reviewerName: "정은진",
            revision: 1,
            decision: "CHANGES_REQUESTED",
            feedback: "이건 아니죠",
            updatedAt: "2026-03-19T10:44:00",
          },
          {
            reviewId: 3,
            reviewerType: "TEACHER",
            reviewerName: "정은진",
            revision: 2,
            decision: "CHANGES_REQUESTED",
            feedback: "잘되는",
            updatedAt: "2026-03-19T10:46:00",
          },
        ],
      }),
    });

    await page.goto("/mypage/club-creation");

    await expect(page.getByText("개설 신청이 승인되었습니다.")).toBeVisible();
    await expect(page.getByText("승인")).toHaveCount(2);
    await expect(
      page.getByRole("link", { name: "수정 후 다시 제출하기" }),
    ).toHaveCount(0);
  });

  test("이전 차수 승인 이력이 있어도 최신 결정 중 하나가 수정 요청이면 수정 요청 상태를 유지한다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, {
      myClubCreationApplication: buildMyApplication({
        status: "UNDER_REVIEW",
        revision: 3,
        currentReviews: [],
        reviewHistory: [
          {
            reviewId: 11,
            reviewerType: "ADMIN",
            reviewerName: "최민수",
            revision: 1,
            decision: "APPROVED",
            feedback: "승인합니다.",
            updatedAt: "2026-03-19T10:44:00",
          },
          {
            reviewId: 12,
            reviewerType: "TEACHER",
            reviewerName: "정은진",
            revision: 2,
            decision: "CHANGES_REQUESTED",
            feedback: "보완 후 다시 제출해주세요.",
            updatedAt: "2026-03-19T10:46:00",
          },
        ],
      }),
    });

    await page.goto("/mypage/club-creation");

    await expect(page.getByText("수정 요청이 도착했습니다.")).toBeVisible();
    await expect(
      page.getByText(
        "수정 요청된 의견을 반영해 신청서를 수정하고 다시 제출해 주세요. 이미 승인된 리뷰는 유지될 수 있습니다.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "수정 후 다시 제출하기" }),
    ).toHaveCount(1);
  });
});
