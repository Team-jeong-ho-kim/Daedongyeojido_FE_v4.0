import { expect, test } from "@playwright/test";
import {
  buildAnnouncements,
  buildClubs,
  installStudentApiMocks,
  setAuthSession,
} from "./support/mockApi";

test.describe("Student discovery flows", () => {
  test("학생은 공고가 비어 있을 때 empty state를 본다", async ({ page }) => {
    await setAuthSession(page);
    await installStudentApiMocks(page, {
      announcements: [],
    });

    await page.goto("/announcements");

    await expect(
      page.getByRole("heading", { name: "공고 전체 조회" }),
    ).toBeVisible();
    await expect(page.getByText("공고가 없습니다.")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "동아리 공고 개설하기" }),
    ).toHaveCount(0);
  });

  test("동아리 목록은 페이지네이션과 카드 이동이 동작한다", async ({
    page,
  }) => {
    await setAuthSession(page);
    await installStudentApiMocks(page, {
      clubs: buildClubs(9),
    });

    await page.goto("/clubs");

    await expect(
      page.getByRole("heading", { name: "동아리 전체 조회" }),
    ).toBeVisible();
    await expect(page.locator("#club-9")).toHaveCount(0);

    await page.getByRole("button", { name: "2", exact: true }).click();
    await expect(page.locator("#club-9")).toBeVisible();

    await page.locator("#club-9").click();
    await expect(page).toHaveURL(/\/clubs\/9$/);
    await expect(page.getByRole("button", { name: "소개" })).toBeVisible();
  });

  test("동아리 리더는 닫힌 공고를 게시할 수 있다", async ({ page }) => {
    await setAuthSession(page, { role: "CLUB_LEADER" });
    const mockApi = await installStudentApiMocks(page, {
      user: {
        role: "CLUB_LEADER",
        clubName: "테스트동아리",
      },
      announcementDetail: {
        status: "CLOSED",
        applicationFormId: null,
      },
      applicationForms: [
        {
          applicationFormId: 31,
          applicationFormTitle: "2026 백엔드 지원서",
          submissionDuration: "2026-12-31",
        },
        {
          applicationFormId: 32,
          applicationFormTitle: "2026 디자인 지원서",
          submissionDuration: "2026-11-30",
        },
      ],
    });

    await page.goto("/announcements/1");

    await page.getByRole("button", { name: "공고 게시하기" }).click();
    await expect(
      page.getByRole("heading", { name: "지원서 폼 선택" }),
    ).toBeVisible();

    await page.getByRole("button", { name: /2026 백엔드 지원서/ }).click();
    await page.getByRole("button", { name: "확인" }).click();

    await expect(page.getByText("공고가 게시되었습니다")).toBeVisible();

    const publishRequest = mockApi.getLastRequest(
      /\/announcements\/open\/1$/,
      "PATCH",
    );
    expect(publishRequest?.body).toEqual({ applicationFormId: 31 });
  });

  test("동아리 리더는 공고 상세에서 지원내역을 조회할 수 있다", async ({
    page,
  }) => {
    await setAuthSession(page, { role: "CLUB_LEADER" });
    await installStudentApiMocks(page, {
      user: {
        role: "CLUB_LEADER",
        clubName: "테스트동아리",
      },
      applicants: [
        {
          submissionId: 501,
          userName: "김지원",
          classNumber: "2401",
          profileImage: "/images/icons/profile.svg",
          major: "BE",
        },
        {
          submissionId: 502,
          userName: "박디자인",
          classNumber: "2402",
          profileImage: "/images/icons/profile.svg",
          major: "DESIGN",
        },
      ],
    });

    await page.goto("/announcements/1");
    await page.getByRole("button", { name: "지원내역" }).click();

    await expect(page.getByText("김지원")).toBeVisible();
    await expect(page.getByText("2401")).toBeVisible();
    await expect(page.getByText("박디자인")).toBeVisible();
  });

  test("타 동아리 리더는 다른 동아리 공고에서 관리 버튼을 보지 않는다", async ({
    page,
  }) => {
    await setAuthSession(page, { role: "CLUB_LEADER" });
    await installStudentApiMocks(page, {
      user: {
        role: "CLUB_LEADER",
        clubName: "다른동아리",
      },
      clubDetail: {
        club: {
          clubName: "테스트동아리",
          introduction: "테스트 소개",
          oneLiner: "테스트 한 줄 소개",
          clubImage: "/images/icons/profile.svg",
          majors: ["BE"],
          links: ["https://example.com/club"],
        },
      },
      announcementDetail: {
        status: "CLOSED",
        applicationFormId: 11,
      },
    });

    await page.goto("/announcements/1");

    await expect(page.getByRole("button", { name: "지원내역" })).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "공고 게시하기" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "공고 수정하기" }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "공고 삭제하기" }),
    ).toHaveCount(0);
  });

  test("학생은 공고 카드에서 지원 페이지로 이동할 수 있다", async ({
    page,
  }) => {
    await setAuthSession(page);
    await installStudentApiMocks(page, {
      announcements: buildAnnouncements(2),
      announcementDetail: {
        status: "OPEN",
      },
    });

    await page.goto("/announcements");
    await page.getByText("테스트 공고 1").click();

    await expect(page).toHaveURL(/\/announcements\/1$/);
    await page.getByRole("link", { name: "지원서 작성하기" }).click();
    await expect(page).toHaveURL(/\/announcements\/1\/apply$/);
  });

  test("학생은 공고 상세 헤더와 CTA로 동아리 상세로 이동할 수 있다", async ({
    page,
  }) => {
    await setAuthSession(page);
    await installStudentApiMocks(page);

    await page.goto("/announcements/1");

    await page
      .getByRole("link", { name: "테스트동아리 동아리 상세로 이동" })
      .click();
    await expect(page).toHaveURL(/\/clubs\/1$/);

    await page.goto("/announcements/1");
    await page.getByRole("link", { name: "동아리 소개 보러가기" }).click();
    await expect(page).toHaveURL(/\/clubs\/1$/);
  });

  test("학생은 공고 지원서 페이지 헤더와 CTA로 동아리 상세로 이동할 수 있다", async ({
    page,
  }) => {
    await setAuthSession(page);
    await installStudentApiMocks(page, {
      announcementDetail: {
        status: "OPEN",
      },
    });

    await page.goto("/announcements/1/apply");

    await page
      .getByRole("link", { name: "테스트동아리 동아리 상세로 이동" })
      .click();
    await expect(page).toHaveURL(/\/clubs\/1$/);

    await page.goto("/announcements/1/apply");
    await page.getByRole("link", { name: "동아리 소개 보러가기" }).click();
    await expect(page).toHaveURL(/\/clubs\/1$/);
  });
});
