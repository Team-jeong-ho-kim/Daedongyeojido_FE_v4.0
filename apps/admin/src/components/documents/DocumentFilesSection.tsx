"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { DocumentPreviewFallbackPanel, DocumentPreviewModal } from "ui";
import {
  buildDocumentPreviewSrc,
  getDocumentFileExtensionLabel,
  removeDocumentPreviewPayload,
  saveDocumentPreviewPayload,
} from "utils";
import { useGetDocumentFilesQuery } from "@/hooks/querys";
import { downloadFileFromUrl, getDownloadFileName } from "@/lib";
import type { DocumentFileItem } from "@/types/admin";

export default function DocumentFilesSection() {
  const documentFilesQuery = useGetDocumentFilesQuery();
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
    null,
  );
  const [previewFile, setPreviewFile] = useState<DocumentFileItem | null>(null);
  const [previewKey, setPreviewKey] = useState<string | null>(null);
  const documentFiles = documentFilesQuery.data?.fileResponses ?? [];

  useEffect(() => {
    if (!documentFilesQuery.error) {
      return;
    }

    toast.error("동아리 개설 양식을 불러오지 못했습니다.");
  }, [documentFilesQuery.error]);

  useEffect(() => {
    if (!previewFile) {
      return;
    }

    const exists = documentFiles.some(
      (file) => file.fileId === previewFile.fileId,
    );
    if (!exists) {
      if (previewKey) {
        removeDocumentPreviewPayload(previewKey);
      }
      setPreviewFile(null);
      setPreviewKey(null);
    }
  }, [documentFiles, previewFile, previewKey]);

  const handleDownload = async (file: DocumentFileItem) => {
    setDownloadingFileId(file.fileId);
    try {
      await downloadFileFromUrl(file.fileUrl, file.fileName);
      toast.success("동아리 개설 양식을 다운로드했습니다.");
    } catch {
      toast.error("동아리 개설 양식 다운로드에 실패했습니다.");
    } finally {
      setDownloadingFileId(null);
    }
  };

  const closePreview = () => {
    if (previewKey) {
      removeDocumentPreviewPayload(previewKey);
    }

    setPreviewFile(null);
    setPreviewKey(null);
  };

  const openPreview = (file: DocumentFileItem) => {
    if (previewKey) {
      removeDocumentPreviewPayload(previewKey);
    }

    const nextPreviewKey = saveDocumentPreviewPayload({
      fileName: getDownloadFileName(file.fileName, file.fileUrl),
      fileUrl: file.fileUrl,
    });

    setPreviewKey(nextPreviewKey);
    setPreviewFile(file);
  };

  return (
    <div className="overflow-hidden rounded-[5px] border border-gray-200 bg-white p-6 md:p-8">
      <div className="flex flex-col gap-4">
        {documentFilesQuery.isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={`admin-document-file-skeleton-${index + 1}`}
                className="animate-pulse rounded-xl border border-gray-200 bg-gray-50 px-4 py-4"
              >
                <div className="flex items-start gap-4">
                  <div className="h-11 w-11 rounded-lg bg-gray-200" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-40 rounded bg-gray-200" />
                    <div className="h-3 w-28 rounded bg-gray-100" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : null}

        {!documentFilesQuery.isLoading && documentFilesQuery.isError ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-red-700 text-sm">
            양식을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.
          </div>
        ) : null}

        {!documentFilesQuery.isLoading &&
        !documentFilesQuery.isError &&
        documentFiles.length === 0 ? (
          <div className="rounded-xl border border-gray-200 border-dashed bg-gray-50 px-4 py-6 text-center text-gray-500 text-sm">
            등록된 양식이 없습니다.
          </div>
        ) : null}

        {!documentFilesQuery.isLoading &&
        !documentFilesQuery.isError &&
        documentFiles.length > 0 ? (
          <div className="space-y-3">
            {documentFiles.map((file) => {
              const downloadFileName = getDownloadFileName(
                file.fileName,
                file.fileUrl,
              );
              const fileExtensionLabel = getDocumentFileExtensionLabel(
                file.fileName,
                file.fileUrl,
              );
              const isDownloading = downloadingFileId === file.fileId;

              return (
                <article
                  key={file.fileId}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white font-semibold text-[11px] text-gray-700">
                        {fileExtensionLabel}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-all font-medium text-gray-900 text-sm md:text-base">
                          {downloadFileName}
                        </p>
                        <p className="mt-1 text-[12px] text-gray-500">
                          양식 ID #{file.fileId}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleDownload(file)}
                        disabled={downloadingFileId !== null}
                        className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDownloading ? "다운로드 중..." : "다운로드"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openPreview(file)}
                        className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50"
                      >
                        미리보기
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>

      <DocumentPreviewModal
        fileName={
          previewFile
            ? getDownloadFileName(previewFile.fileName, previewFile.fileUrl)
            : ""
        }
        isOpen={previewFile !== null}
        onClose={closePreview}
      >
        {previewFile && previewKey ? (
          <iframe
            title="문서 미리보기"
            src={buildDocumentPreviewSrc(previewKey)}
            className="h-full min-h-[70vh] w-full bg-transparent"
          />
        ) : (
          <DocumentPreviewFallbackPanel
            message="문서 미리보기 경로를 확인할 수 없습니다."
            minHeightClassName="min-h-[70vh]"
          />
        )}
      </DocumentPreviewModal>
    </div>
  );
}
