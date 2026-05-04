"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  DEFAULT_ONE_PAGER_FILE_STATUS,
  ONE_PAGER_FILE_STATUS_OPTIONS,
  type OnePagerCommentItem,
  type OnePagerFileStatus,
} from "ui";
import { getDocumentDownloadFileName, getSessionUser } from "utils";

const DEFAULT_TITLE = "원페이저 제목";
const DEFAULT_DESCRIPTION =
  "현재는 동아리 개설 신청 양식을 제공합니다. 등록된 양식은 다운로드할 수 있고, 미리보기 PDF가 준비된 양식은 브라우저에서 바로 확인한 뒤 작성 완료 후 개설 신청 페이지에서 업로드해 제출할 수 있습니다.";

const STATUS_META: Record<
  OnePagerFileStatus,
  { dotClassName: string; badgeClassName: string }
> = {
  제출됨: {
    dotClassName: "bg-[#2f80ed]",
    badgeClassName: "border-[#2f80ed] text-[#2f80ed]",
  },
  승인됨: {
    dotClassName: "bg-[#40EA45]",
    badgeClassName: "border-[#40EA45] text-[#40EA45]",
  },
  반려됨: {
    dotClassName: "bg-[#FFB915]",
    badgeClassName: "border-[#FFB915] text-[#FFB915]",
  },
  거절됨: {
    dotClassName: "bg-[#F45F5F]",
    badgeClassName: "border-[#F45F5F] text-[#F45F5F]",
  },
  취소됨: {
    dotClassName: "bg-[#524E4E]",
    badgeClassName: "border-[#524E4E] text-[#524E4E]",
  },
};

