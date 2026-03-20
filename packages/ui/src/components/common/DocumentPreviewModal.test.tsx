import { fireEvent, render, screen } from "@testing-library/react";
import { DocumentPreviewModal } from "./DocumentPreviewModal";

describe("DocumentPreviewModal", () => {
  it("renders content only when open and closes on escape", () => {
    const onClose = vi.fn();

    render(
      <DocumentPreviewModal fileName="preview.pdf" isOpen onClose={onClose}>
        <div>preview body</div>
      </DocumentPreviewModal>,
    );

    expect(
      screen.getByRole("heading", { name: "문서 미리보기" }),
    ).toBeVisible();
    expect(screen.getByText("preview body")).toBeVisible();
    expect(document.body.style.overflow).toBe("hidden");

    fireEvent.keyDown(window, { key: "Escape" });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("returns null when closed", () => {
    render(
      <DocumentPreviewModal
        fileName="preview.pdf"
        isOpen={false}
        onClose={vi.fn()}
      >
        <div>preview body</div>
      </DocumentPreviewModal>,
    );

    expect(screen.queryByText("preview body")).not.toBeInTheDocument();
  });
});
