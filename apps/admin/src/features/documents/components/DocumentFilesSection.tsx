"use client";

import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { ManualPdfPreviewModal } from "ui";
import {
  getDocumentFileExtensionLabel,
  getDocumentPreviewPdfPath,
} from "utils";
import { useDeleteClubCreationFormMutation } from "@/hooks/mutations";
import { useGetDocumentFilesQuery } from "@/hooks/querys";
import { downloadFileFromUrl, getDownloadFileName } from "@/lib";
import type { DocumentFileItem } from "@/types/admin";

export function DocumentFilesSection() {
  const documentFilesQuery = useGetDocumentFilesQuery();
  const deleteClubCreationFormMutation = useDeleteClubCreationFormMutation();
  const deleteModalTitleId = useId();
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
    null,
  );
  const [previewFile, setPreviewFile] = useState<DocumentFileItem | null>(null);
  const [selectedDeleteFile, setSelectedDeleteFile] =
    useState<DocumentFileItem | null>(null);
  const documentFiles = documentFilesQuery.data?.fileResponses ?? [];
  const previewPdfPath = previewFile
    ? getDocumentPreviewPdfPath(previewFile.fileId)
    : null;

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
      setPreviewFile(null);
    }
  }, [documentFiles, previewFile]);

  useEffect(() => {
    if (previewFile && !previewPdfPath) {
      setPreviewFile(null);
    }
  }, [previewFile, previewPdfPath]);

  useEffect(() => {
    if (!selectedDeleteFile) {
      return;
    }

    const exists = documentFiles.some(
      (file) => file.fileId === selectedDeleteFile.fileId,
    );

    if (!exists) {
      setSelectedDeleteFile(null);
    }
  }, [documentFiles, selectedDeleteFile]);

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
    setPreviewFile(null);
  };

  const openPreview = (file: DocumentFileItem) => {
    setPreviewFile(file);
  };

  const openDeleteModal = (file: DocumentFileItem) => {
    setSelectedDeleteFile(file);
  };

  const closeDeleteModal = () => {
    if (deleteClubCreationFormMutation.isPending) {
      return;
    }

    setSelectedDeleteFile(null);
  };

  const handleConfirmDelete = async () => {
    if (!selectedDeleteFile) {
      return;
    }

    try {
      await deleteClubCreationFormMutation.mutateAsync(
        selectedDeleteFile.fileId,
      );

      if (previewFile?.fileId === selectedDeleteFile.fileId) {
        setPreviewFile(null);
      }

      setSelectedDeleteFile(null);
    } catch {}
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
              const previewPath = getDocumentPreviewPdfPath(file.fileId);

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
                      {previewPath ? (
                        <button
                          type="button"
                          onClick={() => openPreview(file)}
                          className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50"
                        >
                          미리보기
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => openDeleteModal(file)}
                        disabled={deleteClubCreationFormMutation.isPending}
                        className="rounded-xl border border-[#F3C4C4] bg-white px-6 py-3 font-semibold text-[#DC2626] text-sm transition hover:border-[#E5A9A9] hover:bg-[#FEF2F2] disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        삭제
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>

      <ManualPdfPreviewModal
        fileName={
          previewFile
            ? getDownloadFileName(previewFile.fileName, previewFile.fileUrl)
            : ""
        }
        isOpen={previewFile !== null}
        onClose={closePreview}
        pdfPath={previewPdfPath}
      />

      {selectedDeleteFile ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            aria-label="양식 삭제 확인 모달 닫기"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={closeDeleteModal}
            disabled={deleteClubCreationFormMutation.isPending}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={deleteModalTitleId}
            className="relative w-[90%] max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <h2
              id={deleteModalTitleId}
              className="mb-2 font-bold text-[18px] text-gray-900"
            >
              양식을 삭제하시겠습니까?
            </h2>
            <p className="mb-4 text-gray-500 text-sm">
              삭제 후에는 되돌릴 수 없습니다.
            </p>
            <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
              <p className="break-all font-medium text-gray-900 text-sm">
                {getDownloadFileName(
                  selectedDeleteFile.fileName,
                  selectedDeleteFile.fileUrl,
                )}
              </p>
              <p className="mt-1 text-[12px] text-gray-500">
                양식 ID #{selectedDeleteFile.fileId}
              </p>
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleteClubCreationFormMutation.isPending}
                className="rounded-[12px] bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={deleteClubCreationFormMutation.isPending}
                className="rounded-[12px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleteClubCreationFormMutation.isPending
                  ? "삭제 중..."
                  : "삭제"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
