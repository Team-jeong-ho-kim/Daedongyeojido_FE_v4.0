import { expect, test } from "@playwright/test";

test.describe("Web login page", () => {
  test("로그인 페이지는 학생/선생님 모드를 전환할 수 있다", async ({
    page,
  }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "학생 로그인" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "선생님 로그인" }).click();

    await expect(
      page.getByRole("heading", { name: "선생님 로그인" }),
    ).toBeVisible();
    await expect(page.getByText("지도 교사 전용 포털")).toBeVisible();
  });
});
