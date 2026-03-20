import { expect, test } from "@playwright/test";
import {
  installTeacherApiMocks,
  setTeacherAuthSession,
} from "./support/mockApi";

test.describe("Teacher app", () => {
  test("홈 화면은 마이페이지로 리다이렉트된다", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/mypage$/);
  });

  test("세션이 있으면 검토 신청 목록을 조회할 수 있다", async ({ page }) => {
    await setTeacherAuthSession(page);
    await installTeacherApiMocks(page);

    await page.goto("/mypage");

    await expect(page.getByText("검토 신청 목록")).toBeVisible();
    await expect(page.getByText("테스트동아리")).toBeVisible();
    await expect(page.getByText("김교사")).toBeVisible();
    await expect(page.getByText("상세 검토하기")).toBeVisible();
  });
});
