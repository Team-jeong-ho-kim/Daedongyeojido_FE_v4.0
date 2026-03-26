const documentPreviewRegistry: Record<number, string> = {
  1: "/documents/previews/1.pdf",
};

export const getDocumentPreviewPdfPath = (fileId: number) => {
  return documentPreviewRegistry[fileId] ?? null;
};
