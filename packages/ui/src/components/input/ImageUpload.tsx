"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useState } from "react";
import { toast } from "sonner";

const INPUT_STYLE =
  "w-full rounded-md bg-white px-4 py-3.5 border-[0.1px] border-gray-200 text-base placeholder-gray-400 focus:outline-none";

interface ImageUploadProps {
  onFileChange: (file: File | null, previewUrl: string | null) => void;
  placeholder?: string;
}

export default function ImageUpload({
  onFileChange,
  placeholder = "파일을 업로드 해주세요.",
}: ImageUploadProps) {
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const inputId = useId();
  const fileInputId = useId();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 파일 형식 검증
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("JPG, JPEG, PNG, WEBP 형식의 이미지만 업로드 가능합니다.");
        e.target.value = "";
        return;
      }

      setFileName(file.name);

      const reader = new FileReader();
      reader.onloadend = () => {
        const url = reader.result as string;
        setPreviewUrl(url);
        onFileChange(file, url);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsModalOpen(false);
    }
  }, []);

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }
  }, [isModalOpen, handleKeyDown]);

  return (
    <>
      <label htmlFor={fileInputId} className="relative block cursor-pointer">
        <input
          id={inputId}
          type="text"
          placeholder={placeholder}
          readOnly
          value={fileName}
          className={`${INPUT_STYLE} pointer-events-none cursor-pointer pr-12`}
        />
        <span className="-translate-y-1/2 absolute top-1/2 right-4">
          <Image
            src="/images/icons/upload.svg"
            alt=""
            width={18}
            height={18}
            aria-hidden="true"
          />
        </span>
        <input
          id={fileInputId}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {previewUrl && (
        <div className="mt-3 flex w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="group relative h-[82px] w-[82px] cursor-pointer overflow-hidden rounded-lg bg-gray-100"
          >
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors group-hover:bg-black/40">
              <span className="text-white text-xs opacity-0 transition-opacity group-hover:opacity-100">
                크게 보기
              </span>
            </div>
          </button>
          <label
            htmlFor={fileInputId}
            className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-[14px] text-gray-700 transition-colors hover:bg-gray-50"
          >
            변경
          </label>
        </div>
      )}

      {isModalOpen && previewUrl && (
        <div
          role="dialog"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={() => setIsModalOpen(false)}
          onKeyDown={() => {}}
        >
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-2xl text-white hover:bg-white/30"
          >
            ✕
          </button>
          <Image
            src={previewUrl}
            alt="Full size preview"
            width={400}
            height={400}
            className="max-h-[70vh] max-w-[80vw] rounded-lg object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