const normalizeSubmissionLabel = (sourceType: string, source: string) => {
  if (!source) return "Document.pdf";
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

const isValidHttpUrl = (value: string) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

type TeacherCommentItem = OnePagerCommentItem & {
  profileImage?: string | null;
};

export default function TeacherDocumentDetailPage() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title")?.trim() || DEFAULT_TITLE;
  const description =
    searchParams.get("description")?.trim() || DEFAULT_DESCRIPTION;
  const sourceType = searchParams.get("sourceType")?.trim() || "file";
  const source = searchParams.get("source")?.trim() || "";
  const sourceName = searchParams.get("sourceName")?.trim() || "";
  const profileImage = searchParams.get("profileImage")?.trim() || "";
  const isFileSubmission = sourceType === "file";
  const teacherName = getSessionUser()?.userName ?? "선생님";
  const teacherProfileImage = profileImage || "/admin-profile-default.svg";

  const [comments, setComments] = useState<TeacherCommentItem[]>([]);
  const [commentInput, setCommentInput] = useState("");

  const [status, setStatus] = useState<OnePagerFileStatus | null>(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<OnePagerFileStatus>(
    DEFAULT_ONE_PAGER_FILE_STATUS,
  );

  const statusMeta = useMemo(
    () => (status ? STATUS_META[status] : null),
    [status],
  );

  const handleSubmitComment = () => {
    const value = commentInput.trim();
    if (!value) return;

    const nextComment: TeacherCommentItem = {
      id: `teacher-comment-${Date.now()}`,
      author: teacherName,
      content: value,
      profileImage: teacherProfileImage,
    };

    if (isFileSubmission) {
      if (status === "거절됨") {
        nextComment.type = "REJECTION_REASON";
      } else if (status && status !== "취소됨") {
        setStatus("반려됨");
      }
    }

    setComments((prev) => [...prev, nextComment]);
    setCommentInput("");
  };

  const openStatusModal = () => {
    setPendingStatus(status || DEFAULT_ONE_PAGER_FILE_STATUS);
    setIsStatusModalOpen(true);
  };

  const submissionLabel =
    sourceName || normalizeSubmissionLabel(sourceType, source);

  const handleDownloadSubmission = async () => {
    if (!isFileSubmission) {
      return;
    }

    if (!source) {
      toast.error("다운로드할 파일이 없습니다.");
      return;
    }

    try {
      const response = await fetch(source);
      if (!response.ok) {
        throw new Error("파일 다운로드 응답이 올바르지 않습니다.");
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("다운로드한 파일이 비어 있습니다.");
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getDocumentDownloadFileName(
        submissionLabel,
        source,
        blob.type,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch {
      toast.error("파일 다운로드에 실패했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <main className="min-h-screen bg-white pt-20 pb-32">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col items-start gap-16 px-6 lg:flex-row">
        <div className="flex-1">
          <h1 className="font-bold text-[22px] text-gray-900">{title}</h1>
          <p className="mt-4 break-keep text-[15px] text-gray-600 leading-relaxed">
            {description}
          </p>
          <hr className="mt-8 border-gray-100 border-t" />
        </div>

        <div className="flex w-full flex-col gap-10 lg:max-w-[420px]">
          <div className="rounded-[20px] border border-gray-50 bg-white p-6 shadow-[0_2px_16px_rgba(0,0,0,0.04)]">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-[17px] text-gray-900">자료 제출</h2>

              {isFileSubmission &&
                (status ? (
                  <button
                    type="button"
                    onClick={openStatusModal}
                    className={`rounded-full border px-4 py-1 font-semibold text-[13px] transition-opacity hover:opacity-80 ${statusMeta?.badgeClassName}`}
                  >
                    {status}
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={openStatusModal}
                    className="flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1.5 font-semibold text-gray-500 text-xs transition-colors hover:bg-gray-100"
                  >
                    <svg
                      role="img"
                      aria-label="상태 추가 아이콘"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>상태 추가</title>
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                    상태 추가
                  </button>
                ))}
            </div>

            <div className="mt-6">
              {isFileSubmission ? (
                <button
                  type="button"
                  onClick={handleDownloadSubmission}
                  className="inline-flex items-center gap-3 rounded-full border border-red-200 bg-white px-4 py-2"
                >
                  <span className="font-medium text-gray-800 text-sm">
                    {submissionLabel}
                  </span>
                  <span className="flex h-[18px] w-[18px] cursor-pointer items-center justify-center rounded-full bg-gray-300 text-white">
                    <svg
                      role="img"
                      aria-label="다운로드 아이콘"
                      width="10"
                      height="10"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <title>다운로드</title>
                      <path d="M12 5v10" />
                      <path d="M8 11l4 4 4-4" />
                      <path d="M5 19h14" />
                    </svg>
                  </span>
                </button>
              ) : isValidHttpUrl(source) ? (
                <a
                  href={source}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-3 rounded-full border border-red-200 bg-white px-4 py-2"
                >
                  <span className="font-medium text-gray-800 text-sm">
                    {submissionLabel}
                  </span>
                </a>
              ) : (
                <span className="inline-flex items-center rounded-full border border-red-200 bg-white px-4 py-2 font-medium text-gray-800 text-sm">
                  {submissionLabel}
                </span>
              )}
            </div>
          </div>

          <div>
            <h2 className="mb-3 font-bold text-[17px] text-gray-900">
              댓글 <span className="text-[#E56D6D]">{comments.length}</span>
            </h2>
            <textarea
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
              placeholder="내용을 입력하세요."
              className="h-[70px] w-full resize-none rounded-xl border border-gray-200 p-4 text-gray-800 text-sm placeholder:text-gray-400 focus:border-[#E56D6D] focus:outline-none focus:ring-1 focus:ring-[#E56D6D]"
            />
            <div className="mt-3 flex justify-end">
              <button
                type="button"
                onClick={handleSubmitComment}
                className="rounded-lg bg-[#E56D6D] px-6 py-2 font-bold text-sm text-white transition-colors hover:bg-[#d65f5f]"
              >
                등록
              </button>
            </div>

            {comments.length > 0 && (
              <div className="mt-8 flex flex-col gap-6">
                {comments.map((comment) => (
                  <div key={comment.id} className="flex items-start gap-3.5">
                    <div className="mt-1 h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full border border-gray-100 bg-[#ECA8A8]">
                      <img
                        src={
                          comment.profileImage || "/admin-profile-default.svg"
                        }
                        alt={`${comment.author} 프로필`}
                        className="h-full w-full object-cover"
                        onError={(event) => {
                          event.currentTarget.src =
                            "/admin-profile-default.svg";
                        }}
                      />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col">
                      <div className="font-bold text-[16px] text-gray-800">
                        {comment.author}
                      </div>

                      {comment.type === "REJECTION_REASON" && (
                        <div className="mt-1 font-semibold text-[#e45d5d] text-[12px]">
                          거절됨 사유
                        </div>
                      )}

                      <div className="mt-1.5 whitespace-pre-wrap break-words text-[15px] text-gray-800 leading-relaxed">
                        {comment.content}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 px-4">
          <div className="w-full max-w-[374px] rounded-[20px] bg-white px-9 pt-8 pb-7 shadow-xl">
            <h3 className="text-center font-bold text-[22px] text-gray-900">
              상태 추가
            </h3>

            <div className="mt-8 flex flex-col gap-5">
              {ONE_PAGER_FILE_STATUS_OPTIONS.map((option) => {
                const selected = pendingStatus === option;
                const meta = STATUS_META[option];

                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setPendingStatus(option)}
                    className="group flex items-center justify-between text-left"
                  >
                    <span className="flex items-center gap-4 font-medium text-[16px] text-gray-700">
                      <span
                        className={`h-3 w-3 rounded-full ${meta.dotClassName}`}
                      />
                      {option}
                    </span>
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#f3a4a4]">
                      {selected && (
                        <span className="h-2.5 w-2.5 rounded-full bg-[#f17373]" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex justify-center gap-6">
              <button
                type="button"
                onClick={() => setIsStatusModalOpen(false)}
                className="h-[38px] min-w-[72px] rounded-[10px] bg-[#9b9698] px-6 font-semibold text-[14px] text-white transition-colors hover:bg-gray-500"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => {
                  setStatus(pendingStatus);
                  setIsStatusModalOpen(false);
                }}
                className="h-[38px] min-w-[72px] rounded-[10px] bg-[#f56565] px-6 font-semibold text-[14px] text-white transition-colors hover:bg-red-600"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
