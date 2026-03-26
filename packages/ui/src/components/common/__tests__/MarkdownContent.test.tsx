import { render, screen } from "@testing-library/react";
import { MarkdownContent, stripMarkdownToPlainText } from "../MarkdownContent";

describe("MarkdownContent", () => {
  it("renders headings, emphasis, lists, links, and line breaks", () => {
    render(
      <MarkdownContent
        content={`## 소개

**프론트엔드** 중심 동아리입니다.
- React
- Next.js

[지원 링크](https://example.com)
한 줄 더 소개합니다.`}
      />,
    );

    expect(
      screen.getByRole("heading", { level: 2, name: "소개" }),
    ).toBeVisible();
    expect(screen.getByText("프론트엔드")).toBeVisible();
    expect(screen.getByText("React")).toBeVisible();
    expect(screen.getByRole("link", { name: "지원 링크" })).toHaveAttribute(
      "href",
      "https://example.com",
    );
    expect(screen.getByText(/한 줄 더 소개합니다/)).toBeVisible();
  });

  it("does not render unsafe raw html", () => {
    render(
      <MarkdownContent
        content={`<script>alert("xss")</script>

안전한 소개입니다.`}
      />,
    );

    expect(screen.queryByText('alert("xss")')).not.toBeInTheDocument();
    expect(screen.getByText("안전한 소개입니다.")).toBeVisible();
  });
});

describe("stripMarkdownToPlainText", () => {
  it("converts markdown into a compact plain-text summary", () => {
    expect(
      stripMarkdownToPlainText(
        `# 제목

**강한 소개**와 [링크](https://example.com)
- 항목`,
      ),
    ).toBe("제목 강한 소개와 링크 항목");
  });
});
