import { expect, test } from "@playwright/test";
import { installAdminApiMocks, setAdminAuthSession } from "./support/mockApi";

test.describe("Admin teacher tab", () => {
  test.beforeEach(async ({ page }) => {
    await setAdminAuthSession(page);
  });

  test("지도 교사 전체 조회와 추가 후 목록 갱신이 동작한다", async ({
    page,
  }) => {
    const controller = await installAdminApiMocks(page, {
      teachers: [
        { teacherId: 3, teacherName: "농구공", matched: false },
        { teacherId: 4, teacherName: "선생님", matched: true },
      ],
    });

    await page.goto("/mypage");
    await page.getByRole("button", { name: "지도 교사" }).click();

    await expect(
      page.getByRole("heading", { name: "지도 교사 전체 조회" }),
    ).toBeVisible();
    await expect(page.getByText("#3")).toBeVisible();
    await expect(page.getByText("농구공")).toBeVisible();
    await expect(
      page.locator("li").filter({ hasText: "#3" }).getByText("미매칭"),
    ).toBeVisible();
    await expect(page.getByText("#4")).toBeVisible();
    await expect(page.getByText("선생님")).toBeVisible();
    await expect(
      page.locator("li").filter({ hasText: "#4" }).getByText("매칭됨"),
    ).toBeVisible();
    expect(controller.getLastRequest("/teachers", "GET")).toBeTruthy();

    await page.getByPlaceholder("지도 교사 이름").fill("새 지도 교사");
    await page.getByPlaceholder("계정 ID").fill("teacher-new");
    const passwordInput = page.getByPlaceholder("비밀번호");

    await expect(passwordInput).toHaveAttribute("type", "password");
    await page.getByRole("button", { name: "비밀번호 표시" }).click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    await page.getByRole("button", { name: "비밀번호 숨기기" }).click();
    await expect(passwordInput).toHaveAttribute("type", "password");

    await page.getByRole("button", { name: "비밀번호 표시" }).click();
    await expect(passwordInput).toHaveAttribute("type", "text");
    await passwordInput.fill("teacher-password");
    await page.getByRole("button", { name: "지도 교사 추가" }).click();

    await expect(page.getByText("지도 교사가 추가되었습니다.")).toBeVisible();
    await expect(page.getByText("#5")).toBeVisible();
    await expect(page.getByText("새 지도 교사")).toBeVisible();
    await expect(
      page.locator("li").filter({ hasText: "#5" }).getByText("미매칭"),
    ).toBeVisible();
    await expect(passwordInput).toHaveValue("");
    await expect(passwordInput).toHaveAttribute("type", "password");
    expect(controller.getLastRequest("/admin/teachers", "POST")).toBeTruthy();
  });
});
