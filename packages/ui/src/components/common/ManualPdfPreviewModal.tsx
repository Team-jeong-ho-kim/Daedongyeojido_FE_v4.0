"use client";

import { DocumentPreviewFallbackPanel } from "./DocumentPreviewFallbackPanel";
import { DocumentPreviewModal } from "./DocumentPreviewModal";

type ManualPdfPreviewModalProps = {
  fileName: string;
  isOpen: boolean;
  onClose: () => void;
  pdfPath: string | null;
  title?: string;
};

export function ManualPdfPreviewModal({
  fileName,
  isOpen,
  onClose,
  pdfPath,
  title,
}: ManualPdfPreviewModalProps) {
  return (
    <DocumentPreviewModal
      fileName={fileName}
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      {pdfPath ? (
        <object
          data={pdfPath}
          type="application/pdf"
          className="h-full min-h-[70vh] w-full bg-white"
        >
          <DocumentPreviewFallbackPanel
            message="브라우저에서 PDF 미리보기를 표시하지 못했습니다."
            href={pdfPath}
            linkLabel="새 탭에서 PDF 열기"
            minHeightClassName="min-h-[70vh]"
            variant="neutral"
          />
        </object>
      ) : (
        <DocumentPreviewFallbackPanel
          message="문서 미리보기 경로를 확인할 수 없습니다."
          minHeightClassName="min-h-[70vh]"
        />
      )}
    </DocumentPreviewModal>
  );
}
