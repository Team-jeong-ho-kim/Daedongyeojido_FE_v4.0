import { getErrorMessage, moveToWebLogin } from "@/lib";

export const toDateText = (
  value: [number, number, number] | string | undefined,
) => {
  if (!value) return "-";
  if (typeof value === "string") return value;
  return `${value[0]}-${String(value[1]).padStart(2, "0")}-${String(value[2]).padStart(2, "0")}`;
};

const getFileExtension = (fileUrl: string, contentType?: string | null) => {
  const urlPath = fileUrl.split("?")[0] ?? fileUrl;
  const extensionMatch = urlPath.match(/(\.[A-Za-z0-9]+)$/);
  if (extensionMatch?.[1]) {
    return extensionMatch[1];
  }

  switch (contentType?.toLowerCase()) {
    case "application/pdf":
      return ".pdf";
    case "application/x-hwp":
    case "application/haansofthwp":
      return ".hwp";
    case "application/zip":
    case "application/octet-stream":
      return "";
    case "application/x-hwpx":
    case "application/vnd.hancom.hwpx":
      return ".hwpx";
    default:
      return "";
  }
};

export const getDownloadFileName = (
  fileName: string,
  fileUrl: string,
  contentType?: string | null,
) => {
  const sanitizedFileName = fileName.trim();
  const extension = getFileExtension(fileUrl, contentType);

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

export const toResultDurationDateTime = (dateTime: string) => {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateTime)) {
    return `${dateTime}T00:00:00`;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/.test(dateTime)) {
    return dateTime;
  }

  if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(dateTime)) {
    return `${dateTime}:00`;
  }

  return dateTime;
};

export { moveToWebLogin };

export const toErrorMessage = getErrorMessage;
