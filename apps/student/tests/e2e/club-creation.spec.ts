import { expect, type Page, test } from "@playwright/test";
import {
  DEFAULT_MY_CLUB_CREATION_APPLICATION,
  installStudentApiMocks,
  setAuthSession,
} from "./support/mockApi";

const uploadClubCreationPdf = async (
  page: Page,
  name = "club-creation-form.pdf",
) => {
  await page
    .locator('input[type="file"][accept=".pdf,application/pdf"]')
    .setInputFiles({
      name,
      mimeType: "application/pdf",
      buffer: Buffer.from("%PDF-1.4 mock pdf"),
    });
};

const getTeacherSelectTrigger = (page: Page) =>
  page.getByRole("button", { name: /Teacher/ });

const getTeacherOptionCards = (page: Page) =>
  page.locator("fieldset button[aria-pressed]");

const buildMyApplication = (
  overrides: Partial<typeof DEFAULT_MY_CLUB_CREATION_APPLICATION> = {},
) => {
  const shouldResetReviews =
    overrides.status !== undefined &&
    overrides.status !== DEFAULT_MY_CLUB_CREATION_APPLICATION.status;

  return {
    ...DEFAULT_MY_CLUB_CREATION_APPLICATION,
    ...overrides,
    applicant: {
      ...DEFAULT_MY_CLUB_CREATION_APPLICATION.applicant,
      ...(overrides.applicant ?? {}),
    },
    currentReviews:
      overrides.currentReviews ??
      (shouldResetReviews
        ? []
        : DEFAULT_MY_CLUB_CREATION_APPLICATION.currentReviews),
    reviewHistory:
      overrides.reviewHistory ??
      (shouldResetReviews
        ? []
        : DEFAULT_MY_CLUB_CREATION_APPLICATION.reviewHistory),
  };
};

const fillClubCreationForm = async (page: Page) => {
  await page.getByPlaceholder("동아리 명").fill("테스트동아리");
  await page
    .locator('input[type="file"][accept=".jpg,.jpeg,.png,.webp"]')
    .setInputFiles({
      name: "club-logo.png",
      mimeType: "image/png",
      buffer: Buffer.from("mock-club-logo"),
    });
  await page
    .getByPlaceholder("동아리 한줄 소개를 작성해주세요.")
    .fill("같이 성장하는 동아리");
  await page
    .getByPlaceholder("동아리 소개 문구를 작성해주세요.")
    .fill("프로젝트와 협업 중심으로 운영하는 테스트 동아리입니다.");
  await page.getByRole("button", { name: "BE", exact: true }).click();
  await uploadClubCreationPdf(page);
};

const getMultipartFieldValue = (
  rawBody: string | null | undefined,
  fieldName: string,
) => {
  if (!rawBody) {
    return null;
  }

  const escapedFieldName = fieldName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = rawBody.match(
    new RegExp(`name="${escapedFieldName}"\\r\\n\\r\\n([^\\r]+)`),
  );

  return match?.[1] ?? null;
};

