"use client";

import { useMemo, useState } from "react";
import type { OnePagerCommentItem, OnePagerFileStatus } from "ui";
import type { TeacherOnePagerSubmission } from "./types";

const STATUS_BADGE_CLASS_NAME: Record<OnePagerFileStatus, string> = {
  제출됨: "border-[#2f80ed] text-[#2f80ed]",
  승인됨: "border-[#40EA45] text-[#40EA45]",
  반려됨: "border-[#FFB915] text-[#FFB915]",
  거절됨: "border-[#F45F5F] text-[#F45F5F]",
  취소됨: "border-[#524E4E] text-[#524E4E]",
};

const PAGE_SIZE = 2;

interface SubmittedClubListProps {
  submissions: TeacherOnePagerSubmission[];
  currentTeacherName: string;
  currentTeacherProfileImage: string;
  onRequestChangeStatus: (submissionId: string) => void;
  onDownloadFile: (submissionId: string) => void;
  onAddComment: (submissionId: string, comment: OnePagerCommentItem) => void;
}

export function SubmittedClubList({
  submissions,
  currentTeacherName,
  currentTeacherProfileImage,
  onRequestChangeStatus,
  onDownloadFile,
  onAddComment,
}: SubmittedClubListProps) {
  const [page, setPage] = useState(1);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>(
    {},
  );

  const pageCount = Math.max(1, Math.ceil(submissions.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const pagedSubmissions = useMemo(() => {
    const offset = (safePage - 1) * PAGE_SIZE;
    return submissions.slice(offset, offset + PAGE_SIZE);
  }, [safePage, submissions]);

  return (
    <>
      <div className="space-y-8">
        {pagedSubmissions.map((submission) => {
          const commentCount = submission.comments.length;
          const commentInput = commentInputs[submission.id] ?? "";

          return (
            <article
              key={submission.id}
              className="rounded-[30px] border border-gray-100 bg-white p-7 shadow-[0_8px_30px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-start justify-between gap-3">
                <h2 className="font-bold text-[46px] text-gray-800 leading-none">
                  {submission.clubName}
                </h2>
                {submission.sourceType === "file" ? (
                  submission.status ? (
                    <button
                      type="button"
                      onClick={() => onRequestChangeStatus(submission.id)}
                      className={`rounded-full border px-7 py-2 font-semibold text-[24px] leading-none ${STATUS_BADGE_CLASS_NAME[submission.status]}`}
                    >
                      {submission.status}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => onRequestChangeStatus(submission.id)}
                      className="rounded-full bg-gray-50 px-7 py-2 font-semibold text-[24px] text-gray-400 leading-none"
                    >
                      + 상태 추가
                    </button>
                  )
                ) : null}
              </div>

              <div className="mt-9">
                {submission.sourceType === "file" ? (
                  <button
                    type="button"
                    onClick={() => onDownloadFile(submission.id)}
                    className="inline-flex items-center gap-3 rounded-full border border-[#f29090] bg-white px-5 py-2"
                  >
                    <span className="font-medium text-[43px] text-gray-800 leading-none">
                      {submission.sourceName}
                    </span>
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-300 text-[18px] text-white">
                      ↓
                    </span>
                  </button>
                ) : (
                  <a
                    href={submission.source}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 rounded-full border border-[#f29090] bg-white px-5 py-2"
                  >
                    <span className="font-medium text-[43px] text-gray-800 leading-none">
                      {submission.sourceName}
                    </span>
                  </a>
                )}
              </div>

              <p className="mt-3 font-medium text-[33px] text-gray-400 leading-none">
                제출일 {submission.submittedAt}
              </p>

              <div className="mt-6 h-px w-full bg-gray-200" />

              <div className="mt-5">
                <h3 className="font-bold text-[46px] text-gray-800 leading-none">
                  댓글 <span className="text-primary-500">{commentCount}</span>
                </h3>

                <div className="mt-5 space-y-6">
                  {submission.comments.map((comment) => (
                    <div key={comment.id} className="flex items-start gap-3.5">
                      <div className="mt-1 h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full border border-gray-100 bg-[#ECA8A8]">
                        <img
                          src={
                            comment.profileImage || "/admin-profile-default.svg"
                          }
                          alt={`${comment.author} 프로필`}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 flex-col">
                        <p className="font-bold text-[16px] text-gray-800">
                          {comment.author}
                        </p>
                        {comment.type === "REJECTION_REASON" ? (
                          <p className="mt-1 font-semibold text-[#e45d5d] text-[12px]">
                            거절됨 사유
                          </p>
                        ) : null}
                        <p className="mt-1.5 whitespace-pre-wrap break-words text-[15px] text-gray-800 leading-relaxed">
                          {comment.content}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 flex items-center gap-3">
                  <input
                    value={commentInput}
                    onChange={(e) =>
                      setCommentInputs((prev) => ({
                        ...prev,
                        [submission.id]: e.target.value,
                      }))
                    }
                    placeholder="내용을 입력하세요."
                    className="h-12 flex-1 rounded-xl border border-gray-300 px-5 text-[18px] text-gray-700 outline-none placeholder:text-gray-400 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const value = commentInput.trim();
                      if (!value) return;

                      const nextComment: OnePagerCommentItem = {
                        id: `comment-${Date.now()}-${submission.id}`,
                        author: currentTeacherName,
                        profileImage: currentTeacherProfileImage,
                        content: value,
                        type:
                          submission.status === "거절됨"
                            ? "REJECTION_REASON"
                            : "GENERAL",
                      };
                      onAddComment(submission.id, nextComment);
                      setCommentInputs((prev) => ({
                        ...prev,
                        [submission.id]: "",
                      }));
                    }}
                    className="h-12 rounded-xl bg-primary-500 px-8 font-semibold text-[18px] text-white"
                  >
                    등록
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {pageCount > 1 ? (
        <div className="mt-8 flex items-center justify-center gap-5">
          {Array.from({ length: pageCount }).map((_, index) => {
            const targetPage = index + 1;
            const active = targetPage === safePage;

            return (
              <button
                key={targetPage}
                type="button"
                onClick={() => setPage(targetPage)}
                className={`flex h-8 min-w-8 items-center justify-center rounded-full px-2 font-medium text-[24px] ${
                  active
                    ? "bg-primary-500 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {targetPage}
              </button>
            );
          })}
        </div>
      ) : null}
    </>
  );
}
