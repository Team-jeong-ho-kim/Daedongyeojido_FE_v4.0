"use client";

const PDF_SIGNATURE = [0x25, 0x50, 0x44, 0x46, 0x2d];

type ResolvePdfPreviewUrlResult =
  | {
      message: null;
      revoke: (() => void) | null;
      url: string;
    }
  | {
      message: string;
      revoke: null;
      url: null;
    };

const isInlinePdfUrl = (pdfPath: string) => {
  return pdfPath.startsWith("blob:") || pdfPath.startsWith("data:");
};

const hasPdfContentType = (contentType: string | null) => {
  const normalizedContentType = contentType?.toLowerCase() ?? "";
  return normalizedContentType.includes("application/pdf");
};

const isGenericBinaryContentType = (contentType: string | null) => {
  const normalizedContentType = contentType?.toLowerCase() ?? "";
  return (
    normalizedContentType === "" ||
    normalizedContentType.includes("application/octet-stream")
  );
};

const hasPdfSignature = async (blob: Blob) => {
  if (blob.size < PDF_SIGNATURE.length) {
    return false;
  }

  const buffer = await blob.slice(0, PDF_SIGNATURE.length).arrayBuffer();
  const bytes = new Uint8Array(buffer);

  return PDF_SIGNATURE.every((value, index) => bytes[index] === value);
};

export async function resolvePdfPreviewUrl(
  pdfPath: string,
  signal?: AbortSignal,
): Promise<ResolvePdfPreviewUrlResult> {
  if (isInlinePdfUrl(pdfPath)) {
    return {
      message: null,
      revoke: null,
      url: pdfPath,
    };
  }

  try {
    const response = await fetch(pdfPath, {
      signal,
    });

    if (!response.ok) {
      return {
        message: "PDF 미리보기를 불러오지 못했습니다.",
        revoke: null,
        url: null,
      };
    }

    const contentType = response.headers.get("content-type");
    const blob = await response.blob();

    if (!blob.size) {
      return {
        message: "PDF 미리보기 파일이 비어 있습니다.",
        revoke: null,
        url: null,
      };
    }

    const pdfSignatureMatched = await hasPdfSignature(blob);
    const pdfContentTypeMatched = hasPdfContentType(contentType);
    const genericBinaryContentType = isGenericBinaryContentType(contentType);

    if (!pdfSignatureMatched) {
      return {
        message: "PDF 미리보기를 불러오지 못했습니다.",
        revoke: null,
        url: null,
      };
    }

    if (!pdfContentTypeMatched && !genericBinaryContentType) {
      return {
        message: "PDF 미리보기 파일 형식을 확인할 수 없습니다.",
        revoke: null,
        url: null,
      };
    }

    const normalizedPdfBlob =
      blob.type === "application/pdf"
        ? blob
        : new Blob([blob], { type: "application/pdf" });
    const objectUrl = URL.createObjectURL(normalizedPdfBlob);

    return {
      message: null,
      revoke: () => URL.revokeObjectURL(objectUrl),
      url: objectUrl,
    };
  } catch {
    return {
      message: "PDF 미리보기를 불러오지 못했습니다.",
      revoke: null,
      url: null,
    };
  }
}
