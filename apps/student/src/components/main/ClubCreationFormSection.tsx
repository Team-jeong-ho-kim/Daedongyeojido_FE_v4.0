"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useGetClubCreationFormQuery } from "@/hooks/querys/useApplicationFormQuery";

const getDownloadFileName = (fileName: string, fileUrl: string) => {
  const sanitizedFileName = fileName.trim();
  const urlPath = fileUrl.split("?")[0] ?? fileUrl;
  const extensionMatch = urlPath.match(/(\.[A-Za-z0-9]+)$/);
  const extension = extensionMatch?.[1] ?? "";

  if (!sanitizedFileName) {
    return `club-creation-form${extension}`;
  }

  if (!extension) {
    return sanitizedFileName;
  }

  return sanitizedFileName.toLowerCase().endsWith(extension.toLowerCase())
    ? sanitizedFileName
    : `${sanitizedFileName}${extension}`;
};

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
  link.download = getDownloadFileName(fileName, fileUrl);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
};

export default function ClubCreationFormSection() {
  const clubCreationFormQuery = useGetClubCreationFormQuery(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    if (!clubCreationFormQuery.error) {
      return;
    }

    toast.error("동아리 개설 양식을 불러오지 못했습니다.");
  }, [clubCreationFormQuery.error]);

  const handleFetch = async () => {
    try {
      await clubCreationFormQuery.refetch();
    } catch {}
  };

  const handleDownload = async () => {
    if (!clubCreationFormQuery.data) {
      toast.error("먼저 양식을 조회해 주세요.");
      return;
    }

    setIsDownloading(true);
    try {
      await downloadFileFromUrl(
        clubCreationFormQuery.data.fileUrl,
        clubCreationFormQuery.data.fileName,
      );
      toast.success("동아리 개설 양식을 다운로드했습니다.");
    } catch {
      toast.error("동아리 개설 양식 다운로드에 실패했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section className="w-full bg-white py-10 md:py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="overflow-hidden rounded-[5px] border border-gray-200 bg-white p-6 md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <h2 className="font-bold text-2xl text-gray-900 md:text-3xl">
                동아리 개설 양식을 먼저 확인해보세요
              </h2>
              <p className="text-gray-600 text-sm leading-6 md:text-base">
                새 동아리를 준비 중이라면 개설 양식을 조회하고 바로 다운로드할
                수 있습니다.
              </p>
              {clubCreationFormQuery.data ? (
                <div className="rounded-xl border border-gray-200 bg-white/90 px-4 py-3">
                  <p className="font-medium text-gray-900 text-sm md:text-base">
                    {clubCreationFormQuery.data.fileName}
                  </p>
                  <p className="mt-1 break-all text-gray-500 text-xs md:text-sm">
                    {clubCreationFormQuery.data.fileUrl}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <button
                type="button"
                onClick={handleFetch}
                disabled={clubCreationFormQuery.isFetching}
                className="rounded-full bg-gray-900 px-6 py-3 font-semibold text-sm text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {clubCreationFormQuery.isFetching ? "조회 중..." : "양식 조회"}
              </button>
              <button
                type="button"
                onClick={handleDownload}
                disabled={!clubCreationFormQuery.data || isDownloading}
                className="rounded-full border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDownloading ? "다운로드 중..." : "다운로드"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
