import { expect, test } from "@playwright/test";
import { installStudentApiMocks, setAuthSession } from "./support/mockApi";

test.describe("Student documents", () => {
  test.beforeEach(async ({ page }) => {
    await setAuthSession(page);
  });

  test("양식 목록을 자동 조회하고 다운로드 요청을 보낸다", async ({ page }) => {
    await installStudentApiMocks(page, {
      documentFiles: [
        {
          fileId: 1,
          fileName: "2026 동아리 개설 신청 양식",
          fileUrl: "https://files.test/club-creation-form.hwp",
        },
        {
          fileId: 2,
          fileName: "2026 동아리 개설 신청 양식.pdf",
          fileUrl: "https://files.test/club-creation-form.pdf",
        },
      ],
    });

    await page.route(
      "https://files.test/club-creation-form.hwp",
      async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/octet-stream",
          body: "mock-hwp",
        });
      },
    );

    await page.route(
      "https://files.test/club-creation-form.pdf",
      async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        await route.fulfill({
          status: 200,
          contentType: "application/pdf",
          body: "mock-pdf",
        });
      },
    );

    await page.goto("/documents");

    await expect(
      page.getByRole("heading", { name: "양식 조회" }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "동아리 개설 양식 목록" }),
    ).toBeVisible();
    await expect(
      page.getByText("2026 동아리 개설 신청 양식.hwp"),
    ).toBeVisible();
    await expect(
      page.getByText("2026 동아리 개설 신청 양식.pdf"),
    ).toBeVisible();
    await expect(page.getByText("HWP", { exact: true })).toBeVisible();
    await expect(page.getByText("PDF", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "다운로드" })).toHaveCount(2);
    await expect(page.getByRole("button", { name: "미리보기" })).toHaveCount(2);
    await expect(page.getByText(/양식 ID #/)).toHaveCount(0);

    await page.getByRole("button", { name: "미리보기" }).nth(1).click();
    await expect(
      page.getByRole("heading", { name: "문서 미리보기" }),
    ).toBeVisible();
    const previewFrame = page.frameLocator('iframe[title="문서 미리보기"]');
    await expect(page.locator('iframe[title="문서 미리보기"]')).toBeVisible();
    await expect(
      previewFrame.getByRole("status", { name: "문서 미리보기 로딩 중" }),
    ).toBeVisible();
    await expect(
      previewFrame.locator('object[type="application/pdf"]'),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(
      page.getByRole("heading", { name: "문서 미리보기" }),
    ).toHaveCount(0);

    const downloadRequest = page.waitForRequest(
      "https://files.test/club-creation-form.hwp",
    );
    await page.getByRole("button", { name: "다운로드" }).first().click();
    await downloadRequest;

    await expect(
      page.getByText("동아리 개설 양식을 다운로드했습니다."),
    ).toBeVisible();
  });

  test("등록된 양식이 없으면 empty state를 보여준다", async ({ page }) => {
    await installStudentApiMocks(page, {
      documentFiles: [],
    });

    await page.goto("/documents");

    await expect(
      page.getByRole("heading", { name: "양식 조회" }),
    ).toBeVisible();
    await expect(page.getByText("등록된 양식이 없습니다.")).toBeVisible();
  });
});
