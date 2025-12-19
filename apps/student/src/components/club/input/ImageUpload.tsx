"use client";

import Image from "next/image";
import { useId, useState } from "react";

const INPUT_STYLE =
  "w-full rounded-md bg-white px-4 py-3.5 text-[14px] placeholder-[#AAAAAA] focus:outline-none";

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

  const inputId = useId();
  const fileInputId = useId();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
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
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      {previewUrl && (
        <div className="mt-3 flex w-full items-center justify-between rounded-md bg-white px-4 py-3">
          <div className="relative h-[82px] w-[82px] overflow-hidden rounded-lg bg-gray-100">
            <Image
              src={previewUrl}
              alt="Preview"
              fill
              className="object-cover"
            />
          </div>
          <label
            htmlFor={fileInputId}
            className="cursor-pointer text-[14px] text-gray-700 hover:text-gray-900"
          >
            변경
          </label>
        </div>
      )}
    </>
  );
}
