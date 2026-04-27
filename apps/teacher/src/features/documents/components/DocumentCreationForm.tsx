"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";

export function DocumentCreationForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploadType, setUploadType] = useState<"file" | "url">("file");
  const [deadline, setDeadline] = useState("");
  const [links, setLinks] = useState<{ id: string; url: string }[]>([]);
  const [file, setFile] = useState<File | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const titleId = useId();
  const descId = useId();
  const deadlineId = useId();
  const fileUrlLabelId = useId();

  const updateLink = (id: string, url: string) => {
    setLinks(links.map((l) => (l.id === id ? { ...l, url } : l)));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) setFile(selectedFile);
  };

  return (
    <div className="mx-auto w-full max-w-5xl rounded-[10px] border border-gray-100 bg-gray-50 p-8 md:p-12">
      <h1 className="mb-12 text-center font-bold text-2xl text-gray-900">
        원페이저 양식
      </h1>

      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2 md:flex-row">
          <label
            htmlFor={titleId}
            className="w-full font-medium text-[15px] text-gray-900 md:w-[140px] md:pt-2.5"
          >
            <span className="mr-1 text-[#f45f5f]">*</span>제목
          </label>
          <div className="flex-1 rounded-lg border border-gray-100 bg-white p-2.5">
            <input
              id={titleId}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 작성해주세요."
              className="w-full bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
            />
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

          <fieldset className="flex flex-1 flex-col gap-4">
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
                    onClick={() => setFile(null)}
                    className="text-[14px] text-red-500"
                  >
                    삭제
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-gray-200 border-dashed bg-white text-gray-400 hover:bg-gray-50"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
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
              )
            ) : (
              <div className="rounded-lg border border-gray-100 bg-white p-2.5">
                <input
                  type="text"
                  value={links[0]?.url || ""}
                  onChange={(e) => {
                    if (links.length === 0) {
                      setLinks([{ id: "default", url: e.target.value }]);
                    } else {
                      updateLink(links[0].id, e.target.value);
                    }
                  }}
                  placeholder="URL을 입력해주세요."
                  className="w-full bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
                />
              </div>
            )}
          </fieldset>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <label
            htmlFor={deadlineId}
            className="w-full font-medium text-[15px] text-gray-900 md:w-[140px] md:pt-2.5"
          >
            <span className="mr-1 text-[#f45f5f]">*</span>마감기한 설정
          </label>

          <div className="flex flex-1 items-center gap-2">
            <div className="flex-1 rounded-lg border border-gray-100 bg-white p-2.5">
              <input
                id={deadlineId}
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="마감기한을 설정해주세요."
                className="w-full bg-transparent text-[15px] text-gray-900 outline-none placeholder:text-gray-400"
              />
            </div>

            <button
              type="button"
              className="cursor-pointer rounded-md bg-[#06070c] px-4 py-2 font-medium text-sm text-white hover:bg-[#06070c]/90"
            >
              일정 지정하기
            </button>
          </div>
        </div>
      </div>

      <div className="mt-16 flex justify-center">
        <button
          type="button"
          className="h-12 w-full max-w-sm cursor-pointer rounded-lg bg-[#f45f5f] font-medium text-white text-xl hover:bg-[#f45f5f]/90 md:w-80"
        >
          게시하기
        </button>
      </div>
    </div>
  );
}
