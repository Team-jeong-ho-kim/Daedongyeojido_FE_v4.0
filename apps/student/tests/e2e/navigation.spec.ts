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

  test("비로그인 사용자는 공고 상세에서 지원서 작성하기 클릭 시 로그인 토스트를 본다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, {
      announcementDetail: {
        status: "OPEN",
      },
    });

    await page.goto("/announcements/1");

    await expect(page.getByText("대표자 연락처")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "지원서 작성하기" }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "지원서 작성하기 (종료)" }),
    ).toHaveCount(0);

    await page.getByRole("link", { name: "지원서 작성하기" }).click();

    await expect(page).toHaveURL(/\/announcements\/1$/);
    await expect(page.getByText("로그인 후 이용해주세요.")).toBeVisible();
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
    await Promise.all([
      page.waitForURL(/\/clubs\/1$/),
      page
        .getByRole("link", { name: "동아리 소개 보러가기" })
        .click({ force: true }),
    ]);
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
    await Promise.all([
      page.waitForURL(/\/clubs\/1$/),
      page
        .getByRole("link", { name: "동아리 소개 보러가기" })
        .click({ force: true }),
    ]);
  });

  test("동아리 소속 사용자는 지원서 작성 페이지에서 지원하기 버튼을 보지 않는다", async ({
    page,
  }) => {
    await setAuthSession(page, { role: "CLUB_MEMBER" });
    await installStudentApiMocks(page, {
      user: {
        role: "CLUB_MEMBER",
        clubName: "테스트동아리",
      },
      announcementDetail: {
        status: "OPEN",
      },
    });

    await page.goto("/announcements/1/apply");

    await expect(page.getByText("인적 사항")).toBeVisible();
    await expect(page.getByText("질문 답변")).toBeVisible();
    await expect(page.getByRole("button", { name: "지원하기" })).toHaveCount(0);
  });

  test("학생은 지원서 자기소개와 질문 답변을 글자수 제한 내로만 작성할 수 있다", async ({
    page,
  }) => {
    await setAuthSession(page);
    const mockApi = await installStudentApiMocks(page, {
      announcementDetail: {
        status: "OPEN",
      },
    });

    const shortAnswer = "짧은 답변입니다.";
    const longAnswer = "가".repeat(520);
    const limitedAnswer = longAnswer.slice(0, 500);
    const multilineAnswer = Array.from(
      { length: 8 },
      (_, index) => `답변 ${index + 1}줄`,
    ).join("\n");
    const shortIntroduction = "짧은 자기소개입니다.";
    const longIntroduction = "나".repeat(520);
    const limitedIntroduction = longIntroduction.slice(0, 500);
    const multilineIntroduction = Array.from(
      { length: 10 },
      (_, index) => `자기소개 ${index + 1}줄`,
    ).join("\n");
    const introductionField = page.getByLabel("자기소개");
    const answerField = page.getByLabel("Q1. 지원 동기를 작성해주세요.");

    await page.goto("/announcements/1/apply");

    const introductionInitialHeight = await introductionField.evaluate(
      (element) => element.clientHeight,
    );
    await introductionField.fill(multilineIntroduction);
    await expect(introductionField).toHaveValue(multilineIntroduction);
    await expect
      .poll(() => introductionField.evaluate((element) => element.clientHeight))
      .toBeGreaterThan(introductionInitialHeight);

    await introductionField.fill(shortIntroduction);
    await expect(introductionField).toHaveValue(shortIntroduction);
    await expect(
      page.getByText(`${shortIntroduction.length}/500`, { exact: true }),
    ).toBeVisible();

    await introductionField.fill(longIntroduction);
    await expect(introductionField).toHaveValue(limitedIntroduction);
    await expect(page.getByText("500/500", { exact: true })).toBeVisible();
    await expect(
      page.getByText("자기소개는 500자까지 입력 가능합니다"),
    ).toBeVisible();

    const answerInitialHeight = await answerField.evaluate(
      (element) => element.clientHeight,
    );
    await answerField.fill(multilineAnswer);
    await expect(answerField).toHaveValue(multilineAnswer);
    await expect
      .poll(() => answerField.evaluate((element) => element.clientHeight))
      .toBeGreaterThan(answerInitialHeight);

    await answerField.fill(shortAnswer);
    await expect(answerField).toHaveValue(shortAnswer);
    await expect(
      page.getByText(`${shortAnswer.length}/500`, { exact: true }),
    ).toBeVisible();

    await answerField.fill(longAnswer);
    await expect(answerField).toHaveValue(limitedAnswer);
    await expect(page.getByText("500/500", { exact: true })).toHaveCount(2);
    await expect(
      page.getByText("질문 답변은 500자까지 입력 가능합니다"),
    ).toBeVisible();

    await page.getByLabel("이름").fill("홍길동");
    await page.getByLabel("학번").fill("2401");

    await page.getByRole("button", { name: "지원하기" }).click();
    await page.getByRole("button", { name: "생성하기" }).click();

    const submitRequest = mockApi.getLastRequest(/\/applications\/11$/, "POST");
    const submitBody = submitRequest?.body as
      | {
          introduction?: string;
          answer?: Array<{
            applicationQuestionId: number;
            answer: string;
          }>;
        }
      | undefined;

    expect(submitBody?.introduction).toBe(limitedIntroduction);
    expect(submitBody?.introduction).toHaveLength(500);
    expect(submitBody?.answer?.[0]).toEqual({
      applicationQuestionId: 1,
      answer: limitedAnswer,
    });
    expect(submitBody?.answer?.[0]?.answer).toHaveLength(500);
  });

  test("학생은 지원서 수정 화면에서도 자기소개와 질문 답변을 500자 내로만 수정할 수 있다", async ({
    page,
  }) => {
    await setAuthSession(page);
    const mockApi = await installStudentApiMocks(page);

    const longIntroduction = "자".repeat(520);
    const limitedIntroduction = longIntroduction.slice(0, 500);
    const longAnswer = "답".repeat(520);
    const limitedAnswer = longAnswer.slice(0, 500);
    const introductionField = page.getByPlaceholder("자기소개를 작성해주세요.");
    const answerField = page.getByPlaceholder("질문의 답변을 작성해주세요.");

    await page.goto("/mypage/applications/501/edit");

    await expect(page.getByText("지원서 수정", { exact: true })).toBeVisible();

    await introductionField.fill(longIntroduction);
    await expect(introductionField).toHaveValue(limitedIntroduction);
    await expect(page.getByText("500/500", { exact: true })).toBeVisible();
    await expect(
      page.getByText("자기소개는 500자까지 입력 가능합니다"),
    ).toBeVisible();

    await answerField.fill(longAnswer);
    await expect(answerField).toHaveValue(limitedAnswer);
    await expect(page.getByText("500/500", { exact: true })).toHaveCount(2);
    await expect(
      page.getByText("질문 답변은 500자까지 입력 가능합니다"),
    ).toBeVisible();

    await Promise.all([
      page.waitForURL(/\/mypage\/applications\/501$/),
      page.getByRole("button", { name: "수정 완료" }).click(),
    ]);

    const updateRequest = mockApi.getLastRequest(
      /\/applications\/501$/,
      "PATCH",
    );
    const updateBody = updateRequest?.body as
      | {
          introduction?: string;
          answer?: Array<{
            applicationQuestionId: number;
            answer: string;
          }>;
        }
      | undefined;

    expect(updateBody?.introduction).toBe(limitedIntroduction);
    expect(updateBody?.introduction).toHaveLength(500);
    expect(updateBody?.answer?.[0]).toEqual({
      applicationQuestionId: 1,
      answer: limitedAnswer,
    });
    expect(updateBody?.answer?.[0]?.answer).toHaveLength(500);
  });
});
