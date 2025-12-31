"use client";

import { useId, useState } from "react";

const INPUT_STYLE =
  "w-full rounded-md bg-white px-4 py-3.5 border-[0.1px] border-gray-200 text-base placeholder-gray-400 focus:outline-none";

interface LinkItem {
  id: string;
  url: string;
}

interface LinkInputProps {
  links: LinkItem[];
  onLinksChange: (links: LinkItem[]) => void;
  placeholder?: string;
}

export default function LinkInput({
  links,
  onLinksChange,
  placeholder = "동아리 관련 링크를 첨부해주세요.",
}: LinkInputProps) {
  const [currentLink, setCurrentLink] = useState("");
  const [error, setError] = useState("");
  const inputId = useId();

  const isValidUrl = (url: string) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "http:" || parsed.protocol === "https:";
    } catch {
      return false;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const trimmedLink = currentLink.trim();

      if (!trimmedLink) return;

      if (!isValidUrl(trimmedLink)) {
        setError("올바른 링크 형식을 입력해주세요. (예: https://example.com)");
        return;
      }

      setError("");
      onLinksChange([...links, { id: crypto.randomUUID(), url: trimmedLink }]);
      setCurrentLink("");
    }
  };

  const removeLink = (idToRemove: string) => {
    onLinksChange(links.filter((link) => link.id !== idToRemove));
  };

  return (
    <>
      <input
        id={inputId}
        type="text"
        placeholder={placeholder}
        value={currentLink}
        onChange={(e) => setCurrentLink(e.target.value)}
        onKeyDown={handleKeyDown}
        className={INPUT_STYLE}
      />
      {error ? (
        <p className="mt-2 text-[12px] text-red-500">{error}</p>
      ) : (
        <p className="mt-2 ml-2 text-[#999999] text-[12px]">
          엔터를 누르면 링크가 추가됩니다
        </p>
      )}

      {links.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {links.map((link) => (
            <div
              key={link.id}
              className="flex items-center gap-2 rounded-full border border-[#D5D5D5] bg-white px-4 py-2"
            >
              <span className="whitespace-nowrap text-[#666666] text-[13px]">
                {link.url}
              </span>
              <button
                type="button"
                onClick={() => removeLink(link.id)}
                className="text-[#999999] hover:text-[#666666]"
                aria-label="링크 삭제"
              >
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
