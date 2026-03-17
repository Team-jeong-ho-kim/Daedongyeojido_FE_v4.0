"use client";

import { DocumentPreviewFallbackPanel } from "./DocumentPreviewFallbackPanel";

type PdfPreviewEmbedProps = {
  href: string;
  linkLabel?: string;
  message?: string;
  minHeight?: string;
  title: string;
};

export function PdfPreviewEmbed({
  href,
  linkLabel = "새 탭에서 PDF 열기",
  message = "브라우저에서 PDF 미리보기를 표시하지 못했습니다.",
  minHeight = "70vh",
  title,
}: PdfPreviewEmbedProps) {
  return (
    <div
      style={minHeight ? { minHeight } : undefined}
      className="flex h-full min-h-0 w-full justify-center"
    >
      <object
        data={href}
        type="application/pdf"
        style={minHeight ? { minHeight } : undefined}
        className="block h-full min-h-0 w-full bg-white"
        aria-label={title}
      >
        <DocumentPreviewFallbackPanel
          message={message}
          href={href}
          linkLabel={linkLabel}
          minHeight={minHeight}
          variant="neutral"
        />
      </object>
    </div>
  );
}
