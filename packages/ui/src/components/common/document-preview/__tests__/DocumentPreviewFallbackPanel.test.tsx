import { render, screen } from "@testing-library/react";
import { DocumentPreviewFallbackPanel } from "../DocumentPreviewFallbackPanel";

describe("DocumentPreviewFallbackPanel", () => {
  it("renders the message and optional link", () => {
    render(
      <DocumentPreviewFallbackPanel
        href="/documents/1"
        linkLabel="문서 열기"
        message="미리보기를 불러오지 못했습니다."
      />,
    );

    expect(screen.getByText("미리보기를 불러오지 못했습니다.")).toBeVisible();
    expect(screen.getByRole("link", { name: "문서 열기" })).toHaveAttribute(
      "href",
      "/documents/1",
    );
  });

  it("omits the link when href is not provided", () => {
    render(
      <DocumentPreviewFallbackPanel message="파일 형식을 확인할 수 없습니다." />,
    );

    expect(
      screen.queryByRole("link", { name: "새 탭에서 문서 열기" }),
    ).not.toBeInTheDocument();
  });
});
