"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  clearTokens,
  getAccessToken,
  getDocumentDownloadFileName,
  getDocumentFileExtensionLabel,
  getSessionUser,
} from "utils";
import { getTeacherDocumentFiles } from "@/api/teacher";
import { moveToWebLogin } from "@/lib/auth";
import type { TeacherDocumentFileItem } from "@/types/teacher";

export function DocumentFilesSection() {
  const [documentFiles, setDocumentFiles] = useState<TeacherDocumentFileItem[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [downloadingFileId, setDownloadingFileId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    let isMounted = true;

    const loadFiles = async () => {
      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();

      if (!accessToken || !sessionUser || sessionUser.role !== "TEACHER") {
        clearTokens();
        moveToWebLogin();
        return;
      }

      try {
        const files = await getTeacherDocumentFiles();

        if (!isMounted) return;
        setDocumentFiles(files);
        setErrorMessage("");
      } catch {
        if (!isMounted) return;
        setErrorMessage(
          "양식을 불러오지 못했습니다. 잠시 후 다시 확인해 주세요.",
        );
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFiles();

    return () => {
      isMounted = false;
    };
  }, []);

  const downloadFileFromUrl = async (fileUrl: string, fileName: string) => {
    const response = await fetch(fileUrl);
    if (!response.ok) {
      throw new Error("파일 다운로드 응답이 올바르지 않습니다.");
    }

    const blob = await response.blob();
    if (blob.size === 0) {
      throw new Error("다운로드한 파일이 비어 있습니다.");
    }

    const objectUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = objectUrl;
    link.download = getDocumentDownloadFileName(fileName, fileUrl, blob.type);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl);
    }, 1000);
  };

  const handleDownload = async (file: TeacherDocumentFileItem) => {
    setDownloadingFileId(file.fileId);
    try {
      await downloadFileFromUrl(file.fileUrl, file.fileName);
    } catch {
      toast.error("양식 다운로드에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setDownloadingFileId(null);
    }
  };

  return (
    <div className="overflow-hidden rounded-[5px] border border-gray-200 bg-white p-6 md:p-8">
      <div className="flex flex-col gap-4">
        {isLoading ? (
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

        {!isLoading && errorMessage ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-4 text-red-700 text-sm">
            {errorMessage}
          </div>
        ) : null}

        {!isLoading && !errorMessage && documentFiles.length === 0 ? (
          <div className="rounded-xl border border-gray-200 border-dashed bg-gray-50 px-4 py-6 text-center text-gray-500 text-sm">
            등록된 양식이 없습니다.
          </div>
        ) : null}

        {!isLoading && !errorMessage && documentFiles.length > 0 ? (
          <div className="space-y-3">
            {documentFiles.map((file) => {
              const downloadFileName = getDocumentDownloadFileName(
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
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
