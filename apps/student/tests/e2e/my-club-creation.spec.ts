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
    await installStudentApiMocks(page, {
      myClubCreationApplication: buildMyApplication({
        reviewHistory: [
          {
            reviewId: 901,
            reviewerType: "ADMIN",
            reviewerName: "관리자",
            revision: 1,
            decision: "CHANGES_REQUESTED",
            feedback: "이전 revision 피드백입니다.",
            updatedAt: "2026-03-17T15:00:00",
          },
        ],
      }),
    });

    await page.goto("/mypage/club-creation");

    await expect(
      page.getByRole("heading", { name: "내 개설 신청" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "개설 신청 상세 보기" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "최신 코멘트" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "이전 revision 기록" }),
    ).toBeVisible();
    await expect(page.getByText("신청 메타데이터")).toBeVisible();
    await expect(
      page.getByText("활동 계획을 조금 더 구체적으로 작성해주세요."),
    ).toBeVisible();
    await expect(page.getByText("이전 revision 피드백입니다.")).toBeVisible();

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
      page.getByText("아직 현재 revision에 등록된 리뷰가 없습니다."),
    ).toBeVisible();
    await expect(
      page.getByText("과거 revision 리뷰 이력이 아직 없습니다."),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "수정 후 다시 제출하기" }),
    ).toHaveCount(0);
  });
});
