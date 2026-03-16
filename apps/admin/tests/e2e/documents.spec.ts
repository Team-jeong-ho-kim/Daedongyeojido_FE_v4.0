import { expect, test } from "@playwright/test";
import { installAdminApiMocks, setAdminAuthSession } from "./support/mockApi";

test.describe("Admin documents", () => {
  test.beforeEach(async ({ page }) => {
    await setAdminAuthSession(page);
  });

  test("양식 목록에서 삭제 확인 모달을 열고 삭제를 확정할 수 있다", async ({
    page,
  }) => {
    const controller = await installAdminApiMocks(page, {
      documentFiles: [
        {
          fileId: 1,
          fileName: "2026 동아리 개설 신청 양식",
          fileUrl: "https://files.test/club-creation-form.hwp",
        },
        {
          fileId: 2,
          fileName: "2026 동아리 개설 신청서 PDF",
          fileUrl: "https://files.test/club-creation-form.pdf",
        },
      ],
    });

    await page.goto("/documents");

    await expect(
      page.getByRole("heading", { name: "양식 조회" }),
    ).toBeVisible();
    await expect(
      page.getByText("2026 동아리 개설 신청 양식.hwp"),
    ).toBeVisible();
    await expect(
      page.getByText("2026 동아리 개설 신청서 PDF.pdf"),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "삭제" })).toHaveCount(2);
    await expect(page.getByRole("button", { name: "미리보기" })).toHaveCount(1);

    await page.getByRole("button", { name: "미리보기" }).click();
    await expect(
      page.getByRole("heading", { name: "문서 미리보기" }),
    ).toBeVisible();
    await expect(
      page
        .locator('[class*="max-w-6xl"]')
        .getByRole("button", { name: "다운로드" }),
    ).toBeVisible();
    await expect(page.locator('object[type="application/pdf"]')).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("heading", { name: "문서 미리보기" }),
    ).toHaveCount(0);

    await page.getByRole("button", { name: "삭제" }).first().click();

    const deleteDialog = page.getByRole("dialog", {
      name: "양식을 삭제하시겠습니까?",
    });
    await expect(deleteDialog).toBeVisible();
    await expect(
      deleteDialog.getByText("2026 동아리 개설 신청 양식.hwp"),
    ).toBeVisible();
    await expect(deleteDialog.getByText("양식 ID #1")).toBeVisible();

    await deleteDialog.getByRole("button", { name: "취소" }).click();
    await expect(deleteDialog).toHaveCount(0);
    await expect(
      page.getByText("2026 동아리 개설 신청 양식.hwp"),
    ).toBeVisible();

    await page.getByRole("button", { name: "삭제" }).first().click();
    const confirmDialog = page.getByRole("dialog", {
      name: "양식을 삭제하시겠습니까?",
    });
    await expect(confirmDialog).toBeVisible();
    await confirmDialog.getByRole("button", { name: "삭제" }).click();

    await expect(
      page.getByText("동아리 개설 양식을 삭제했습니다."),
    ).toBeVisible();
    await expect(page.getByText("2026 동아리 개설 신청 양식.hwp")).toHaveCount(
      0,
    );
    await expect(
      page.getByText("2026 동아리 개설 신청서 PDF.pdf"),
    ).toBeVisible();

    expect(controller.getLastRequest("/files/1", "DELETE")).toBeTruthy();
  });

  test("등록된 양식이 없으면 empty state를 보여준다", async ({ page }) => {
    await installAdminApiMocks(page, {
      documentFiles: [],
    });

    await page.goto("/documents");

    await expect(
      page.getByRole("heading", { name: "양식 조회" }),
    ).toBeVisible();
    await expect(page.getByText("등록된 양식이 없습니다.")).toBeVisible();
  });
});
