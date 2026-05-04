"use client";

import { type ReactNode, useMemo, useState } from "react";

export interface OnePagerSubmissionItem {
  id: string;
  label: string;
}

export interface OnePagerCommentItem {
  id: string;
  author: string;
  content: string;
  type?: "GENERAL" | "REJECTION_REASON";
}

interface OnePagerDetailViewProps {
  title: string;
  description: string;
  statusLabel?: string | null;
  submissionItems?: OnePagerSubmissionItem[];
  comments?: OnePagerCommentItem[];
  statusControl?: ReactNode;
  commentPlaceholder?: string;
  commentButtonText?: string;
  onSubmitComment?: (value: string) => void;
}

export function OnePagerDetailView({
  title,
  description,
  statusLabel = null,
  submissionItems = [],
  comments = [],
  statusControl,
  commentPlaceholder = "내용을 입력하세요.",
  commentButtonText = "등록",
  onSubmitComment,
}: OnePagerDetailViewProps) {
  const [commentValue, setCommentValue] = useState("");

  const commentCount = useMemo(() => comments.length, [comments.length]);

  const statusToneClassName = (() => {
    if (!statusLabel) return "";

    if (statusLabel === "승인됨") {
      return "border-emerald-300 text-emerald-600";
    }
    if (statusLabel === "반려됨") {
      return "border-amber-300 text-amber-500";
    }
    if (statusLabel === "거절됨") {
      return "border-rose-300 text-rose-500";
    }
    if (statusLabel === "취소됨") {
      return "border-gray-300 text-gray-500";
    }
    return "border-blue-300 text-blue-500";
  })();

  const handleSubmitComment = () => {
    const value = commentValue.trim();
    if (!value) {
      return;
    }

    onSubmitComment?.(value);
    setCommentValue("");
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-12">
      <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_480px]">
        <section>
          <h1 className="font-bold text-[28px] text-gray-800 leading-none">
            {title}
          </h1>
          <p className="mt-[26px] max-w-5xl font-medium text-[20px] text-gray-600 leading-[1.5]">
            {description}
          </p>
          <div className="mt-8 h-px w-full bg-gray-200" />
        </section>

        <aside className="rounded-3xl border border-gray-200 bg-white p-6 shadow-[0_8px_30px_rgba(15,23,42,0.08)]">
          <div className="mb-7 flex items-center justify-between">
            <h2 className="font-bold text-[40px] text-gray-800 leading-none">
              자료 제출
            </h2>
            {statusLabel ? (
              <span
                className={`rounded-full border px-6 py-2 font-medium text-xl leading-none ${statusToneClassName}`}
              >
                {statusLabel}
              </span>
            ) : null}
          </div>

          {statusControl ? <div className="mb-5">{statusControl}</div> : null}

          {submissionItems.length === 0 ? (
            <p className="text-gray-400 text-base">제출된 자료가 없습니다.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {submissionItems.map((item) => (
                <span
                  key={item.id}
                  className="inline-flex items-center gap-2 rounded-full border border-[#f29090] bg-white px-4 py-2 font-medium text-gray-800 text-[32px] leading-none"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gray-300 text-white text-[18px]"
                  >
                    ×
                  </span>
                </span>
              ))}
            </div>
          )}
        </aside>
      </div>

      <section className="mt-24 max-w-[720px] lg:ml-auto">
        <h3 className="font-bold text-[40px] text-gray-800 leading-none">
          댓글 <span className="text-primary-500">{commentCount}</span>
        </h3>
        <div className="mt-4">
          <textarea
            value={commentValue}
            onChange={(e) => setCommentValue(e.target.value)}
            placeholder={commentPlaceholder}
            className="h-[90px] w-full resize-none rounded-2xl border border-gray-300 bg-white px-6 py-5 text-[30px] text-gray-700 outline-none placeholder:text-gray-400 focus:border-primary-500"
          />
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitComment}
              className="rounded-2xl bg-primary-500 px-8 py-3 font-semibold text-[24px] text-white hover:bg-primary-600"
            >
              {commentButtonText}
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-7">
          {comments.map((comment) => (
            <article key={comment.id} className="flex items-start gap-4">
              <div className="h-16 w-16 rounded-full bg-[#f59b9b]" />
              <div>
                <p className="font-semibold text-[24px] text-gray-800 leading-none">
                  {comment.author}
                </p>
                {comment.type === "REJECTION_REASON" ? (
                  <p className="mt-2 font-semibold text-[18px] text-rose-500 leading-none">
                    거절됨 사유
                  </p>
                ) : null}
                <p className="mt-3 text-[24px] text-gray-700 leading-[1.35]">
                  {comment.content}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
