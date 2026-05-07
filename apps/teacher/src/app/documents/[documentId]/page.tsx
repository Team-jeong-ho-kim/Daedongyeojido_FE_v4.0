"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "shared";
import {
  DEFAULT_ONE_PAGER_FILE_STATUS,
  type OnePagerCommentItem,
  type OnePagerFileStatus,
} from "ui";
import { getSessionUser } from "utils";
import { Pagination } from "@/components";
import type { TeacherOnePagerSubmission } from "@/components/onepager/types";

const DEFAULT_TITLE = "원페이저 제목";
const DEFAULT_DESCRIPTION =
  "현재는 동아리 개설 신청 양식을 제공합니다. 등록된 양식은 다운로드할 수 있고, 미리보기 PDF가 준비된 양식은 브라우저에서 바로 확인한 뒤 작성 완료 후 개설 신청 페이지에서 업로드해 제출할 수 있습니다.";

const STATUS_STYLES: Record<string, { border: string; text: string }> = {
  제출됨: { border: "border-blue-500", text: "text-blue-500" },
  승인됨: { border: "border-green-500", text: "text-green-500" },
  반려됨: { border: "border-yellow-500", text: "text-yellow-500" },
  거절됨: { border: "border-primary-500", text: "text-primary-500" },
  취소됨: { border: "border-gray-500", text: "text-gray-500" },
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

const createDefaultSubmissions = (): TeacherOnePagerSubmission[] => {
  return [];
};

function StatusModal({
  isOpen,
  onClose,
  selectedStatus,
  onChangeStatus,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  selectedStatus: OnePagerFileStatus;
  onChangeStatus: (status: OnePagerFileStatus) => void;
  onSave: () => void;
}) {
  if (!isOpen) return null;

  const statuses: { label: OnePagerFileStatus; color: string }[] = [
    { label: "제출됨", color: "bg-blue-500" },
    { label: "승인됨", color: "bg-green-500" },
    { label: "반려됨", color: "bg-yellow-400" },
    { label: "거절됨", color: "bg-red-500" },
    { label: "취소됨", color: "bg-gray-500" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[400px] rounded-3xl bg-white p-8 shadow-xl">
        <h3 className="mb-6 text-center font-bold text-[22px] text-gray-800">
          상태 추가
        </h3>

        <div className="mb-8 space-y-4">
          {statuses.map(({ label, color }) => (
            <label
              key={label}
              className={`flex cursor-pointer items-center justify-between rounded-xl p-4 transition-colors ${
                selectedStatus === label ? "bg-red-50/50" : "hover:bg-gray-50"
              }`}
            >
              <input
                type="radio"
                name="status"
                value={label}
                checked={selectedStatus === label}
                onChange={() => onChangeStatus(label)}
                className="sr-only"
              />
              <div className="flex items-center gap-3">
                <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                <span className="font-semibold text-[16px] text-gray-700">
                  {label}
                </span>
              </div>
              <div
                className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  selectedStatus === label
                    ? "border-[#D66A6A]"
                    : "border-gray-300"
                }`}
              >
                {selectedStatus === label && (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#D66A6A]" />
                )}
              </div>
            </label>
          ))}
        </div>

        <div className="flex justify-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-[#989898] px-8 py-2.5 font-bold text-[15px] text-white hover:bg-gray-500"
          >
            취소
          </button>
          <button
            type="button"
            onClick={onSave}
            className="rounded-xl bg-[#D66A6A] px-8 py-2.5 font-bold text-[15px] text-white hover:bg-[#c25e5e]"
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TeacherDocumentDetailPage() {
  const searchParams = useSearchParams();

  const title = searchParams.get("title")?.trim() || DEFAULT_TITLE;
  const description =
    searchParams.get("description")?.trim() || DEFAULT_DESCRIPTION;
  const sourceTypeParam = searchParams.get("sourceType")?.trim() || "file";
  const sourceType = sourceTypeParam === "url" ? "url" : "file";
  const source = searchParams.get("source")?.trim() || "";
  const sourceName =
    searchParams.get("sourceName")?.trim() ||
    normalizeSubmissionLabel(sourceType, source);

  const { userInfo } = useUserStore();

  const [submissions, setSubmissions] = useState<TeacherOnePagerSubmission[]>(
    () => createDefaultSubmissions({ sourceType, source, sourceName }),
  );

  const [curPage, setCurPage] = useState(1);
  const itemsPerPage = 2;
  const currentSubmissions = submissions.slice(
    (curPage - 1) * itemsPerPage,
    curPage * itemsPerPage,
  );

  const authorName = userInfo?.userName || getSessionUser()?.userName || "익명";

  const [modalSubmissionId, setModalSubmissionId] = useState<string | null>(
    null,
  );
  const [pendingStatus, setPendingStatus] = useState<OnePagerFileStatus>(
    DEFAULT_ONE_PAGER_FILE_STATUS,
  );
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );

  const openStatusModal = (submissionId: string) => {
    const target = submissions.find((sub) => sub.id === submissionId);
    if (!target) return;
    setModalSubmissionId(submissionId);
    setPendingStatus(target.status || DEFAULT_ONE_PAGER_FILE_STATUS);
  };

  const saveStatus = () => {
    if (!modalSubmissionId) return;
    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === modalSubmissionId ? { ...sub, status: pendingStatus } : sub,
      ),
    );
    setModalSubmissionId(null);
  };

  const handleAddComment = (submissionId: string) => {
    const content = commentInputs[submissionId]?.trim();
    if (!content) return;

    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id !== submissionId) return sub;
        const newComment: OnePagerCommentItem = {
          id: `comment-${Date.now()}`,
          author: authorName,
          content,
        };
        return { ...sub, comments: [...sub.comments, newComment] };
      }),
    );
    setCommentInputs((prev) => ({ ...prev, [submissionId]: "" }));
  };

  const handleDownload = (url: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#F8F9FA] pt-16 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-14 lg:grid-cols-[1fr_480px]">
          <section className="pt-4">
            <h1 className="font-bold text-[28px] text-gray-800 leading-none">
              {title}
            </h1>
            <p className="mt-[26px] max-w-3xl text-[16px] text-gray-600 leading-[1.6]">
              {description}
            </p>
            <div className="mt-8 mb-8 h-px w-full bg-gray-200" />

            <button
              type="button"
              onClick={() => handleDownload(source, sourceName)}
              className="flex items-center gap-2 rounded-xl border border-primary-400 bg-white px-5 py-2.5 text-gray-800 transition-colors hover:bg-red-50"
            >
              <span className="font-medium text-[16px]">{sourceName}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                role="img"
                aria-label="다운로드 아이콘"
              >
                <title>다운로드 아이콘</title>
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </button>
          </section>

          <section className="flex flex-col gap-6">
            {currentSubmissions.map((sub) => (
              <article
                key={sub.id}
                className="rounded-[24px] bg-white p-7 shadow-[0_2px_16px_rgba(0,0,0,0.04)]"
              >
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-bold text-[22px] text-gray-800">
                    {sub.clubName || "자료 제출"}
                  </h2>
                  {sub.status ? (
                    <button
                      type="button"
                      onClick={() => openStatusModal(sub.id)}
                      className={`rounded-full border px-5 py-1.5 font-bold text-[15px] ${
                        STATUS_STYLES[sub.status]?.border || "border-gray-300"
                      } ${STATUS_STYLES[sub.status]?.text || "text-gray-600"}`}
                    >
                      {sub.status}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openStatusModal(sub.id)}
                      className="flex items-center gap-1.5 rounded-full bg-gray-100 px-4 py-1.5 font-semibold text-[14px] text-gray-600 hover:bg-gray-200"
                    >
                      <span className="text-lg leading-none">+</span> 상태 추가
                    </button>
                  )}
                </div>

                <div className="mb-2 flex items-center">
                  <div className="flex items-center gap-2 rounded-full border border-[#D66A6A] bg-white px-4 py-2 text-gray-800">
                    <span className="font-medium text-[15px]">
                      {sub.sourceName}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDownload(sub.source, sub.sourceName)}
                      className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-full bg-[#C4C4C4] text-white hover:bg-gray-400"
                      aria-label="다운로드"
                    >
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        role="img"
                        aria-label="다운로드 아이콘"
                      >
                        <title>다운로드 아이콘</title>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="ml-1 font-medium text-[13px] text-gray-400">
                  제출일 {sub.submittedAt}
                </p>

                <div className="my-4 h-px w-full bg-gray-100" />

                <div>
                  <h3 className="mb-4 font-semibold text-[18px] text-gray-800">
                    댓글{" "}
                    <span className="text-[#D66A6A]">
                      {sub.comments.length}
                    </span>
                  </h3>

                  {sub.comments.length > 0 && (
                    <div className="mb-5 space-y-4">
                      {sub.comments.map((comment) => (
                        <div key={comment.id} className="flex gap-3">
                          <div className="mt-1 h-11 w-11 shrink-0 rounded-full bg-[#EBA4A4]" />
                          <div>
                            <p className="font-bold text-[#4B4B4B] text-[16px]">
                              {comment.author}
                            </p>
                            <p className="text-[#4B4B4B] text-[15px]">
                              {comment.content}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex flex-col">
                    <div className="flex items-stretch gap-2">
                      <textarea
                        placeholder="내용을 입력하세요."
                        value={commentInputs[sub.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [sub.id]: e.target.value,
                          }))
                        }
                        className="h-[44px] w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-[14px] leading-[1.6] outline-none placeholder:text-gray-400 focus:border-[#D66A6A]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(sub.id)}
                        className="h-[44px] shrink-0 cursor-pointer rounded-xl bg-primary-500 px-6 text-[14px] text-white hover:bg-primary-600"
                      >
                        등록
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {submissions.length > itemsPerPage && (
              <div className="mt-4">
                <Pagination
                  listLen={submissions.length}
                  limit={itemsPerPage}
                  curPage={curPage}
                  setCurPage={setCurPage}
                />
              </div>
            )}
          </section>
        </div>
      </div>

      <StatusModal
        isOpen={modalSubmissionId !== null}
        selectedStatus={pendingStatus}
        onClose={() => setModalSubmissionId(null)}
        onChangeStatus={setPendingStatus}
        onSave={saveStatus}
      />
    </main>
  );
}
