import { expect, test } from "@playwright/test";
import { installAdminApiMocks, setAdminAuthSession } from "./support/mockApi";

test.describe("Admin club creation tab", () => {
  test.beforeEach(async ({ page }) => {
    await setAdminAuthSession(page);
  });

  test("목록에서 신청서를 열어 상세, 리뷰, PDF 미리보기를 확인할 수 있다", async ({
    page,
  }) => {
    const controller = await installAdminApiMocks(page);

    await page.goto("/mypage");
    await page.getByRole("button", { name: "동아리 개설" }).click();

    await expect(
      page.getByRole("heading", { name: "동아리 개설 신청 검토" }),
    ).toBeVisible();
    await expect(
      page.getByText("전략과 협업 중심으로 운영하는 게임 동아리입니다."),
    ).toHaveCount(0);

    await page.getByRole("button", { name: /발로란트/ }).click();

    await expect(page.getByRole("heading", { name: "발로란트" })).toBeVisible();
    await expect(
      page.getByText("동아리 개설 신청", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("신청 ID #5")).toBeVisible();
    await expect(page.getByText('" 정승우 "')).toBeVisible();
    await expect(page.getByText("신청자", { exact: true })).toBeVisible();
    await expect(page.getByText("3212")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "현재 리뷰" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "리뷰 이력" }),
    ).toBeVisible();
    await expect(
      page.getByText(
        "https://github.com/Team-jeong-ho-kim/Daedongyeojido_FE_v4.0",
      ),
    ).toHaveCount(1);
    expect(
      controller.getLastRequest("/club-creation-applications/5", "GET"),
    ).toBeTruthy();

    await page.getByRole("button", { name: "미리보기" }).click();
    const previewModal = page.locator('[class*="max-w-6xl"]');

    await expect(
      page.getByRole("heading", { name: "문서 미리보기" }),
    ).toBeVisible();
    await expect(
      previewModal.getByRole("button", { name: "다운로드" }),
    ).toBeVisible();
    await expect(page.locator('object[type="application/pdf"]')).toBeVisible();

    await previewModal.getByRole("button", { name: "미리보기 닫기" }).click();
    await page.getByLabel("상세 조회 닫기").click();
    await expect(page.getByRole("heading", { name: "발로란트" })).toHaveCount(
      0,
    );
  });

  test("수정 요청 리뷰는 코멘트가 필수이고 저장 후 상세가 다시 동기화된다", async ({
    page,
  }) => {
    const controller = await installAdminApiMocks(page);

    await page.goto("/mypage");
    await page.getByRole("button", { name: "동아리 개설" }).click();
    await page.getByRole("button", { name: /발로란트/ }).click();

    await page.getByRole("button", { name: "리뷰 저장" }).click();

    await expect(page.getByText("검토 결과를 선택해주세요.")).toBeVisible();

    await page.getByRole("button", { name: "수정 요청" }).click();
    await page.getByRole("button", { name: "리뷰 저장" }).click();

    await expect(
      page.getByText("수정 요청 또는 반려일 때는 코멘트를 반드시 입력해주세요."),
    ).toBeVisible();

    await page
      .getByPlaceholder("학생에게 전달할 코멘트를 입력해주세요.")
      .fill("활동 계획을 조금 더 구체적으로 작성해주세요.");
    await page.getByRole("button", { name: "리뷰 저장" }).click();

    await expect(
      page.getByRole("heading", { name: "리뷰를 저장하시겠습니까?" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "취소" }).click();
    expect(
      controller.getLastRequest("/club-creation-applications/5/review", "PUT"),
    ).toBeUndefined();

    await page.getByRole("button", { name: "리뷰 저장" }).click();
    await page.getByRole("button", { name: "확인" }).click();

    await expect(page.getByText("리뷰를 저장했습니다.")).toBeVisible();
    await expect(
      page
        .locator("article")
        .filter({ hasText: "관리자" })
        .getByText("활동 계획을 조금 더 구체적으로 작성해주세요."),
    ).toBeVisible();
    await expect(
      page.getByText("리뷰는 1회만 작성 가능하며 저장 후 수정할 수 없습니다."),
    ).toBeVisible();
    await expect(
      page.getByPlaceholder("학생에게 전달할 코멘트를 입력해주세요."),
    ).toHaveCount(0);
    await expect(page.getByRole("button", { name: "리뷰 저장" })).toHaveCount(
      0,
    );
    expect(
      controller.getLastRequest("/club-creation-applications/5/review", "PUT"),
    ).toBeTruthy();
    expect(
      controller.requests.filter(
        (request) =>
          request.method === "PUT" &&
          request.pathname.includes("/club-creation-applications/5/review"),
      ),
    ).toHaveLength(1);
  });
});
