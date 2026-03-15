"use client";

import { DocumentPreviewFallbackPanel } from "ui";
import { getDocumentPreviewPayload, parseDocumentPreviewHash } from "utils";

export default function AdminDocumentPreviewError() {
  const previewPayload =
    typeof window === "undefined"
      ? null
      : getDocumentPreviewPayload(
          parseDocumentPreviewHash(window.location.hash).previewKey,
        );

  return (
    <div className="min-h-screen bg-gray-50 p-3 md:p-5">
      <DocumentPreviewFallbackPanel
        message="문서 미리보기를 불러오지 못했습니다."
        href={previewPayload?.fileUrl}
      />
    </div>
  );
}