test.describe("Student club creation", () => {
  test.beforeEach(async ({ page }) => {
    await setAuthSession(page, { role: "STUDENT" });
  });

  for (const blockedRole of ["CLUB_MEMBER", "CLUB_LEADER"] as const) {
    test(`${blockedRole}는 생성 화면 대신 차단 안내 카드를 본다`, async ({
      page,
    }) => {
      await setAuthSession(page, { role: blockedRole });
      const mockApi = await installStudentApiMocks(page, {
        user: { role: blockedRole },
      });

      await page.goto("/clubs/create");

      await expect(
        page.getByRole("heading", {
          name: "새 동아리 개설 신청을 진행할 수 없습니다",
        }),
      ).toBeVisible();
      await expect(
        page.getByText(
          "동아리원 및 동아리 리더는 현재 소속 동아리 활동 중인 상태이므로 새 동아리 개설 신청 대상이 아닙니다.",
        ),
      ).toBeVisible();
      await expect(
        page.getByRole("button", { name: "마이페이지로 이동" }),
      ).toBeVisible();
      await expect(page.getByRole("button", { name: "개설 신청" })).toHaveCount(
        0,
      );
      await expect(page.getByRole("button", { name: /Teacher/ })).toHaveCount(
        0,
      );

      expect(
        mockApi.getLastRequest("/club-creation-applications/me", "GET"),
      ).toBeUndefined();
      expect(mockApi.getLastRequest("/teachers", "GET")).toBeUndefined();
    });
  }

  test("PDF가 아닌 개설 양식 파일은 거부한다", async ({ page }) => {
    await installStudentApiMocks(page);
    await page.goto("/clubs/create");

    await page
      .locator('input[type="file"][accept=".pdf,application/pdf"]')
      .setInputFiles({
        name: "club-creation-form.hwp",
        mimeType: "application/x-hwp",
        buffer: Buffer.from("mock-hwp"),
      });

    await expect(
      page.locator('input[type="file"][accept=".pdf,application/pdf"]'),
    ).toHaveValue("");
    await expect(page.getByText("club-creation-form.hwp")).toHaveCount(0);
    await expect(page.getByRole("button", { name: "미리보기" })).toHaveCount(0);
  });

  test("업로드한 PDF를 admin과 같은 모달 뷰로 미리볼 수 있다", async ({
    page,
  }) => {
    await installStudentApiMocks(page);
    await page.goto("/clubs/create");

    await uploadClubCreationPdf(page);

    await expect(page.getByText("업로드한 개설 양식")).toBeVisible();
    await expect(page.getByRole("button", { name: "미리보기" })).toBeVisible();

    await page.getByRole("button", { name: "미리보기" }).click();
    const previewModal = page.locator('[class*="max-w-6xl"]');

    await expect(
      page.getByRole("heading", { name: "문서 미리보기" }),
    ).toBeVisible();
    await expect(
      previewModal.getByText("club-creation-form.pdf"),
    ).toBeVisible();
    await expect(
      previewModal.getByRole("button", { name: "다운로드" }),
    ).toBeVisible();
    await expect(page.locator('object[type="application/pdf"]')).toBeVisible();

    await previewModal.getByRole("button", { name: "미리보기 닫기" }).click();
    await expect(
      page.getByRole("heading", { name: "문서 미리보기" }),
    ).toHaveCount(0);

    await uploadClubCreationPdf(page, "club-creation-form-v2.pdf");
    await page.getByRole("button", { name: "미리보기" }).click();
    await expect(
      previewModal.getByText("club-creation-form-v2.pdf"),
    ).toBeVisible();
    await expect(previewModal.getByText("club-creation-form.pdf")).toHaveCount(
      0,
    );
  });

  test("같은 지도 교사를 다시 클릭하면 선택이 해제된다", async ({ page }) => {
    await installStudentApiMocks(page);
    await page.goto("/clubs/create");

    const teacherSelectTrigger = getTeacherSelectTrigger(page);
    await teacherSelectTrigger.click();

    const teacherCards = page
      .locator("button[aria-pressed]")
      .filter({ hasText: "선생님" });
    const secondTeacherCard = teacherCards.nth(1);

    await secondTeacherCard.click();
    await expect(teacherSelectTrigger).toContainText("선생님");

    await teacherSelectTrigger.click();
    await expect(secondTeacherCard).toHaveAttribute("aria-pressed", "true");

    await secondTeacherCard.click();
    await expect(teacherSelectTrigger).toContainText(
      "지도 교사를 선택해주세요",
    );
  });

  test("같은 탭에서 돌아오면 최신 지도 교사 목록을 다시 불러온다", async ({
    page,
  }) => {
    const mockApi = await installStudentApiMocks(page, {
      teachers: [
        { teacherId: 4, teacherName: "asdf", matched: false },
        { teacherId: 3, teacherName: "농구공", matched: true },
        { teacherId: 1, teacherName: "선생님", matched: false },
        { teacherId: 2, teacherName: "김선생", matched: false },
      ],
    });

    await page.goto("/clubs/create");

    const teacherSelectTrigger = getTeacherSelectTrigger(page);
    await teacherSelectTrigger.click();
    await expect(getTeacherOptionCards(page)).toHaveCount(4);

    mockApi.setTeachers([
      { teacherId: 4, teacherName: "asdf", matched: false },
      { teacherId: 3, teacherName: "농구공", matched: true },
      { teacherId: 1, teacherName: "선생님", matched: false },
      { teacherId: 2, teacherName: "김선생", matched: false },
      { teacherId: 5, teacherName: "박교사", matched: false },
      { teacherId: 6, teacherName: "이교사", matched: false },
    ]);

    await page.evaluate(() => {
      window.dispatchEvent(new Event("focus"));
    });

    await expect
      .poll(() => {
        return mockApi.requests.filter(
          (request) =>
            request.method === "GET" && request.pathname.endsWith("/teachers"),
        ).length;
      })
      .toBe(2);

    await expect(getTeacherOptionCards(page)).toHaveCount(6);
    await expect(page.getByRole("button", { name: "박교사" })).toBeVisible();
    await expect(page.getByRole("button", { name: "이교사" })).toBeVisible();
  });

  test("화면을 다시 열면 최신 지도 교사 목록을 다시 불러온다", async ({
    page,
  }) => {
    const mockApi = await installStudentApiMocks(page, {
      teachers: [
        { teacherId: 4, teacherName: "asdf", matched: false },
        { teacherId: 3, teacherName: "농구공", matched: true },
        { teacherId: 1, teacherName: "선생님", matched: false },
        { teacherId: 2, teacherName: "김선생", matched: false },
      ],
    });

    await page.goto("/clubs");
    await page.getByRole("link", { name: "동아리 개설 신청하기" }).click();
    await expect(page).toHaveURL(/\/clubs\/create$/);

    const teacherSelectTrigger = getTeacherSelectTrigger(page);
    await teacherSelectTrigger.click();
    await expect(getTeacherOptionCards(page)).toHaveCount(4);

    mockApi.setTeachers([
      { teacherId: 4, teacherName: "asdf", matched: false },
      { teacherId: 3, teacherName: "농구공", matched: true },
      { teacherId: 1, teacherName: "선생님", matched: false },
      { teacherId: 2, teacherName: "김선생", matched: false },
      { teacherId: 5, teacherName: "박교사", matched: false },
      { teacherId: 6, teacherName: "이교사", matched: false },
    ]);

    await page.goBack();
    await expect(page).toHaveURL(/\/clubs$/);
    await page.getByRole("link", { name: "동아리 개설 신청하기" }).click();
    await expect(page).toHaveURL(/\/clubs\/create$/);

    await teacherSelectTrigger.click();
    await expect
      .poll(() => {
        return mockApi.requests.filter(
          (request) =>
            request.method === "GET" && request.pathname.endsWith("/teachers"),
        ).length;
      })
      .toBe(2);
    await expect(getTeacherOptionCards(page)).toHaveCount(6);
  });

  test("매칭된 지도 교사는 배지로 표시되고 선택할 수 없다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, {
      teachers: [
        { teacherId: 1, teacherName: "홍길동", matched: true },
        { teacherId: 2, teacherName: "김선생", matched: false },
      ],
    });

    await page.goto("/clubs/create");

    const teacherSelectTrigger = getTeacherSelectTrigger(page);
    await teacherSelectTrigger.click();

    const matchedTeacherCard = page
      .locator("button[aria-disabled='true']")
      .filter({ hasText: "홍길동" });

    await expect(matchedTeacherCard.getByText("매칭됨")).toBeVisible();
    await matchedTeacherCard.dispatchEvent("click");

    await expect(
      page.getByText("이미 매칭된 지도교사는 선택할 수 없습니다."),
    ).toBeVisible();
    await expect(teacherSelectTrigger).toContainText(
      "지도 교사를 선택해주세요",
    );
    await expect(matchedTeacherCard).toBeVisible();
  });

  test("지도 교사를 선택하면 개설 신청 modal이 열리고 teacherId를 포함해 전송한다", async ({
    page,
  }) => {
    const mockApi = await installStudentApiMocks(page);

    await page.goto("/clubs/create");
    await fillClubCreationForm(page);

    const teacherSelectTrigger = getTeacherSelectTrigger(page);
    await teacherSelectTrigger.click();
    const teacherCards = page
      .locator("button[aria-pressed]")
      .filter({ hasText: "선생님" });
    await teacherCards.nth(1).click();

    await page.getByRole("button", { name: "개설 신청" }).click();
    await expect(
      page.getByRole("dialog", { name: "정말 개설을 신청하시겠습니까?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "신청하기" }).click();

    await expect(page).toHaveURL(/\/mypage$/);
    await expect(
      page.getByRole("heading", { name: "마이페이지" }),
    ).toBeVisible();

    const submitRequest = mockApi.getLastRequest(
      /\/clubs\/applications$/,
      "POST",
    );
    expect(submitRequest?.rawBody).toContain("테스트동아리");
    expect(submitRequest?.rawBody).toContain("같이 성장하는 동아리");
    expect(submitRequest?.rawBody).toContain("club-creation-form.pdf");
    expect(submitRequest?.rawBody).toContain('name="teacherId"');
    expect(getMultipartFieldValue(submitRequest?.rawBody, "teacherId")).toBe(
      "2",
    );
  });

  test("지도 교사 목록 조회 실패 시 선택 UI가 비활성화되고 제출이 막힌다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, { teachersStatus: 500 });

    await page.goto("/clubs/create");
    await expect(
      page
        .getByRole("button", { name: /Teacher/ })
        .filter({ hasText: "지도 교사 목록을 불러오지 못했습니다" }),
    ).toBeDisabled();

    await fillClubCreationForm(page);
    await page.getByRole("button", { name: "개설 신청" }).click();

    await expect(
      page.getByText(
        "지도 교사 목록을 불러오지 못했습니다. 새로고침 후 다시 시도해주세요.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("dialog", { name: "정말 개설을 신청하시겠습니까?" }),
    ).toHaveCount(0);
  });

  test("선택 가능한 지도 교사가 없으면 선택 UI가 비활성화되고 제출이 막힌다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, { teachers: [] });

    await page.goto("/clubs/create");
    await expect(
      page
        .getByRole("button", { name: /Teacher/ })
        .filter({ hasText: "선택 가능한 지도 교사가 없습니다" }),
    ).toBeDisabled();

    await fillClubCreationForm(page);
    await page.getByRole("button", { name: "개설 신청" }).click();

    await expect(
      page.getByText(
        "선택 가능한 지도 교사가 없습니다. 관리자에게 문의해주세요.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("dialog", { name: "정말 개설을 신청하시겠습니까?" }),
    ).toHaveCount(0);
  });

  test("모든 지도 교사가 이미 매칭되어 있으면 목록은 열리지만 제출은 막힌다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, {
      teachers: [
        { teacherId: 1, teacherName: "홍길동", matched: true },
        { teacherId: 2, teacherName: "김선생", matched: true },
      ],
    });

    await page.goto("/clubs/create");

    const teacherSelectTrigger = page
      .getByRole("button", { name: /Teacher/ })
      .filter({ hasText: "선택 가능한 지도 교사가 없습니다" });
    await expect(teacherSelectTrigger).toBeEnabled();

    await teacherSelectTrigger.click();
    await expect(page.getByText("매칭됨")).toHaveCount(2);

    await fillClubCreationForm(page);
    await page.getByRole("button", { name: "개설 신청" }).click();

    await expect(
      page.getByText(
        "선택 가능한 지도 교사가 없습니다. 관리자에게 문의해주세요.",
      ),
    ).toBeVisible();
    await expect(
      page.getByRole("dialog", { name: "정말 개설을 신청하시겠습니까?" }),
    ).toHaveCount(0);
  });

  test("이미 신청한 학생은 생성 페이지 대신 내 신청 상세로 이동한다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, {
      myClubCreationApplication: buildMyApplication({
        status: "UNDER_REVIEW",
        currentReviews: [],
      }),
    });

    await page.goto("/clubs/create");

    await expect(page).toHaveURL(/\/mypage\/club-creation$/, {
      timeout: 10000,
    });
    await expect(page.getByText("현재 신청서가 검토 중입니다.")).toBeVisible();
  });

  for (const statusCase of [
    {
      status: "SUBMITTED",
      title: "신청서가 정상적으로 제출되었습니다.",
      hasEdit: false,
    },
    {
      status: "UNDER_REVIEW",
      title: "현재 신청서가 검토 중입니다.",
      hasEdit: false,
    },
    {
      status: "CHANGES_REQUESTED",
      title: "수정 요청이 도착했습니다.",
      hasEdit: true,
    },
    {
      status: "APPROVED",
      title: "개설 신청이 승인되었습니다.",
      hasEdit: false,
    },
    {
      status: "REJECTED",
      title: "개설 신청이 반려되었습니다.",
      hasEdit: false,
    },
  ] as const) {
    test(`상태 ${statusCase.status}에 맞는 상세 UI를 노출한다`, async ({
      page,
    }) => {
      await installStudentApiMocks(page, {
        myClubCreationApplication: buildMyApplication({
          status: statusCase.status,
        }),
      });

      await page.goto("/mypage/club-creation");

      await expect(
        page.getByRole("heading", { name: "내 개설 신청" }),
      ).toBeVisible();
      await expect(
        page.getByText(statusCase.title, { exact: true }),
      ).toBeVisible();

      if (statusCase.hasEdit) {
        await expect(page.getByText("수정 후 다시 제출하기")).toBeVisible();
      } else {
        await expect(page.getByText("수정 후 다시 제출하기")).toHaveCount(0);
      }
    });
  }

  test("수정 요청 상태에서만 수정 페이지에 들어가 PATCH 후 재제출한다", async ({
    page,
  }) => {
    const mockApi = await installStudentApiMocks(page, {
      myClubCreationApplication: buildMyApplication({
        status: "CHANGES_REQUESTED",
      }),
    });

    await page.goto("/mypage/club-creation/edit");
    await expect(
      page.getByText("수정 요청 코멘트를 반영해 신청서를 다시 제출하세요"),
    ).toBeVisible();

    await page
      .getByPlaceholder("동아리 한줄 소개를 작성해주세요.")
      .fill("수정한 한줄 소개");
    await uploadClubCreationPdf(page, "club-creation-form-v2.pdf");

    await page.getByRole("button", { name: "수정 후 다시 제출" }).click();
    await page.getByRole("button", { name: "다시 제출하기" }).click();

    await expect(page).toHaveURL(/\/mypage$/);
    await page.goto("/mypage/club-creation");
    await expect(
      page.getByText("검토 차수 3차", { exact: true }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: "수정 후 다시 제출하기" }),
    ).toHaveCount(0);
    expect(
      mockApi.getLastRequest("/club-creation-applications/41", "PATCH"),
    ).toBeTruthy();
    expect(
      mockApi.getLastRequest("/club-creation-applications/41/submit", "POST"),
    ).toBeTruthy();
  });

  test("수정 요청이 아니면 수정 페이지 접근이 상세로 되돌려진다", async ({
    page,
  }) => {
    await installStudentApiMocks(page, {
      myClubCreationApplication: buildMyApplication({
        status: "UNDER_REVIEW",
        currentReviews: [],
      }),
    });

    await page.goto("/mypage/club-creation/edit");

    await expect(page).toHaveURL(/\/mypage\/club-creation$/);
    await expect(page.getByText("현재 신청서가 검토 중입니다.")).toBeVisible();
  });
});
