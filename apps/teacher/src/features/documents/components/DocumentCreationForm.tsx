"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { toast } from "sonner";
import { getTeacherMyInfo } from "@/api/teacher";
import { DocumentDeadlineModal } from "./DocumentDeadlineModal";

export function DocumentCreationForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "url">("file");
  const [deadlineDate, setDeadlineDate] = useState("");
  const [deadlineTime, setDeadlineTime] = useState("");
  const [isNoDeadline, setIsNoDeadline] = useState(false);
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [links, setLinks] = useState<{ id: string; url: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [teacherName, setTeacherName] = useState("");
  const [errors, setErrors] = useState<{
    title?: string;
    source?: string;
    deadline?: string;
  }>({});

  useEffect(() => {
    const fetchTeacherInfo = async () => {
      try {
        const info = await getTeacherMyInfo();
        setTeacherName(info.name);
      } catch (error) {
        console.error("Failed to fetch teacher info:", error);
      }
    };
    void fetchTeacherInfo();
  }, []);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const titleId = useId();
  const descId = useId();
  const deadlineDisplayId = useId();
  const fileUrlLabelId = useId();

  const updateLink = (id: string, url: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, url } : l)));
    if (url.trim() && errors.source) {
      setErrors((prev) => ({ ...prev, source: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (errors.source) {
        setErrors((prev) => ({ ...prev, source: undefined }));
      }
    }
  };

  const deadlineDisplayText = isNoDeadline
    ? "마감일 없음"
    : deadlineDate
      ? `${deadlineDate} ${deadlineTime}`
      : "마감기한을 설정해주세요.";

  const validateForm = () => {
    const nextErrors: { title?: string; source?: string; deadline?: string } =
      {};

    if (!title.trim()) {
      nextErrors.title = "제목은 필수 입력 항목입니다.";
    }

    const urlValue = links[0]?.url?.trim() ?? "";

    if (uploadType === "file" && !file) {
      nextErrors.source = "파일 업로드는 필수 입력 항목입니다.";
    }

    if (uploadType === "url" && !urlValue) {
      nextErrors.source = "URL 첨부는 필수 입력 항목입니다.";
    }

    if (!isNoDeadline && (!deadlineDate || !deadlineTime)) {
      nextErrors.deadline = "마감기한 설정은 필수 입력 항목입니다.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handlePublish = () => {
    if (!validateForm()) {
      return;
    }

    const documentId = `draft-${Date.now()}`;
    const query = new URLSearchParams({
      title: title.trim(),
      description: description.trim(),
      sourceType: uploadType,
    });

    if (uploadType === "file" && file) {
      const objectUrl = URL.createObjectURL(file);
      sessionStorage.setItem("pendingBlobUrl", objectUrl);
      query.set("source", objectUrl);
      query.set("sourceName", file.name);
    } else {
      query.set("source", links[0]?.url?.trim() ?? "");
    }

    if (uploadType === "file") {
      query.set("status", DEFAULT_ONE_PAGER_FILE_STATUS);
    }

    if (isNoDeadline) {
      query.set("noDeadline", "true");
    } else {
      query.set("deadlineDate", deadlineDate);
      query.set("deadlineTime", deadlineTime);
    }

    router.push(`/documents/${documentId}?${query.toString()}`);
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-[10px] border border-gray-100 bg-gray-50 p-8 md:p-12">
      <h1 className="mb-12 text-center font-bold text-2xl text-gray-900">
        원페이저 양식
      </h1>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-start">
          <label
            htmlFor={titleId}
            className="w-full font-medium text-[15px] text-gray-900 md:w-[140px] md:pt-2.5"
          >
            <span className="mr-1 text-[#f45f5f]">*</span>제목
          </label>
          <div className="flex flex-1 flex-col gap-1">
            <div className="rounded-lg border border-gray-100 bg-white p-2.5">
              <input
                id={titleId}
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (e.target.value.trim() && errors.title) {
                    setErrors((prev) => ({ ...prev, title: undefined }));
                  }
                }}
                placeholder="제목을 작성해주세요."
                className="w-full bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>
            {errors.title ? (
              <p className="text-[#f45f5f] text-[13px]">{errors.title}</p>
            ) : null}
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <label
            htmlFor={descId}
            className="w-full font-medium text-[15px] text-gray-900 md:w-[140px] md:pt-2.5"
          >
            설명
          </label>
          <div className="flex-1 rounded-lg border border-gray-100 bg-white p-2.5">
            <textarea
              id={descId}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="양식에 관한 설명을 작성해주세요."
              className="min-h-[120px] w-full resize-none bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <div
            id={fileUrlLabelId}
            className="w-full shrink-0 pt-2.5 font-medium text-[15px] text-gray-900 md:w-[140px]"
          >
            <span className="mr-1 text-[#f45f5f]">*</span>파일 선택/URL 첨부
          </div>

          <fieldset
            aria-labelledby={fileUrlLabelId}
            className="flex flex-1 flex-col gap-4"
          >
            <div className="flex rounded-lg border border-gray-100 bg-gray-50 p-1">
              <button
                type="button"
                onClick={() => setUploadType("file")}
                className={`flex-1 rounded-md py-2 font-medium text-[14px] ${
                  uploadType === "file"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "cursor-pointer text-gray-400"
                }`}
              >
                파일 업로드
              </button>
              <button
                type="button"
                onClick={() => setUploadType("url")}
                className={`flex-1 rounded-md py-2 font-medium text-[14px] ${
                  uploadType === "url"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "cursor-pointer text-gray-400"
                }`}
              >
                URL 첨부
              </button>
            </div>

            {uploadType === "file" ? (
              file ? (
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-lg border border-gray-100 bg-white p-2.5">
                    <input
                      type="text"
                      value={file.name}
                      readOnly
                      className="w-full bg-transparent text-[15px] text-gray-900 outline-none"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                    }}
                    className="cursor-pointer text-[14px] text-red-500 hover:text-red-600"
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-200 border-dashed bg-white text-gray-400 hover:bg-gray-50"
                  >
                    <span className="flex items-center gap-2 text-[14px]">
                      파일을 업로드 해주세요.
                      <Image
                        src="/images/icons/fileupload.svg"
                        alt="업로드"
                        width={12}
                        height={12}
                      />
                    </span>
                  </button>
                </>
              )
            ) : (
              <div className="rounded-lg border border-gray-100 bg-white p-2.5">
                <input
                  type="text"
                  value={links[0]?.url || ""}
                  onChange={(e) => {
                    if (links.length === 0) {
                      setLinks([{ id: "default", url: e.target.value }]);
                      if (e.target.value.trim() && errors.source) {
                        setErrors((prev) => ({ ...prev, source: undefined }));
                      }
                    } else {
                      updateLink(links[0].id, e.target.value);
                    }
                  }}
                  placeholder="URL을 입력해주세요."
                  className="w-full bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            )}
            {errors.source ? (
              <p className="text-[#f45f5f] text-[13px]">{errors.source}</p>
            ) : null}
          </fieldset>
        </div>

        <div className="flex flex-col gap-2 md:flex-row md:items-start">
          <label
            htmlFor={deadlineDisplayId}
            className="w-full font-medium text-[15px] text-gray-900 md:w-[140px] md:pt-2.5"
          >
            <span className="mr-1 text-[#f45f5f]">*</span>마감기한 설정
          </label>

          <div className="flex flex-1 flex-col gap-1">
            <div className="flex items-center gap-2">
              <div className="flex-1 rounded-lg border border-gray-100 bg-white p-2.5">
                <input
                  id={deadlineDisplayId}
                  type="text"
                  value={deadlineDisplayText}
                  readOnly
                  className="w-full bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>

              <button
                type="button"
                onClick={() => setIsDeadlineModalOpen(true)}
                className="cursor-pointer rounded-md bg-[#06070c] px-4 py-2 font-medium text-sm text-white hover:bg-[#06070c]/90"
              >
                일정 지정하기
              </button>
            </div>
            {errors.deadline ? (
              <p className="text-[#f45f5f] text-[13px]">{errors.deadline}</p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <button
          type="button"
          onClick={handlePublish}
          className="h-12 w-full max-w-sm cursor-pointer rounded-lg bg-[#f45f5f] font-medium text-white text-xl hover:bg-[#f45f5f]/90 md:w-80"
        >
          게시하기
        </button>
      </div>

      <DocumentDeadlineModal
        isOpen={isDeadlineModalOpen}
        onClose={() => setIsDeadlineModalOpen(false)}
        initialValue={{
          deadlineDate,
          deadlineTime,
          isNoDeadline,
        }}
        onSave={({ deadlineDate, deadlineTime, isNoDeadline }) => {
          setDeadlineDate(deadlineDate);
          setDeadlineTime(deadlineTime);
          setIsNoDeadline(isNoDeadline);
          if (isNoDeadline || (deadlineDate && deadlineTime)) {
            setErrors((prev) => ({ ...prev, deadline: undefined }));
          }
        }}
      />
    </div>
  );
}
