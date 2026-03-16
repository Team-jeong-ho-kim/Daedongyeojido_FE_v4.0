import { expect, type Page, test } from "@playwright/test";
import { installStudentApiMocks, setAuthSession } from "./support/mockApi";

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
  page.locator("button[aria-controls]");

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

    const uploadedPdfCard = page.locator(
      'article[aria-label="업로드한 개설 양식"]',
    );

    await expect(uploadedPdfCard).toBeVisible();
    await expect(
      uploadedPdfCard.getByRole("button", { name: "미리보기" }),
    ).toBeVisible();

    await uploadedPdfCard.getByRole("button", { name: "미리보기" }).click();
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
    await expect(uploadedPdfCard).toBeVisible();

    await uploadedPdfCard.getByRole("button", { name: "미리보기" }).click();
    await expect(
      previewModal.getByText("club-creation-form-v2.pdf"),
    ).toBeVisible();
    await expect(previewModal.getByText("club-creation-form.pdf")).toHaveCount(
      0,
    );
    await expect(
      previewModal.getByRole("button", { name: "다운로드" }),
    ).toBeVisible();
    await expect(page.locator('object[type="application/pdf"]')).toBeVisible();
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
    await expect(
      teacherSelectTrigger.filter({ hasText: "선생님" }),
    ).toBeVisible();

    await teacherSelectTrigger.filter({ hasText: "선생님" }).click();
    await expect(secondTeacherCard).toHaveAttribute("aria-pressed", "true");

    await secondTeacherCard.click();
    await expect(
      teacherSelectTrigger.filter({ hasText: "지도 교사를 선택해주세요" }),
    ).toBeVisible();
  });

  test("지도 교사를 선택하면 개설 신청 modal이 열리고 teacherId를 포함해 전송한다", async ({
    page,
  }) => {
    const mockApi = await installStudentApiMocks(page);

    await page.goto("/clubs/create");
    await fillClubCreationForm(page);

    const teacherSelectTrigger = getTeacherSelectTrigger(page);
    await teacherSelectTrigger
      .filter({ hasText: "지도 교사를 선택해주세요" })
      .click();
    const teacherCards = page
      .locator("button[aria-pressed]")
      .filter({ hasText: "선생님" });
    const secondTeacherCard = teacherCards.nth(1);
    await secondTeacherCard.click();
    await expect(
      teacherSelectTrigger.filter({ hasText: "선생님" }),
    ).toBeVisible();

    await page.getByRole("button", { name: "개설 신청" }).click();
    await expect(
      page.getByRole("dialog", { name: "정말 개설을 신청하시겠습니까?" }),
    ).toBeVisible();
    await page.getByRole("button", { name: "신청하기" }).click();

    await expect(
      page.getByText(
        "개설 신청이 완료되었습니다. 관리자에서 수락 시 동아리가 개설됩니다",
      ),
    ).toBeVisible();

    const submitRequest = mockApi.getLastRequest(
      /\/clubs\/applications$/,
      "POST",
    );
    expect(submitRequest?.rawBody).toContain("테스트동아리");
    expect(submitRequest?.rawBody).toContain("같이 성장하는 동아리");
    expect(submitRequest?.rawBody).toContain("club-creation-form.pdf");
    expect(submitRequest?.rawBody).toContain("clubCreationForm");
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
        .locator("button[aria-controls]")
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
        .locator("button[aria-controls]")
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
});
