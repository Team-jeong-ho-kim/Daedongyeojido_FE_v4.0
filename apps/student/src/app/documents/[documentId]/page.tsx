"use client";

import { useSearchParams } from "next/navigation";
import {
  DEFAULT_ONE_PAGER_FILE_STATUS,
  isOnePagerFileStatus,
  type OnePagerCommentItem,
  OnePagerDetailView,
  type OnePagerSubmissionItem,
} from "ui";

const DEFAULT_TITLE = "원페이저 제목";
const DEFAULT_DESCRIPTION =
  "현재는 동아리 개설 신청 양식을 제공합니다. 등록된 양식은 다운로드할 수 있고, 미리보기 PDF가 준비된 양식은 브라우저에서 바로 확인한 뒤 작성 완료 후 개설 신청 페이지에서 업로드해 제출할 수 있습니다.";

const DEFAULT_COMMENTS: OnePagerCommentItem[] = [];

const normalizeSubmissionLabel = (sourceType: string, source: string) => {
  if (!source) return "제출 자료";

  if (sourceType === "url") {
    try {
      const parsed = new URL(source);
      return parsed.hostname;
    } catch {
      return source;
    }
  }

  return source;
};

export default function StudentDocumentDetailPage() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title")?.trim() || DEFAULT_TITLE;
  const description =
    searchParams.get("description")?.trim() || DEFAULT_DESCRIPTION;
  const statusParam = searchParams.get("status")?.trim();
  const sourceType = searchParams.get("sourceType")?.trim() || "file";
  const source = searchParams.get("source")?.trim() || "";
  const sourceName = searchParams.get("sourceName")?.trim() || "";
  const isFileSubmission = sourceType === "file";
  const status =
    isFileSubmission && statusParam && isOnePagerFileStatus(statusParam)
      ? statusParam
      : DEFAULT_ONE_PAGER_FILE_STATUS;

  const submissionItems: OnePagerSubmissionItem[] = source
    ? [
        {
          id: "student-submission-1",
          label: sourceName || normalizeSubmissionLabel(sourceType, source),
        },
      ]
    : [];

  return (
    <main className="mt-10 min-h-screen bg-white">
      <OnePagerDetailView
        title={title}
        description={description}
        statusLabel={isFileSubmission ? status : null}
        submissionItems={submissionItems}
        comments={DEFAULT_COMMENTS}
      />
    </main>
  );
}
