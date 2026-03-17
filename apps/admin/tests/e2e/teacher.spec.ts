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
        { teacherId: 3, teacherName: "농구공" },
        { teacherId: 4, teacherName: "선생님" },
      ],
    });

    await page.goto("/mypage");
    await page.getByRole("button", { name: "지도 교사" }).click();

    await expect(
      page.getByRole("heading", { name: "지도 교사 전체 조회" }),
    ).toBeVisible();
    await expect(page.getByText("#3")).toBeVisible();
    await expect(page.getByText("농구공")).toBeVisible();
    await expect(page.getByText("#4")).toBeVisible();
    await expect(page.getByText("선생님")).toBeVisible();
    expect(controller.getLastRequest("/teachers", "GET")).toBeTruthy();

    await page.getByPlaceholder("지도 교사 이름").fill("새 지도 교사");
    await page.getByPlaceholder("계정 ID").fill("teacher-new");
    await page.getByPlaceholder("비밀번호").fill("teacher-password");
    await page.getByRole("button", { name: "지도 교사 추가" }).click();

    await expect(page.getByText("지도 교사가 추가되었습니다.")).toBeVisible();
    await expect(page.getByText("#5")).toBeVisible();
    await expect(page.getByText("새 지도 교사")).toBeVisible();
    expect(controller.getLastRequest("/admin/teachers", "POST")).toBeTruthy();
  });
});
