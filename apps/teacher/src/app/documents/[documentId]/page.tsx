"use client";
export const runtime = "edge";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useUserStore } from "shared";
import { toast } from "sonner";
import { DEFAULT_ONE_PAGER_FILE_STATUS, type OnePagerFileStatus } from "ui";
import { getSessionUser } from "utils";
import {
  getTeacherOnePagerDetail,
  getTeacherOnePagerForm,
} from "@/api/teacher";
import { Pagination } from "@/components";
import { DocumentCreationForm } from "@/features/documents/components/DocumentCreationForm";
import type {
  TeacherOnePagerDetailResponse,
  TeacherOnePagerFormResponse,
} from "@/types/teacher";

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
const STATUS_STYLES: Record<
  OnePagerFileStatus,
  { border: string; text: string }
> = {
  제출됨: { border: "border-blue-500", text: "text-blue-500" },
  승인됨: { border: "border-green-500", text: "text-green-500" },
  반려됨: { border: "border-yellow-500", text: "text-yellow-500" },
  거절됨: { border: "border-primary-500", text: "text-primary-500" },
  취소됨: { border: "border-gray-500", text: "text-gray-500" },
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
  onSave: (reason?: string) => void;
}) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (isOpen) setReason("");
  }, [isOpen]);

  if (!isOpen) return null;

  const statuses: { label: OnePagerFileStatus; color: string }[] = [
    { label: "승인됨", color: "bg-green-500" },
    { label: "반려됨", color: "bg-yellow-400" },
    { label: "거절됨", color: "bg-red-500" },
  ];

  const needsReason =
    selectedStatus === "반려됨" || selectedStatus === "거절됨";

  const handleSave = () => {
    if (needsReason && !reason.trim()) {
      toast.error("사유를 입력해주세요.");
      return;
    }
    onSave(reason.trim());
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-[440px] rounded-3xl bg-white p-8 shadow-xl">
        <h3 className="mb-6 text-center font-bold text-[22px] text-gray-800">
          상태 변경
        </h3>
        <div className="mb-6 space-y-4">
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

        {needsReason && (
          <div className="fade-in slide-in-from-top-2 mb-8 animate-in">
            <label className="mb-2 block font-medium text-[15px] text-gray-600">
              {selectedStatus} 사유
            </label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="학생에게 전달할 사유를 입력하세요."
              className="min-h-[100px] w-full resize-none rounded-xl border border-gray-200 p-4 text-[14px] outline-none focus:border-[#D66A6A]"
            />
          </div>
        )}

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
            onClick={handleSave}
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
  const params = useParams();
  const documentId = params.documentId as string;
  const [data, setData] = useState<TeacherOnePagerDetailResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [curPage, setCurPage] = useState(1);
  const itemsPerPage = 2;
  const [modalSubmissionIdx, setModalSubmissionIdx] = useState<number | null>(
    null,
  );
  const [pendingStatus, setPendingStatus] = useState<OnePagerFileStatus>(
    DEFAULT_ONE_PAGER_FILE_STATUS,
  );
  const [commentInputs, setCommentInputs] = useState<Record<number, string>>(
    {},
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!documentId) return;
    const fetchData = async () => {
      try {
        const res = await getTeacherOnePagerDetail(documentId);
        setData(res);
        setIsOwner(true);
      } catch (error: any) {
        const status = error?.status || error?.response?.status;
        if (status === 403) {
          try {
            const res = await getTeacherOnePagerForm(documentId);
            setData(res);
            setIsOwner(false);
          } catch {
            toast.error("원페이저 상세 정보를 불러오지 못했습니다.");
          }
        } else {
          console.error("Failed to fetch one-pager detail:", error);
          toast.error("원페이저 상세 정보를 불러오지 못했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [documentId]);

  const handleUpdateSuccess = async () => {
    setIsEditing(false);
    setIsLoading(true);
    try {
      const res = await getTeacherOnePagerDetail(documentId);
      setData(res);
      setIsOwner(true);
    } catch (error) {
      console.error("Failed to refresh data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const submissions = data?.submitOnePagers || [];
  const currentSubmissions = submissions.slice(
    (curPage - 1) * itemsPerPage,
    curPage * itemsPerPage,
  );
  const openStatusModal = (idx: number) => {
    const target = submissions[idx];
    if (!target) return;
    setModalSubmissionIdx(idx);
    setPendingStatus(
      STATUS_MAP[target.onePagerState] || DEFAULT_ONE_PAGER_FILE_STATUS,
    );
  };
  const saveStatus = (reason?: string) => {
    if (modalSubmissionIdx === null || !data) return;
    const newStatusKey = Object.keys(STATUS_MAP).find(
      (key) => STATUS_MAP[key] === pendingStatus,
    ) as any;
    const updatedSubmissions = [...data.submitOnePagers];

    let updatedSubmission = {
      ...updatedSubmissions[modalSubmissionIdx],
      onePagerState: newStatusKey,
    };

    if (reason) {
      const newComment = {
        commentWriter: getSessionUser()?.userName || "담당교사",
        comment: `[${pendingStatus}] ${reason}`,
      };
      updatedSubmission = {
        ...updatedSubmission,
        submitComments: [...updatedSubmission.submitComments, newComment],
      };
    }

    updatedSubmissions[modalSubmissionIdx] = updatedSubmission;
    setData({ ...data, submitOnePagers: updatedSubmissions });
    setModalSubmissionIdx(null);
  };
  const handleAddComment = (idx: number) => {
    const content = commentInputs[idx]?.trim();
    if (!content || !data) return;
    const updatedSubmissions = [...data.submitOnePagers];
    const newComment = {
      commentWriter: getSessionUser()?.userName || "익명",
      comment: content,
    };
    updatedSubmissions[idx] = {
      ...updatedSubmissions[idx],
      submitComments: [...updatedSubmissions[idx].submitComments, newComment],
    };
    setData({ ...data, submitOnePagers: updatedSubmissions });
    setCommentInputs((prev) => ({ ...prev, [idx]: "" }));
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
  const title = data?.title || DEFAULT_TITLE;
  const description = data?.description || DEFAULT_DESCRIPTION;

  const currentFileUrl = data?.fileUrl;
  const currentFormUrl = data?.formUrl;

  const source = currentFileUrl || currentFormUrl || "";
  const sourceType = currentFileUrl ? "file" : currentFormUrl ? "url" : null;
  const sourceName = sourceType === "file" ? "원페이저 양식" : "원페이저 링크";

  const duration = data?.onePagerDuration;
  const deadlineText = !duration
    ? "마감기한 없음"
    : `마감기한: ${duration.split("T")[0]} ${duration.split("T")[1]?.substring(0, 5) || ""}`;

  if (isEditing && data) {
    return (
      <main className="min-h-screen bg-[#F8F9FA] pt-16 pb-32">
        <div className="mx-auto max-w-7xl px-6">
          <DocumentCreationForm
            mode="edit"
            initialData={{
              id: documentId,
              title: data.title,
              description: data.description,
              fileUrl: data.fileUrl,
              formUrl: data.formUrl,
              onePagerDuration: data.onePagerDuration,
            }}
            onSuccess={handleUpdateSuccess}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F9FA] pt-16 pb-32">
      <div className="mx-auto max-w-7xl px-6">
        <div
          className={`grid gap-14 ${
            isOwner || submissions.length > 0
              ? "lg:grid-cols-[1fr_480px]"
              : "grid-cols-1"
          }`}
        >
          <section className="pt-4">
            <div className="flex items-start justify-between">
              <h1 className="font-bold text-[28px] text-gray-800 leading-none">
                {title}
              </h1>
              {isOwner && (
                <div className="relative" ref={menuRef}>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    className="p-1 text-[#989898] transition-colors hover:text-gray-600"
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <title>메뉴</title>
                      <circle cx="12" cy="5" r="2.5" />
                      <circle cx="12" cy="12" r="2.5" />
                      <circle cx="12" cy="19" r="2.5" />
                    </svg>
                  </button>
                  {isMenuOpen && (
                    <div className="absolute right-0 z-10 mt-2 flex w-[160px] flex-col gap-3 rounded-[30px] border border-gray-50 bg-white p-5 shadow-[0_4px_24px_rgba(0,0,0,0.1)]">
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full rounded-[20px] bg-[#989898] py-3.5 font-bold text-[18px] text-white transition-colors hover:bg-gray-500"
                      >
                        수정
                      </button>
                      <button
                        type="button"
                        className="w-full rounded-[20px] bg-[#D66A6A] py-3.5 font-bold text-[18px] text-white transition-colors hover:bg-[#c25e5e]"
                      >
                        삭제
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p className="mt-[26px] max-w-3xl text-[16px] text-gray-600 leading-[1.6]">
              {description}
            </p>
            <div className="mt-4 flex items-center gap-2 text-[14px] text-gray-400">
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <title>마감기한 아이콘</title>
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{deadlineText}</span>
            </div>
            <div className="mt-8 mb-8 h-px w-full bg-gray-200" />
            {source && (
              <button
                type="button"
                onClick={() => {
                  if (sourceType === "url" || source.startsWith("http")) {
                    window.open(source, "_blank");
                  } else {
                    handleDownload(source, `${sourceName}.pdf`);
                  }
                }}
                className="flex items-center gap-2 rounded-xl border border-primary-400 bg-white px-5 py-2.5 text-gray-800 transition-colors hover:bg-red-50 disabled:opacity-50"
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
                >
                  <title>
                    {sourceType === "file" ? "다운로드 아이콘" : "링크 아이콘"}
                  </title>
                  {sourceType === "file" ? (
                    <>
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </>
                  ) : (
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3" />
                  )}
                </svg>
              </button>
            )}
          </section>
          {(isOwner || submissions.length > 0) && (
            <section className="flex flex-col gap-6">
              {submissions.length === 0 ? (
                <div className="rounded-[24px] bg-white p-10 text-center shadow-[0_2px_16_rgba(0,0,0,0.04)]">
                  <p className="font-medium text-[16px] text-gray-500">
                    제출된 자료가 없습니다.
                  </p>
                </div>
              ) : (
                currentSubmissions.map((sub, i) => {
                  const actualIdx = (curPage - 1) * itemsPerPage + i;
                  const displayStatus =
                    STATUS_MAP[sub.onePagerState] || "제출됨";
                  const clubName =
                    sub.clubName ||
                    (sub as any).club_name ||
                    "알 수 없는 동아리";
                  return (
                    <article
                      key={`${clubName}-${sub.submitDate}`}
                      className="rounded-[24px] bg-white p-7 shadow-[0_2px_16_rgba(0,0,0,0.04)]"
                    >
                      <div className="mb-6 flex items-center justify-between">
                        <h2 className="font-bold text-[22px] text-gray-800">
                          {clubName}
                        </h2>
                        <button
                          type="button"
                          onClick={() => openStatusModal(actualIdx)}
                          className={`rounded-full border px-5 py-1.5 font-bold text-[15px] ${
                            STATUS_STYLES[displayStatus]?.border ||
                            "border-gray-300"
                          } ${STATUS_STYLES[displayStatus]?.text || "text-gray-600"}`}
                        >
                          {displayStatus}
                        </button>
                      </div>
                      <div className="mb-2 flex items-center">
                        <div className="flex items-center gap-2 rounded-full border border-[#D66A6A] bg-white px-4 py-2 text-gray-800">
                          <span className="font-medium text-[15px]">
                            제출 자료
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleDownload(
                                sub.submitFileUrl,
                                `${clubName}_제출자료.pdf`,
                              )
                            }
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
                        제출일 {sub.submitDate.split("T")[0]}
                      </p>
                      <div className="my-4 h-px w-full bg-gray-100" />
                      <div>
                        <h3 className="mb-4 font-semibold text-[18px] text-gray-800">
                          댓글{" "}
                          <span className="text-[#D66A6A]">
                            {sub.submitComments.length}
                          </span>
                        </h3>
                        {sub.submitComments.length > 0 && (
                          <div className="mb-5 space-y-4">
                            {sub.submitComments.map((comment, cIdx) => (
                              <div
                                key={`${comment.commentWriter}-${cIdx}`}
                                className="flex gap-3"
                              >
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
                              value={commentInputs[actualIdx] || ""}
                              onChange={(e) =>
                                setCommentInputs((prev) => ({
                                  ...prev,
                                  [actualIdx]: e.target.value,
                                }))
                              }
                              className="h-[44px] w-full resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-[14px] leading-[1.6] outline-none placeholder:text-gray-400 focus:border-[#D66A6A]"
                            />
                            <button
                              type="button"
                              onClick={() => handleAddComment(actualIdx)}
                              className="h-[44px] shrink-0 cursor-pointer rounded-xl bg-primary-500 px-6 text-[14px] text-white hover:bg-primary-600"
                            >
                              등록
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })
              )}
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
          )}
        </div>
      </div>
      <StatusModal
        isOpen={modalSubmissionIdx !== null}
        selectedStatus={pendingStatus}
        onClose={() => setModalSubmissionIdx(null)}
        onChangeStatus={setPendingStatus}
        onSave={saveStatus}
      />
    </main>
  );
}
