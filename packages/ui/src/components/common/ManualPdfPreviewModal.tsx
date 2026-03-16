"use client";

import { useEffect, useRef, useState } from "react";
import { DocumentPreviewFallbackPanel } from "./DocumentPreviewFallbackPanel";
import { DocumentPreviewLoadingState } from "./DocumentPreviewLoadingState";
import { DocumentPreviewModal } from "./DocumentPreviewModal";
import { PdfPreviewEmbed } from "./PdfPreviewEmbed";
import { resolvePdfPreviewUrl } from "./resolvePdfPreviewUrl";

type ManualPdfPreviewModalProps = {
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  pdfPath: string | null;
  title?: string;
};

export function ManualPdfPreviewModal({
  fileName,
  isOpen,
  onClose,
  pdfPath,
  title,
}: ManualPdfPreviewModalProps) {
  const [resolvedPdfUrl, setResolvedPdfUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const createdObjectUrlRef = useRef<string | null>(null);

  const handleDownload = () => {
    if (!resolvedPdfUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = resolvedPdfUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const clearCreatedObjectUrl = () => {
      if (!createdObjectUrlRef.current) {
        return;
      }

      URL.revokeObjectURL(createdObjectUrlRef.current);
      createdObjectUrlRef.current = null;
    };

    clearCreatedObjectUrl();

    if (!isOpen) {
      setResolvedPdfUrl(null);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    if (!pdfPath) {
      setResolvedPdfUrl(null);
      setIsLoading(false);
      setErrorMessage(null);
      return;
    }

    const abortController = new AbortController();
    let isDisposed = false;

    setResolvedPdfUrl(null);
    setIsLoading(true);
    setErrorMessage(null);

    const loadPdfPreview = async () => {
      const result = await resolvePdfPreviewUrl(
        pdfPath,
        abortController.signal,
      );

      if (abortController.signal.aborted || isDisposed) {
        result.revoke?.();
        return;
      }

      clearCreatedObjectUrl();
      createdObjectUrlRef.current =
        result.revoke && result.url ? result.url : null;
      setResolvedPdfUrl(result.url);
      setErrorMessage(result.message);
      setIsLoading(false);
    };

    void loadPdfPreview();

    return () => {
      isDisposed = true;
      abortController.abort();
      clearCreatedObjectUrl();
    };
  }, [isOpen, pdfPath]);

  return (
    <DocumentPreviewModal
      actions={
        <button
          type="button"
          onClick={handleDownload}
          disabled={!resolvedPdfUrl || isLoading}
          className="inline-flex h-10 items-center justify-center rounded-xl border border-gray-300 bg-white px-4 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          다운로드
        </button>
      }
      fileName={fileName}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      {!pdfPath ? (
        <DocumentPreviewFallbackPanel
          message="문서 미리보기 경로를 확인할 수 없습니다."
          minHeightClassName="min-h-[70vh]"
        />
      ) : isLoading ? (
        <DocumentPreviewLoadingState
          message="PDF 미리보기를 불러오는 중..."
          minHeightClassName="min-h-[70vh]"
        />
      ) : errorMessage || !resolvedPdfUrl ? (
        <DocumentPreviewFallbackPanel
          message={errorMessage ?? "문서 미리보기를 불러오지 못했습니다."}
          href={pdfPath}
          linkLabel="새 탭에서 PDF 열기"
          minHeightClassName="min-h-[70vh]"
          variant="neutral"
        />
      ) : (
        <PdfPreviewEmbed
          href={resolvedPdfUrl}
          title={`${fileName} 미리보기`}
          minHeightClassName="min-h-[70vh]"
        />
      )}
    </DocumentPreviewModal>
  );
}
