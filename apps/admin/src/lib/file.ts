import { getDocumentDownloadFileName } from "utils";

export const getDownloadFileName = (
  fileName: string,
  fileUrl: string,
  contentType?: string | null,
) => getDocumentDownloadFileName(fileName, fileUrl, contentType);

const triggerFileDownload = (href: string, fileName: string) => {
  const link = document.createElement("a");
  link.href = href;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const downloadFileFromUrl = async (
  fileUrl: string,
  fileName: string,
) => {
  const response = await fetch(fileUrl);
  if (!response.ok) {
    throw new Error("파일 다운로드 응답이 올바르지 않습니다.");
  }

  const blob = await response.blob();
  if (blob.size === 0) {
    throw new Error("다운로드한 파일 크기가 비어 있습니다.");
  }

  const downloadFileName = getDownloadFileName(
    fileName,
    fileUrl,
    response.headers.get("content-type") ?? blob.type,
  );

  const objectUrl = URL.createObjectURL(blob);
  triggerFileDownload(objectUrl, downloadFileName);
  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
};
