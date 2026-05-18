"use client";

export const runtime = "edge";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getSessionUser } from "utils";
import { useUserStore } from "shared";
import { 
  getStudentOnePagerDetail, 
  submitOnePager, 
  cancelOnePager 
} from "@/api/one-pager";
import { 
  DEFAULT_ONE_PAGER_FILE_STATUS,
  type OnePagerFileStatus 
} from "ui";

const DEFAULT_TITLE = "원페이저 제목";
const DEFAULT_DESCRIPTION =
  "현재는 동아리 개설 신청 양식을 제공합니다. 등록된 양식은 다운로드할 수 있고, 미리보기 PDF가 준비된 양식은 브라우저에서 바로 확인한 뒤 작성 완료 후 개설 신청 페이지에서 업로드해 제출할 수 있습니다.";

const STATUS_MAP: Record<string, OnePagerFileStatus> = {
  SUBMITTED: "제출됨",
  APPROVED: "승인됨",
  CHANGES_REQUESTED: "반려됨",
  REJECTED: "거절됨",
  CANCELED: "취소됨",
};

const STATUS_STYLES: Record<OnePagerFileStatus, { border: string; text: string; bg: string }> = {
  "제출됨": { border: "border-blue-500", text: "text-blue-500", bg: "bg-blue-50" },
  "승인됨": { border: "border-green-500", text: "text-green-500", bg: "bg-green-50" },
  "반려됨": { border: "border-yellow-500", text: "text-yellow-500", bg: "bg-yellow-50" },
  "거절됨": { border: "border-primary-500", text: "text-primary-500", bg: "bg-red-50" },
  "취소됨": { border: "border-gray-500", text: "text-gray-600", bg: "bg-gray-50" },
};

