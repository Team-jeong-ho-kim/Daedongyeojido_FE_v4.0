import { expect, test } from "@playwright/test";

test.describe("Student login", () => {
  test("shows validation messages for empty inputs", async ({ page }) => {
    await page.goto("/login");

    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page.getByText("DSM 계정 ID를 입력해주세요.")).toBeVisible();

    await page.getByLabel("DSM 계정 ID").fill("test.account");
    await page.getByRole("button", { name: "로그인" }).click();
    await expect(page.getByText("비밀번호를 입력해주세요.")).toBeVisible();
  });

  test("shows fallback error toast when login fails", async ({ page }) => {
    await page.route("**/auth/login", async (route) => {
      await route.fulfill({
        status: 401,
        contentType: "application/json",
        body: JSON.stringify({ message: "unauthorized" }),
      });
    });

    await page.goto("/login");
    await page.getByLabel("DSM 계정 ID").fill("wrong.account");
    await page
      .getByPlaceholder("비밀번호를 입력해주세요.")
      .fill("wrong-password");
    await page.getByRole("button", { name: "로그인" }).click();

    await expect(
      page.getByText("로그인에 실패했습니다. 다시 시도해주세요."),
    ).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("logs in successfully and redirects to home", async ({ page }) => {
    await page.route("**/auth/login", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          accessToken: "mock-access-token",
          refreshToken: "mock-refresh-token",
          userName: "테스트유저",
        }),
      });
    });

    await page.route("**/users", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          userName: "테스트유저",
          classNumber: "2301",
          introduction: "intro",
          major: ["BACKEND"],
          link: ["https://example.com"],
          profileImage: "https://example.com/profile.png",
          role: "STUDENT",
        }),
      });
    });

    await page.goto("/login");

    await page.getByLabel("DSM 계정 ID").fill("test.account");
    await page
      .getByPlaceholder("비밀번호를 입력해주세요.")
      .fill("test-password");
    await page.getByRole("button", { name: "로그인" }).click();

    await expect(page).toHaveURL("/");
  });
});
