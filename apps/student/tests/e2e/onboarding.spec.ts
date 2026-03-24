import { expect, test } from "@playwright/test";
import { installStudentApiMocks, setAuthSession } from "./support/mockApi";

test.describe("Student onboarding", () => {
  test.beforeEach(async ({ page }) => {
    await setAuthSession(page);
  });

  test("필수 입력이 비어 있으면 검증 메시지를 보여준다", async ({ page }) => {
    await installStudentApiMocks(page, {
      user: {
        profileImage: null,
        introduction: null,
        link: [],
        major: [],
      },
    });

    await page.goto("/onboarding");
    await page.getByRole("button", { name: "저장 완료" }).click();

    await expect(page.getByText("프로필 사진을 업로드해주세요")).toBeVisible();
    await expect(page.getByText("전공을 선택해주세요")).toBeVisible();
    await expect(page.getByText("한줄 소개를 입력해주세요")).toBeVisible();
  });

  test("링크 없이 필수 정보를 제출하면 마이페이지로 이동한다", async ({
    page,
  }) => {
    const mockApi = await installStudentApiMocks(page, {
      user: {
        introduction: null,
        link: [],
        major: [],
      },
      updatedUser: {
        introduction: "대동여지도 테스트 소개",
        link: [],
        major: ["BE"],
        profileImage: "/images/icons/profile.svg",
      },
    });

    await page.goto("/onboarding");

    await page.locator('input[type="file"]').setInputFiles({
      name: "profile.png",
      mimeType: "image/png",
      buffer: Buffer.from("playwright-profile-image"),
    });
    await page.getByPlaceholder("010-xxxx-xxxx").fill("01012341234");
    await page.getByRole("button", { name: "BE", exact: true }).click();
    await page
      .getByPlaceholder("한줄 소개를 입력해주세요!")
      .fill("대동여지도 테스트 소개");

    await page.getByRole("button", { name: "저장 완료" }).click();

    await expect(page.getByText("정보가 저장되었습니다.")).toBeVisible();
    await page.waitForURL("**/mypage");

    await expect(
      page.getByRole("heading", { name: "마이페이지" }),
    ).toBeVisible();
    await expect(page.getByText("대동여지도 테스트 소개")).toBeVisible();

    const submitRequest = mockApi.getLastRequest(/\/users\/my-info$/, "PATCH");
    expect(submitRequest?.rawBody).toContain("01012341234");
    expect(submitRequest?.rawBody).toContain("대동여지도 테스트 소개");
    expect(submitRequest?.rawBody).toContain("BE");
    expect(submitRequest?.rawBody).not.toContain('name="links"');
  });
});
