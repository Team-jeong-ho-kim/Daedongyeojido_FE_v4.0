"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { FIELDS } from "@/constants/club";
import type { ClubDetail } from "@/types";

interface ClubInfoEditSectionProps {
  club: ClubDetail;
  isClubMember: boolean;
  editClubImage: string;
  setEditClubImage: (value: string) => void;
  setEditClubImageFile: (value: File | null) => void;
  editClubName: string;
  setEditClubName: (value: string) => void;
  editOneLiner: string;
  setEditOneLiner: (value: string) => void;
  editMajors: string[];
  toggleMajor: (major: string) => void;
  editIntroduction: string;
  setEditIntroduction: (value: string) => void;
  editLinks: { id: string; url: string }[];
  setEditLinks: (value: { id: string; url: string }[]) => void;
}

export function ClubInfoEditSection({
  club,
  isClubMember,
  editClubImage,
  setEditClubImage,
  setEditClubImageFile,
  editClubName,
  setEditClubName,
  editOneLiner,
  setEditOneLiner,
  editMajors,
  toggleMajor,
  editIntroduction,
  setEditIntroduction,
  editLinks,
  setEditLinks,
}: ClubInfoEditSectionProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingOneLiner, setIsEditingOneLiner] = useState(false);
  const [isEditingIntro, setIsEditingIntro] = useState(false);
  const [isEditingLinks, setIsEditingLinks] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const oneLinerInputRef = useRef<HTMLInputElement>(null);
  const introTextareaRef = useRef<HTMLTextAreaElement>(null);

  const editLinksUrls = editLinks.map((l) => l.url);

  // 동아리명 편집 모드 시 포커스
  useEffect(() => {
    if (isEditingName && nameInputRef.current) {
      const input = nameInputRef.current;
      input.focus();
      input.selectionStart = input.value.length;
      input.selectionEnd = input.value.length;
    }
  }, [isEditingName]);

  // 한줄 소개 편집 모드 시 포커스
  useEffect(() => {
    if (isEditingOneLiner && oneLinerInputRef.current) {
      const input = oneLinerInputRef.current;
      input.focus();
      input.selectionStart = input.value.length;
      input.selectionEnd = input.value.length;
    }
  }, [isEditingOneLiner]);

  // textarea 높이 자동 조절
  const adjustTextareaHeight = () => {
    if (introTextareaRef.current) {
      introTextareaRef.current.style.height = "auto";
      introTextareaRef.current.style.height = `${introTextareaRef.current.scrollHeight}px`;
    }
  };

  // 소개 편집 모드 시 포커스
  useEffect(() => {
    if (isEditingIntro && introTextareaRef.current) {
      const textarea = introTextareaRef.current;
      textarea.focus();
      textarea.selectionStart = textarea.value.length;
      textarea.selectionEnd = textarea.value.length;
      adjustTextareaHeight();
    }
  }, [isEditingIntro]);

  // 소개 내용 변경 시 높이 조절
  useEffect(() => {
    adjustTextareaHeight();
  }, [editIntroduction]);

  return (
    <>
      {/* 동아리 이미지 */}
      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
        <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
          동아리 이미지
        </h2>
        <div className="flex items-center gap-4">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg border border-gray-200">
            <Image
              src={isClubMember ? editClubImage : club.clubImage}
              alt="동아리 이미지"
              fill
              className="object-cover"
            />
          </div>
          {isClubMember && (
            <label className="cursor-pointer rounded-lg border border-gray-300 px-3 py-1.5 text-[13px] text-gray-600 hover:bg-gray-50">
              이미지 변경
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const url = URL.createObjectURL(file);
                    setEditClubImage(url);
                    setEditClubImageFile(file);
                  }
                }}
              />
            </label>
          )}
        </div>
      </section>

      {/* 동아리명 */}
      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
        <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
          동아리명
        </h2>
        <div
          className={`flex flex-1 items-center rounded-lg border bg-white px-4 py-2.5 ${
            isEditingName
              ? "border-primary-500 ring-1 ring-primary-500"
              : "border-gray-100"
          }`}
        >
          {isEditingName ? (
            <input
              ref={nameInputRef}
              type="text"
              value={editClubName}
              onChange={(e) => setEditClubName(e.target.value)}
              className="flex-1 bg-transparent text-[14px] text-gray-700 focus:outline-none md:text-[15px]"
            />
          ) : (
            <p className="flex-1 text-[14px] text-gray-700 md:text-[15px]">
              {isClubMember ? editClubName : club.clubName}
            </p>
          )}
          {isClubMember && !isEditingName && (
            <button
              type="button"
              onClick={() => setIsEditingName(true)}
              className="ml-2 shrink-0"
            >
              <Image
                src="/images/icons/edit.svg"
                alt="편집"
                width={16}
                height={16}
              />
            </button>
          )}
          {isClubMember && isEditingName && (
            <button
              type="button"
              onClick={() => setIsEditingName(false)}
              className="ml-2 shrink-0 text-[13px] text-primary-500 hover:text-primary-600"
            >
              완료
            </button>
          )}
        </div>
      </section>

      {/* 한줄 소개 */}
      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
        <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
          한줄 소개
        </h2>
        <div
          className={`flex flex-1 items-center rounded-lg border bg-white px-4 py-2.5 ${
            isEditingOneLiner
              ? "border-primary-500 ring-1 ring-primary-500"
              : "border-gray-100"
          }`}
        >
          {isEditingOneLiner ? (
            <div className="flex flex-1 items-center gap-2">
              <input
                ref={oneLinerInputRef}
                type="text"
                value={editOneLiner}
                maxLength={30}
                onChange={(e) => setEditOneLiner(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    editOneLiner.length >= 30 &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    !e.ctrlKey &&
                    !e.metaKey
                  ) {
                    toast.error("한줄 소개는 30자를 초과할 수 없습니다");
                  }
                }}
                className="flex-1 bg-transparent text-[14px] text-gray-700 focus:outline-none md:text-[15px]"
              />
              <span className="shrink-0 text-[12px] text-gray-400">
                {editOneLiner.length}/30
              </span>
            </div>
          ) : (
            <p className="flex-1 text-[14px] text-gray-700 md:text-[15px]">
              {isClubMember ? editOneLiner : club.oneLiner}
            </p>
          )}
          {isClubMember && !isEditingOneLiner && (
            <button
              type="button"
              onClick={() => setIsEditingOneLiner(true)}
              className="ml-2 shrink-0"
            >
              <Image
                src="/images/icons/edit.svg"
                alt="편집"
                width={16}
                height={16}
              />
            </button>
          )}
          {isClubMember && isEditingOneLiner && (
            <button
              type="button"
              onClick={() => setIsEditingOneLiner(false)}
              className="ml-2 shrink-0 text-[13px] text-primary-500 hover:text-primary-600"
            >
              완료
            </button>
          )}
        </div>
      </section>

      {/* 동아리 전공 */}
      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
        <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
          동아리 전공
        </h2>
        <div className="flex flex-wrap gap-2">
          {isClubMember
            ? FIELDS.map((field) => (
                <button
                  key={field}
                  type="button"
                  onClick={() => toggleMajor(field)}
                  className={`rounded-full border px-3 py-1 text-[12px] md:text-[13px] ${
                    editMajors.includes(field)
                      ? "border-primary-500 bg-primary-50 text-primary-500"
                      : "border-gray-300 text-gray-500"
                  }`}
                >
                  {field}
                </button>
              ))
            : club.majors.map((major) => (
                <span
                  key={major}
                  className="rounded-full border border-primary-300 px-3 py-1 text-[12px] text-primary-500 md:text-[13px]"
                >
                  {major}
                </span>
              ))}
        </div>
      </section>

      {/* 동아리 소개 */}
      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
        <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
          동아리 소개
        </h2>
        <div
          className={`flex flex-1 items-start rounded-lg border bg-white p-4 ${
            isEditingIntro
              ? "border-primary-500 ring-1 ring-primary-500"
              : "border-gray-100"
          }`}
        >
          {isEditingIntro ? (
            <div className="flex w-full flex-col gap-2">
              <textarea
                ref={introTextareaRef}
                value={editIntroduction}
                maxLength={500}
                onChange={(e) => setEditIntroduction(e.target.value)}
                onKeyDown={(e) => {
                  if (
                    editIntroduction.length >= 500 &&
                    e.key !== "Backspace" &&
                    e.key !== "Delete" &&
                    !e.ctrlKey &&
                    !e.metaKey
                  ) {
                    toast.error("동아리 소개는 500자를 초과할 수 없습니다");
                  }
                }}
                className="min-h-[100px] w-full resize-none overflow-hidden bg-transparent text-[14px] text-gray-700 focus:outline-none md:text-[15px]"
              />
              <div className="flex items-center justify-between">
                <span className="text-[12px] text-gray-400">
                  {editIntroduction.length}/500
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingIntro(false)}
                  className="text-[13px] text-primary-500 hover:text-primary-600"
                >
                  완료
                </button>
              </div>
            </div>
          ) : (
            <p className="flex-1 text-[14px] text-gray-700 md:text-[15px]">
              {isClubMember ? editIntroduction : club.introduction}
            </p>
          )}
          {isClubMember && !isEditingIntro && (
            <button
              type="button"
              onClick={() => setIsEditingIntro(true)}
              className="ml-2 shrink-0"
            >
              <Image
                src="/images/icons/edit.svg"
                alt="편집"
                width={16}
                height={16}
              />
            </button>
          )}
        </div>
      </section>

      {/* 동아리 관련 링크 */}
      <section className="flex flex-col gap-2 md:flex-row md:gap-0">
        <h2 className="font-medium text-[14px] md:w-[140px] md:text-[15px]">
          동아리 관련 링크
        </h2>
        <div
          className={`flex flex-1 items-start rounded-lg border bg-white p-4 ${
            isEditingLinks
              ? "border-primary-500 ring-1 ring-primary-500"
              : "border-gray-100"
          }`}
        >
          {isEditingLinks ? (
            <div className="flex w-full flex-col gap-3 pt-1">
              {editLinks.map((linkItem) => (
                <div key={linkItem.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={linkItem.url}
                    onChange={(e) => {
                      setEditLinks(
                        editLinks.map((l) =>
                          l.id === linkItem.id
                            ? { ...l, url: e.target.value }
                            : l,
                        ),
                      );
                    }}
                    className="flex-1 rounded border border-gray-200 px-2 py-1 text-[14px] text-gray-700 focus:border-gray-400 focus:outline-none md:text-[15px]"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setEditLinks(
                        editLinks.filter((l) => l.id !== linkItem.id),
                      );
                    }}
                    className="text-[14px] text-red-500 hover:text-red-600"
                  >
                    삭제
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() =>
                    setEditLinks([
                      ...editLinks,
                      { id: `new-${Date.now()}`, url: "" },
                    ])
                  }
                  className="text-[14px] text-gray-500 hover:text-gray-700"
                >
                  + 링크 추가
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingLinks(false)}
                  className="mt-7 text-[13px] text-primary-500 hover:text-primary-600"
                >
                  완료
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-1">
              {(isClubMember ? editLinksUrls : club.links).map((link) => (
                <a
                  key={link}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="truncate text-[14px] text-gray-500 underline md:text-[15px]"
                >
                  {link}
                </a>
              ))}
            </div>
          )}
          {isClubMember && !isEditingLinks && (
            <button
              type="button"
              onClick={() => setIsEditingLinks(true)}
              className="ml-2 shrink-0"
            >
              <Image
                src="/images/icons/edit.svg"
                alt="편집"
                width={16}
                height={16}
              />
            </button>
          )}
        </div>
      </section>
    </>
  );
}