export default function StudentDocumentDetailPage() {
  const params = useParams();
  const documentId = params.documentId as string;
  const queryClient = useQueryClient();
  const { userInfo } = useUserStore();
  const userName = userInfo?.userName || getSessionUser()?.userName || "익명";

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [commentInput, setCommentInput] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch One-pager Detail
  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-onepager-detail", documentId],
    queryFn: () => getStudentOnePagerDetail(documentId),
    enabled: !!documentId,
  });

  // Submit Mutation
  const submitMutation = useMutation({
    mutationFn: (file: File) => submitOnePager(documentId, file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-onepager-detail", documentId] });
      setSelectedFile(null);
      toast.success("성공적으로 제출되었습니다.");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "원페이저 제출 중 오류가 발생했습니다.";
      toast.error(errorMessage);
    }
  });

  // Cancel Mutation
  const cancelMutation = useMutation({
    mutationFn: (submissionId: number) => cancelOnePager(submissionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student-onepager-detail", documentId] });
      toast.success("제출이 취소되었습니다.");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || "제출 취소 중 오류가 발생했습니다.";
      toast.error(errorMessage);
    }
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast.error("파일을 업로드 해주세요.");
      return;
    }
    submitMutation.mutate(selectedFile);
  };

  const handleCancelSubmission = (submissionId: number) => {
    if (confirm("정말로 제출을 취소하시겠습니까?")) {
      cancelMutation.mutate(submissionId);
    }
  };

  const handleDownload = (url: string, fileName: string) => {
    if (!url) return;
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#D66A6A] border-t-transparent" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">원페이저 정보를 불러오는 중 오류가 발생했습니다.</p>
      </div>
    );
  }

  const title = data?.title || DEFAULT_TITLE;
  const description = data?.description || DEFAULT_DESCRIPTION;
  const source = data?.fileUrl || data?.formUrl || "";
  const sourceType = data?.fileUrl ? "file" : "url";
  const sourceName = sourceType === "file" ? "원페이저 양식" : "원페이저 링크";
  
  const durationType = data?.onePagerDurationType;
  const deadline = data?.onePagerDuration;
  const deadlineText = durationType === "INFINITY" || !deadline
    ? "마감기한 없음"
    : `마감기한: ${deadline.split("T")[0]} ${deadline.split("T")[1]?.substring(0, 5) || ""}`;

  const mySubmission = data?.submitOnePagers && data.submitOnePagers.length > 0 
    ? data.submitOnePagers[0] 
    : null;
  const isSubmitted = !!mySubmission;
  const displayStatus = mySubmission ? (STATUS_MAP[mySubmission.onePagerState] || "제출됨") : "제출됨";

  return (
    <main className="min-h-screen bg-[#F8F9FA] pt-16 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div className={`grid gap-14 ${sourceType === "file" ? "lg:grid-cols-[1fr_480px]" : "grid-cols-1"}`}>
          {/* Left Side: Form Info */}
          <section className="pt-4">
            <h1 className="font-bold text-[28px] text-gray-800 leading-none">
              {title}
            </h1>
            <p className="mt-[26px] max-w-3xl text-[16px] text-gray-600 leading-[1.6]">
              {description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-[14px] text-gray-400">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{deadlineText}</span>
            </div>
            <div className="mt-8 mb-8 h-px w-full bg-gray-200" />

            {sourceType === "file" ? (
              <button
                type="button"
                onClick={() => handleDownload(source, sourceName)}
                disabled={!source}
                className="flex items-center gap-2 rounded-xl border border-primary-400 bg-white px-5 py-2.5 text-gray-800 transition-colors hover:bg-red-50 disabled:opacity-50"
              >
                <span className="font-medium text-[16px]">{sourceName}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" role="img" aria-label="다운로드 아이콘">
                  <title>다운로드 아이콘</title>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              </button>
            ) : (
              <a
                href={source ? (source.startsWith("http") ? source : `https://${source}`) : "#"}
                target="_blank"
                rel="noreferrer"
                className={`flex w-[400px] overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm transition-colors hover:border-red-200 ${!source ? "pointer-events-none opacity-50" : ""}`}
              >
                <div className="flex flex-1 flex-col justify-center px-5 py-4">
                  <span className="mb-1 font-bold text-[16px] text-gray-800 underline decoration-gray-400 underline-offset-4">
                    {sourceName}
                  </span>
                  <span className="truncate text-[13px] text-gray-500">
                    {source || "등록된 링크가 없습니다."}
                  </span>
                </div>
                <div className="w-[100px] bg-red-100/50" />
              </a>
            )}
          </section>

          {/* Right Side: Submission Panel (Only for File type) */}
          {sourceType === "file" && (
            <section className="flex flex-col gap-6">
              <article className="rounded-[24px] bg-white p-7 shadow-[0_2px_16_rgba(0,0,0,0.04)]">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="font-bold text-[22px] text-gray-800">
                    자료 제출
                  </h2>
                  {isSubmitted && (
                    <div className={`rounded-full border px-5 py-1.5 font-bold text-[15px] ${STATUS_STYLES[displayStatus].border} ${STATUS_STYLES[displayStatus].text} ${STATUS_STYLES[displayStatus].bg}`}>
                      {displayStatus}
                    </div>
                  )}
                </div>

                {!isSubmitted ? (
                  /* Before Submission UI */
                  <div className="flex flex-col gap-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <div
                      onClick={handleUploadClick}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-200 border-dashed bg-gray-50 text-gray-400 hover:bg-gray-100 transition-colors"
                    >
                      {selectedFile ? (
                        <span className="text-[14px] text-gray-700 font-medium">
                          {selectedFile.name}
                        </span>
                      ) : (
                        <span className="flex items-center gap-2 text-[14px]">
                          파일을 업로드 해주세요.
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </span>
                      )}
                    </div>
                    
                    {selectedFile && (
                      <div className="flex justify-end">
                        <button 
                          onClick={() => setSelectedFile(null)}
                          className="text-[13px] text-red-500 hover:underline"
                        >
                          삭제
                        </button>
                      </div>
                    )}

                    <button
                      onClick={handleSubmit}
                      disabled={submitMutation.isPending}
                      className="mt-2 w-full rounded-xl bg-primary-500 py-4 font-bold text-[18px] text-white transition-colors hover:bg-primary-600 shadow-sm disabled:opacity-50"
                    >
                      {submitMutation.isPending ? "제출 중..." : "제출하기"}
                    </button>
                  </div>
                ) : (
                  /* After Submission UI */
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 rounded-full border border-[#D66A6A] bg-white px-4 py-2 text-gray-800">
                      <span className="font-medium text-[15px] flex-1 truncate">
                        {mySubmission.clubName}_제출자료.pdf
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDownload(mySubmission.submitFileUrl, `${mySubmission.clubName}_제출자료.pdf`)}
                        className="flex h-[20px] w-[20px] cursor-pointer items-center justify-center rounded-full bg-[#C4C4C4] text-white hover:bg-gray-400"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                      </button>
                    </div>

                    <p className="ml-1 font-medium text-[13px] text-gray-400">
                      제출일 {mySubmission.submitDate.split("T")[0]}
                    </p>

                    <button
                      onClick={() => handleCancelSubmission(mySubmission.submissionId)}
                      disabled={cancelMutation.isPending}
                      className="mt-2 w-full rounded-xl border border-primary-500 py-4 font-bold text-[18px] text-primary-500 transition-colors hover:bg-red-50 shadow-sm disabled:opacity-50"
                    >
                      {cancelMutation.isPending ? "취소 중..." : "제출취소"}
                    </button>

                    <div className="my-4 h-px w-full bg-gray-100" />

                    {/* Comment Section */}
                    <div>
                      <h3 className="mb-4 font-semibold text-[18px] text-gray-800">
                        댓글{" "}
                        <span className="text-[#D66A6A]">
                          {mySubmission.submitComments.length}
                        </span>
                      </h3>

                      {mySubmission.submitComments.length > 0 && (
                        <div className="mb-5 space-y-4">
                          {mySubmission.submitComments.map((comment, idx) => (
                            <div key={idx} className="flex gap-3">
                              <div className="mt-1 h-11 w-11 shrink-0 rounded-full bg-[#EBA4A4]" />
                              <div>
                                <p className="font-bold text-[#4B4B4B] text-[16px]">
                                  {comment.commentWriter}
                                </p>
                                <p className="text-[#4B4B4B] text-[15px]">
                                  {comment.comment}
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
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            className="h-[44px] w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-[14px] leading-[1.6] outline-none placeholder:text-gray-400 focus:border-[#D66A6A]"
                          />
                          <button
                            type="button"
                            className="h-[44px] shrink-0 cursor-pointer rounded-xl bg-primary-500 px-6 text-[14px] text-white hover:bg-primary-600"
                          >
                            등록
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
