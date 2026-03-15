const getFileExtension = (
  fileName: string,
  fileUrl: string,
  contentType?: string | null,
) => {
  const trimmedFileName = fileName.trim();
  const directFileExtension = trimmedFileName.match(/\.([A-Za-z0-9]+)$/)?.[1];

  if (directFileExtension) {
    return `.${directFileExtension.toLowerCase()}`;
  }

  const urlPath = fileUrl.split("?")[0] ?? fileUrl;
  const extensionMatch = urlPath.match(/(\.[A-Za-z0-9]+)$/);
  if (extensionMatch?.[1]) {
    return extensionMatch[1].toLowerCase();
  }

  switch (contentType?.toLowerCase()) {
    case "application/pdf":
      return ".pdf";
    case "application/x-hwp":
    case "application/haansofthwp":
      return ".hwp";
    case "application/x-hwpx":
    case "application/vnd.hancom.hwpx":
      return ".hwpx";
    default:
      return "";
  }
};

export const getDocumentDownloadFileName = (
  fileName: string,
  fileUrl: string,
  contentType?: string | null,
) => {
  const sanitizedFileName = fileName.trim();
  const extension = getFileExtension(fileName, fileUrl, contentType);

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

export const getDocumentFileExtensionLabel = (
  fileName: string,
  fileUrl: string,
  contentType?: string | null,
) => {
  const downloadFileName = getDocumentDownloadFileName(
    fileName,
    fileUrl,
    contentType,
  );
  const extension = downloadFileName.split(".").pop()?.trim();

  return extension ? extension.toUpperCase() : "FILE";
};
