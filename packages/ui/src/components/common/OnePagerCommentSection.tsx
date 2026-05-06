"use client";

import { useState } from "react";

export interface OnePagerCommentItem {
  id: string;
  author: string;
  content: string;
  profileImage?: string | null;
  type?: "GENERAL" | "REJECTION_REASON";
}

interface OnePagerCommentSectionProps {
  comments: OnePagerCommentItem[];
  placeholder?: string;
  buttonText?: string;
  onSubmit?: (value: string) => void;
}

export function OnePagerCommentSection({
  comments,
  placeholder = "내용을 입력하세요.",
  buttonText = "등록",
  onSubmit,
}: OnePagerCommentSectionProps) {
  const [value, setValue] = useState("");

  const handleSubmit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit?.(trimmed);
    setValue("");
  };

  return (
    <div>
      <h2 className="mb-3 font-bold text-[17px] text-gray-900">
        댓글 <span className="text-[#E56D6D]">{comments.length}</span>
      </h2>
      <textarea
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="h-[70px] w-full resize-none rounded-xl border border-gray-200 p-4 text-gray-800 text-sm placeholder:text-gray-400 focus:border-[#E56D6D] focus:outline-none focus:ring-1 focus:ring-[#E56D6D]"
      />
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={handleSubmit}
          className="rounded-lg bg-[#E56D6D] px-6 py-2 font-bold text-sm text-white transition-colors hover:bg-[#d65f5f]"
        >
          {buttonText}
        </button>
      </div>

      {comments.length > 0 && (
        <div className="mt-8 flex flex-col gap-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3.5">
              <div className="mt-1 h-[42px] w-[42px] shrink-0 overflow-hidden rounded-full border border-gray-100 bg-[#ECA8A8]">
                <img
                  src={comment.profileImage || "/admin-profile-default.svg"}
                  alt={`${comment.author} 프로필`}
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.src = "/admin-profile-default.svg";
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
  );
}
