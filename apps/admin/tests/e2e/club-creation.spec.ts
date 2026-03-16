import { expect, test } from "@playwright/test";
import { installAdminApiMocks, setAdminAuthSession } from "./support/mockApi";

test.describe("Admin club creation tab", () => {
  test.beforeEach(async ({ page }) => {
    await setAdminAuthSession(page);
  });

  test("전체 조회 카드 클릭으로 상세를 열고 소개 문구 라인은 노출하지 않는다", async ({
    page,
  }) => {
    const controller = await installAdminApiMocks(page, {
      clubCreationApplications: [
        {
          clubId: 5,
          clubName: "발로란트",
          clubImage:
            "https://dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com/club-valorant.png",
          introduction: "전략과 협업 중심으로 운영하는 게임 동아리입니다.",
          majors: ["FE", "BE", "DESIGN"],
        },
      ],
      clubCreationApplicationDetails: {
        5: {
          club: {
            clubName: "발로란트",
            introduction: "전략과 협업 중심으로 운영하는 게임 동아리입니다.",
            oneLiner: "정승우",
            clubImage:
              "https://dsm-s3-bucket-entry.s3.ap-northeast-2.amazonaws.com/club-valorant.png",
            majors: ["FE", "BE", "DESIGN"],
            links: [
              "https://github.com/Team-jeong-ho-kim/Daedongyeojido_FE_v4.0",
              "https://github.com/Team-jeong-ho-kim/Daedongyeojido_FE_v4.0",
              "https://daedongyeojido.site",
            ],
          },
          userName: "정승우",
          classNumber: "3212",
          clubCreationForm: "/documents/previews/1.pdf",
        },
      },
    });

    await page.goto("/mypage");
    await page.getByRole("button", { name: "동아리 개설" }).click();
    await page.getByRole("button", { name: "조회" }).click();

    await expect(
      page.getByRole("heading", { name: "동아리 개설 신청 전체 조회" }),
    ).toBeVisible();
    await expect(
      page.getByText("전략과 협업 중심으로 운영하는 게임 동아리입니다."),
    ).toHaveCount(0);
    await expect(
      page.getByRole("heading", { name: "동아리 개설 신청 상세 조회" }),
    ).toHaveCount(0);
    await expect(page.getByPlaceholder("개설 신청 ID")).toHaveCount(0);

    await page.getByText("발로란트").click();

    await expect(page.getByRole("heading", { name: "발로란트" })).toBeVisible();
    await expect(
      page.getByText("동아리 개설 신청", { exact: true }),
    ).toBeVisible();
    await expect(page.getByText("개설 신청 ID #5")).toBeVisible();
    await expect(page.getByText('" 정승우 "')).toBeVisible();
    await expect(page.getByText("신청자 정보")).toBeVisible();
    await expect(page.getByText("이름")).toBeVisible();
    await expect(page.getByText("정승우", { exact: true })).toBeVisible();
    await expect(page.getByText("학번")).toBeVisible();
    await expect(page.getByText("3212")).toBeVisible();
    await expect(page.getByText("동아리 관련 링크")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "개설 신청 양식" }),
    ).toBeVisible();
    await expect(page.getByRole("button", { name: "미리보기" })).toBeVisible();
    await expect(
      page.getByText(
        "https://github.com/Team-jeong-ho-kim/Daedongyeojido_FE_v4.0",
      ),
    ).toHaveCount(1);
    await expect(page.getByText("https://daedongyeojido.site")).toBeVisible();
    expect(
      controller.getLastRequest("/admin/club-creation-application/5", "GET"),
    ).toBeTruthy();

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
    await page.getByRole("button", { name: "미리보기 닫기" }).last().click();

    await page.getByLabel("상세 조회 닫기").click();
    await expect(page.getByRole("heading", { name: "발로란트" })).toHaveCount(
      0,
    );
  });

  test("수락과 거절 버튼은 상세를 열지 않고 처리 요청만 보낸다", async ({
    page,
  }) => {
    const controller = await installAdminApiMocks(page, {
      clubCreationApplications: [
        {
          clubId: 5,
          clubName: "발로란트",
          clubImage: "",
          introduction: "전략과 협업 중심으로 운영하는 게임 동아리입니다.",
          majors: ["FE", "BE"],
        },
        {
          clubId: 6,
          clubName: "아트메이커",
          clubImage: "",
          introduction: "브랜딩과 그래픽 작업을 함께하는 동아리입니다.",
          majors: ["DESIGN"],
        },
      ],
    });

    await page.goto("/mypage");
    await page.getByRole("button", { name: "동아리 개설" }).click();
    await page.getByRole("button", { name: "조회" }).click();

    await page
      .getByLabel("발로란트 개설 신청 상세 조회")
      .locator("xpath=..")
      .getByRole("button", { name: "수락" })
      .click();

    await expect(page.getByRole("heading", { name: "발로란트" })).toHaveCount(
      0,
    );
    await expect(page.getByText("동아리 개설을 수락했습니다.")).toBeVisible();
    expect(
      controller.getLastRequest("/admin/clubs/applications/5", "PATCH"),
    ).toBeTruthy();

    await page
      .getByLabel("아트메이커 개설 신청 상세 조회")
      .locator("xpath=..")
      .getByRole("button", { name: "거절" })
      .click();

    await expect(page.getByRole("heading", { name: "아트메이커" })).toHaveCount(
      0,
    );
    await expect(page.getByText("동아리 개설을 거절했습니다.")).toBeVisible();
    expect(
      controller.getLastRequest("/admin/clubs/applications/6", "PATCH"),
    ).toBeTruthy();
  });
});
