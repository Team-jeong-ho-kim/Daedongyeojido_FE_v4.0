"use client";

import { useEffect, useState } from "react";
import { DocumentPreviewLoadingState } from "ui";
import { getDocumentPreviewPayload, parseDocumentPreviewHash } from "utils";
import DocumentPreviewContent from "@/components/main/documents/DocumentPreviewContent";

export default function StudentDocumentPreviewPage() {
  const [fileName, setFileName] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [isHashReady, setIsHashReady] = useState(false);

  useEffect(() => {
    const syncFromHash = () => {
      const { previewKey } = parseDocumentPreviewHash(window.location.hash);
      const previewPayload = getDocumentPreviewPayload(previewKey);

      setFileName(previewPayload?.fileName ?? "");
      setFileUrl(previewPayload?.fileUrl ?? "");
      setIsHashReady(true);
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);

    return () => {
      window.removeEventListener("hashchange", syncFromHash);
    };
  }, []);

  if (!isHashReady) {
    return (
      <div className="min-h-screen bg-gray-50 p-3 md:p-5">
        <DocumentPreviewLoadingState message="로딩 중..." />
      </div>
    );
  }

  return <DocumentPreviewContent fileName={fileName} fileUrl={fileUrl} />;
}
