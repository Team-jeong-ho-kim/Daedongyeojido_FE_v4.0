import { expect, test } from "@playwright/test";
import { installStudentApiMocks, setAuthSession } from "./support/mockApi";

test.describe("Student notifications", () => {
  test.beforeEach(async ({ page }) => {
    await setAuthSession(page);
  });

  test("팀원 추가 신청 알림을 수락할 수 있다", async ({ page }) => {
    const mockApi = await installStudentApiMocks(page, {
      userAlarms: [
        {
          id: 401,
          title: "팀원 추가 신청",
          content: "홍길동 학생이 팀원 추가를 신청했습니다.",
          category: "CLUB_MEMBER_APPLY",
          isExecuted: false,
        },
      ],
    });

    await page.goto("/mypage/notifications");

    await page.getByRole("button", { name: "팀원 추가 신청" }).click();
    await page.getByRole("button", { name: "수락" }).click();

    await expect(
      page.getByRole("heading", {
        name: "팀원 추가 신청을 수락하시겠습니까?",
      }),
    ).toBeVisible();

    await page
      .getByRole("dialog")
      .getByRole("button", { name: "수락" })
      .click();

    await expect(page.getByText("수락되었습니다.")).toBeVisible();

    const acceptRequest = mockApi.getLastRequest(/\/users\/members$/, "PATCH");
    expect(acceptRequest?.body).toEqual({
      isApproved: true,
      alarmId: 401,
    });
  });

  test("동아리 합류 제안을 거절할 수 있다", async ({ page }) => {
    const mockApi = await installStudentApiMocks(page, {
      userAlarms: [
        {
          id: 402,
          title: "동아리 합류 제안",
          content: "테스트동아리 합류가 승인되었습니다.",
          category: "CLUB_ACCEPTED",
          isExecuted: false,
        },
      ],
    });

    await page.goto("/mypage/notifications");

    await page.getByRole("button", { name: "동아리 합류 제안" }).click();
    await page.getByRole("button", { name: "거절" }).click();

    await expect(
      page.getByRole("heading", {
        name: "동아리 합류를 거절하시겠습니까?",
      }),
    ).toBeVisible();

    await page
      .getByRole("dialog")
      .getByRole("button", { name: "거절" })
      .click();

    await expect(page.getByText("거절되었습니다.")).toBeVisible();

    const rejectRequest = mockApi.getLastRequest(
      /\/users\/submissions$/,
      "PATCH",
    );
    expect(rejectRequest?.body).toEqual({
      isSelected: false,
      alarmId: 402,
    });
  });
});
