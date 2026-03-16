"use client";

import { DocumentPreviewFallbackPanel } from "./DocumentPreviewFallbackPanel";

type PdfPreviewEmbedProps = {
  href: string;
  linkLabel?: string;
  message?: string;
  minHeightClassName?: string;
  title: string;
};

export function PdfPreviewEmbed({
  href,
  linkLabel = "새 탭에서 PDF 열기",
  message = "브라우저에서 PDF 미리보기를 표시하지 못했습니다.",
  minHeightClassName = "min-h-[70vh]",
  title,
}: PdfPreviewEmbedProps) {
  return (
    <div className={`flex w-full justify-center ${minHeightClassName}`}>
      <object
        data={href}
        type="application/pdf"
        className={`w-full bg-white ${minHeightClassName}`}
        aria-label={title}
      >
        <DocumentPreviewFallbackPanel
          message={message}
          href={href}
          linkLabel={linkLabel}
          minHeightClassName={minHeightClassName}
          variant="neutral"
        />
      </object>
    </div>
  );
}
