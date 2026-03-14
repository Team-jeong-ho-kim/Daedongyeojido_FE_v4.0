// 새 양식이 올라오면 fileId에 맞는 PDF를 public/documents/previews 아래에 추가
const documentPreviewRegistry: Record<number, string> = {
  1: "/documents/previews/1.pdf",
};

export const getDocumentPreviewPdfPath = (fileId: number) => {
  return documentPreviewRegistry[fileId] ?? null;
};
