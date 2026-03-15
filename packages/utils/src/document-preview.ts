export type DocumentPreviewMode = "hwp" | "pdf" | "unsupported";

export type DocumentPreviewParams = {
  previewKey: string;
};

export type DocumentPreviewPayload = {
  fileName: string;
  fileUrl: string;
};

const DOCUMENT_PREVIEW_STORAGE_KEY_PREFIX = "document-preview:";

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

export const getDocumentPreviewMode = (
  fileName: string,
  fileUrl: string,
): DocumentPreviewMode => {
  const extension = getFileExtension(fileName, fileUrl).slice(1);

  if (extension === "hwp") {
    return "hwp";
  }

  if (extension === "pdf") {
    return "pdf";
  }

  return "unsupported";
};

export const buildDocumentPreviewSrc = (
  previewKey: string,
  previewPath = "/documents/preview",
) => {
  const params = new URLSearchParams({ previewKey });

  return `${previewPath}#${params.toString()}`;
};

export const parseDocumentPreviewHash = (
  hash: string,
): DocumentPreviewParams => {
  const normalizedHash = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(normalizedHash);

  return {
    previewKey: params.get("previewKey") ?? "",
  };
};

export const saveDocumentPreviewPayload = (
  payload: DocumentPreviewPayload,
): string => {
  if (typeof window === "undefined") {
    return "";
  }

  const previewKey = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  window.sessionStorage.setItem(
    `${DOCUMENT_PREVIEW_STORAGE_KEY_PREFIX}${previewKey}`,
    JSON.stringify(payload),
  );

  return previewKey;
};

export const getDocumentPreviewPayload = (
  previewKey: string,
): DocumentPreviewPayload | null => {
  if (typeof window === "undefined" || !previewKey) {
    return null;
  }

  const rawPayload = window.sessionStorage.getItem(
    `${DOCUMENT_PREVIEW_STORAGE_KEY_PREFIX}${previewKey}`,
  );

  if (!rawPayload) {
    return null;
  }

  try {
    const parsedPayload = JSON.parse(rawPayload) as Partial<DocumentPreviewPayload>;

    if (
      typeof parsedPayload.fileName !== "string" ||
      typeof parsedPayload.fileUrl !== "string"
    ) {
      return null;
    }

    return {
      fileName: parsedPayload.fileName,
      fileUrl: parsedPayload.fileUrl,
    };
  } catch {
    return null;
  }
};

export const removeDocumentPreviewPayload = (previewKey: string) => {
  if (typeof window === "undefined" || !previewKey) {
    return;
  }

  window.sessionStorage.removeItem(
    `${DOCUMENT_PREVIEW_STORAGE_KEY_PREFIX}${previewKey}`,
  );
};
