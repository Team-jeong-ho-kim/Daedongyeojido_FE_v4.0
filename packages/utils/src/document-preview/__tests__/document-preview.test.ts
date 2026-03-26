import {
  getDocumentDownloadFileName,
  getDocumentFileExtensionLabel,
} from "../document-preview";

describe("document preview helpers", () => {
  it("keeps an explicit file extension from the file name", () => {
    expect(
      getDocumentDownloadFileName(
        "2026 동아리 개설 신청 양식.pdf",
        "https://files.test/form",
      ),
    ).toBe("2026 동아리 개설 신청 양식.pdf");
  });

  it("derives the file extension from the url when the name does not include it", () => {
    expect(
      getDocumentDownloadFileName(
        "2026 동아리 개설 신청 양식",
        "https://files.test/form.hwpx?download=1",
      ),
    ).toBe("2026 동아리 개설 신청 양식.hwpx");
  });

  it("falls back to the content type when file name and url have no extension", () => {
    expect(
      getDocumentDownloadFileName(
        "지원 양식",
        "https://files.test/form",
        "application/pdf",
      ),
    ).toBe("지원 양식.pdf");
  });

  it("returns a default base name for blank file names", () => {
    expect(
      getDocumentDownloadFileName(
        "   ",
        "https://files.test/form",
        "application/vnd.hancom.hwpx",
      ),
    ).toBe("club-creation-form.hwpx");
  });

  it("returns an uppercase extension label", () => {
    expect(
      getDocumentFileExtensionLabel("지원 양식", "https://files.test/form.hwp"),
    ).toBe("HWP");
  });
});
