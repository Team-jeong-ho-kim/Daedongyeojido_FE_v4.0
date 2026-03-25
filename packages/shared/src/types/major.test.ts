import { formatMajorList, getMajorLabel, MAJOR_LABELS, MAJORS } from "./major";

describe("major helpers", () => {
  it("includes ETC in the supported majors", () => {
    expect(MAJORS).toContain("ETC");
    expect(MAJOR_LABELS.ETC).toBe("기타");
  });

  it("maps ETC to the localized label", () => {
    expect(getMajorLabel("ETC")).toBe("기타");
  });

  it("keeps existing major abbreviations unchanged", () => {
    expect(getMajorLabel("FE")).toBe("FE");
    expect(getMajorLabel("AI")).toBe("AI");
  });

  it("falls back to the original value for unknown majors", () => {
    expect(getMajorLabel("UNKNOWN")).toBe("UNKNOWN");
  });

  it("formats major lists with localized labels", () => {
    expect(formatMajorList(["FE", "ETC"])).toBe("FE, 기타");
  });
});
