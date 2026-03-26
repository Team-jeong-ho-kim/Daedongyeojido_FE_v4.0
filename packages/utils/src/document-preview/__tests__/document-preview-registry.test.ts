import { getDocumentPreviewPdfPath } from "../document-preview-registry";

describe("document preview registry", () => {
  it("returns the registered preview path for known files", () => {
    expect(getDocumentPreviewPdfPath(1)).toBe("/documents/previews/1.pdf");
  });

  it("returns null for unknown files", () => {
    expect(getDocumentPreviewPdfPath(999)).toBeNull();
  });
});
