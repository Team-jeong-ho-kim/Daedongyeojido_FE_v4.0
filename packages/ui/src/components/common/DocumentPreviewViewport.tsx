import { DocumentPreviewFallbackPanel } from "./DocumentPreviewFallbackPanel";
import { DocumentPreviewLoadingState } from "./DocumentPreviewLoadingState";
import { PdfPreviewEmbed } from "./PdfPreviewEmbed";

type DocumentPreviewViewportProps = {
  errorMessage: string | null;
  fileName: string;
  fileUrl: string;
  isLoading: boolean;
  previewHtml: string | null;
  previewMode: "hwp" | "pdf" | "unsupported";
  previewObjectUrl: string | null;
};

export function DocumentPreviewViewport({
  errorMessage,
  fileName,
  fileUrl,
  isLoading,
  previewHtml,
  previewMode,
  previewObjectUrl,
}: DocumentPreviewViewportProps) {
  if (isLoading) {
    return <DocumentPreviewLoadingState message="로딩 중..." />;
  }

  if (errorMessage) {
    return (
      <DocumentPreviewFallbackPanel message={errorMessage} href={fileUrl} />
    );
  }

  if (previewMode === "unsupported") {
    return (
      <DocumentPreviewFallbackPanel
        message="현재 형식은 브라우저 미리보기를 지원하지 않습니다."
        href={fileUrl}
        variant="neutral"
      />
    );
  }

  if (previewMode === "pdf" && previewObjectUrl) {
    return (
      <PdfPreviewEmbed
        href={previewObjectUrl}
        title={`${fileName} 미리보기`}
        minHeightClassName="min-h-[100vh]"
      />
    );
  }

  if (previewMode === "hwp" && previewHtml) {
    return (
      <div className="flex min-h-[100vh] w-full justify-center">
        <iframe
          title={`${fileName} 미리보기`}
          srcDoc={previewHtml}
          className="min-h-[100vh] w-full max-w-5xl bg-white"
        />
      </div>
    );
  }

  return (
    <DocumentPreviewFallbackPanel
      message="문서 미리보기를 불러오지 못했습니다."
      href={fileUrl}
    />
  );
}
