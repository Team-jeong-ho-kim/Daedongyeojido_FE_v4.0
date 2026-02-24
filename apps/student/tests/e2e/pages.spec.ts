import { expect, test } from "@playwright/test";
import { installStudentApiMocks, setAuthSession } from "./support/mockApi";

test.describe("Student app pages", () => {
  test.beforeEach(async ({ page }) => {
    await setAuthSession(page);
    await installStudentApiMocks(page);
  });

  test("renders home page", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("동아리 공고 살펴보기")).toBeVisible();
  });

  test("renders announcements list page", async ({ page }) => {
    await page.goto("/announcements");
    await expect(
      page.getByRole("heading", { name: "공고 전체 조회" }),
    ).toBeVisible();
    await expect(page.getByText("백엔드 모집")).toBeVisible();
  });

  test("renders clubs list page", async ({ page }) => {
    await page.goto("/clubs");
    await expect(
      page.getByRole("heading", { name: "동아리 전체 조회" }),
    ).toBeVisible();
    await expect(page.getByText("테스트동아리")).toBeVisible();
  });

  test("renders announcement detail page", async ({ page }) => {
    await page.goto("/announcements/1");
    await expect(page.getByRole("button", { name: "공고 내용" })).toBeVisible();
    await expect(page.getByText("지원서 작성하기")).toBeVisible();
  });

  test("renders club detail page", async ({ page }) => {
    await page.goto("/clubs/1");
    await expect(page.getByRole("button", { name: "소개" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "테스트동아리" }),
    ).toBeVisible();
  });

  test("renders mypage", async ({ page }) => {
    await page.goto("/mypage");
    await expect(
      page.getByRole("heading", { name: "마이페이지" }),
    ).toBeVisible();
    await expect(page.getByText("테스트유저")).toBeVisible();
  });

  test("renders onboarding page", async ({ page }) => {
    await page.goto("/onboarding");
    await expect(
      page.getByRole("heading", { name: "필수 정보" }),
    ).toBeVisible();
    await expect(page.getByText("저장 완료")).toBeVisible();
  });
});
