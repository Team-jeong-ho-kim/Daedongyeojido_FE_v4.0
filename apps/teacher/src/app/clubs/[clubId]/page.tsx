"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  clearTokens,
  getAccessToken,
  getDocumentDownloadFileName,
  getDocumentFileExtensionLabel,
  getSessionUser,
} from "utils";
import { getTeacherClubCreationApplicationDetail } from "@/api/teacher";
import { TeacherClubCreationPreviewModal } from "@/components/common/TeacherClubCreationPreviewModal";
import { moveToWebLogin } from "@/lib/auth";
import type { TeacherClubCreationApplicationDetailResponse } from "@/types/teacher";

export default function TeacherClubCreationApplicationDetailPage() {
  const params = useParams<{ clubId: string }>();
  const clubId = useMemo(() => {
    if (!params?.clubId) return "";
    return Array.isArray(params.clubId) ? params.clubId[0] : params.clubId;
  }, [params]);

  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isClubCreationFormPreviewOpen, setIsClubCreationFormPreviewOpen] =
    useState(false);
  const [isDownloadingClubCreationForm, setIsDownloadingClubCreationForm] =
    useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [detail, setDetail] =
    useState<TeacherClubCreationApplicationDetailResponse | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadDetail = async () => {
      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();

      if (!accessToken || !sessionUser || sessionUser.role !== "TEACHER") {
        clearTokens();
        moveToWebLogin();
        return;
      }

      if (!clubId) {
        if (isMounted) {
          setErrorMessage("잘못된 동아리 신청 ID입니다.");
          setIsCheckingSession(false);
        }
        return;
      }

      try {
        const response = await getTeacherClubCreationApplicationDetail(clubId);

        if (!isMounted) return;
        setDetail(response);
      } catch {
        if (!isMounted) return;
        setErrorMessage("개설 신청 상세 정보를 불러오지 못했습니다.");
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    loadDetail();

    return () => {
      isMounted = false;
    };
  }, [clubId]);

  const uniqueLinks = detail
    ? [...new Set(detail.club.links.map((link) => link.trim()))].filter(Boolean)
    : [];
  const previewFileName = detail?.clubCreationForm
    ? getDocumentDownloadFileName(
        `${detail.club.clubName} 개설 신청 양식`,
        detail.clubCreationForm,
      )
    : "";
  const previewFileExtensionLabel = detail?.clubCreationForm
    ? getDocumentFileExtensionLabel(
        `${detail.club.clubName} 개설 신청 양식`,
        detail.clubCreationForm,
      )
    : "FILE";

  const handleDownloadClubCreationForm = async () => {
    if (!detail?.clubCreationForm || isDownloadingClubCreationForm) {
      return;
    }

    setIsDownloadingClubCreationForm(true);

    try {
      const response = await fetch(detail.clubCreationForm);
      if (!response.ok) {
        throw new Error("파일 다운로드 응답이 올바르지 않습니다.");
      }

      const blob = await response.blob();
      if (blob.size === 0) {
        throw new Error("다운로드한 파일이 비어 있습니다.");
      }

      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = getDocumentDownloadFileName(
        `${detail.club.clubName} 개설 신청 양식`,
        detail.clubCreationForm,
        blob.type,
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.setTimeout(() => {
        URL.revokeObjectURL(objectUrl);
      }, 1000);
    } catch {
      window.open(detail.clubCreationForm, "_blank", "noopener,noreferrer");
    } finally {
      setIsDownloadingClubCreationForm(false);
    }
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-gray-500 text-sm">
          개설 신청 상세 정보를 불러오고 있습니다...
        </p>
      </main>
    );
  }

  if (errorMessage || !detail) {
    return (
      <main className="min-h-screen bg-white px-6 py-16 text-[#111827]">
        <div className="mx-auto flex max-w-3xl flex-col gap-6 rounded-xl border border-gray-200 bg-[#fbfbfb] p-8 shadow-sm">
          <p className="font-semibold text-[#E85D5D] text-sm">Teacher</p>
          <h1 className="font-bold text-3xl">개설 신청 상세 조회</h1>
          <p className="text-base text-gray-500 leading-7">
            {errorMessage || "상세 정보를 찾을 수 없습니다."}
          </p>
          <div className="flex justify-end">
            <Link
              href="/mypage"
              className="rounded-xl bg-[#1F2937] px-6 py-3 font-semibold text-sm text-white transition hover:bg-black"
            >
              마이페이지로 돌아가기
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#111827]">
      <section className="px-6 pt-8 pb-6 md:px-12 md:pt-10 lg:px-24 lg:pt-12 lg:pb-8">
        <div className="mx-auto flex max-w-6xl items-start justify-between gap-6">
          <div className="flex items-start gap-4 md:gap-6 lg:gap-8">
            <div className="relative h-[72px] w-[72px] flex-shrink-0 overflow-hidden rounded-[16px] bg-gray-200 md:h-[88px] md:w-[88px] md:rounded-[18px] lg:h-[104px] lg:w-[104px] lg:rounded-[20px]">
              {detail.club.clubImage?.trim() ? (
                <Image
                  src={detail.club.clubImage}
                  alt={detail.club.clubName}
                  fill
                  sizes="104px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gray-200">
                  <span className="text-gray-400 text-sm">No Image</span>
                </div>
              )}
            </div>

            <div className="flex flex-col gap-1 pt-2 md:pt-3">
              <h1 className="font-semibold text-[22px] text-gray-900 md:text-[25px] lg:text-[28px]">
                {detail.club.clubName}
              </h1>
              <p className="text-[13px] text-gray-400 md:text-[14px] lg:text-[15px]">
                동아리 개설 신청
              </p>
              <p className="text-[13px] text-gray-400 md:text-[14px] lg:text-[15px]">
                신청 ID #{clubId}
              </p>
            </div>
          </div>

          <Link
            href="/mypage"
            className="inline-flex h-10 shrink-0 items-center justify-center rounded-[10px] border border-gray-300 bg-white px-5 font-medium text-[14px] text-gray-900 transition hover:border-gray-400 hover:bg-gray-50 md:h-11 md:text-[15px]"
          >
            마이페이지로 돌아가기
          </Link>
        </div>
      </section>

      {detail.club.oneLiner ? (
        <section className="flex flex-col items-center gap-4 px-6 py-6 md:px-12 md:py-8 lg:px-24 lg:py-10">
          <div className="flex w-full max-w-[1200px] items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 px-5 py-3 md:rounded-3xl md:px-7 md:py-3.5 lg:px-9">
            <p className="text-center text-[13px] text-gray-600 md:text-[14px] lg:text-[15px]">
              " {detail.club.oneLiner} "
            </p>
          </div>
        </section>
      ) : null}

      <section className="bg-gray-50 px-6 py-8 md:px-12 md:py-12 lg:px-24 lg:py-16">
        <div className="mx-auto flex max-w-6xl flex-col gap-8 md:gap-12 lg:gap-16">
          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
              신청자 정보
            </h2>
            <div className="grid flex-1 gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                <p className="text-[12px] text-gray-400">이름</p>
                <p className="mt-1 text-[14px] text-gray-700 md:text-[15px]">
                  {detail.userName || "-"}
                </p>
              </div>
              <div className="rounded-lg border border-gray-100 bg-white px-4 py-3">
                <p className="text-[12px] text-gray-400">학번</p>
                <p className="mt-1 text-[14px] text-gray-700 md:text-[15px]">
                  {detail.classNumber || "-"}
                </p>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
              동아리 이미지
            </h2>
            <div className="flex items-center gap-4">
              <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200 bg-white">
                {detail.club.clubImage?.trim() ? (
                  <Image
                    src={detail.club.clubImage}
                    alt={`${detail.club.clubName} 동아리 이미지`}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[12px] text-gray-400">
                    이미지 없음
                  </div>
                )}
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
              동아리명
            </h2>
            <div className="flex flex-1 items-center rounded-lg border border-gray-100 bg-white px-4 py-3">
              <p className="text-[14px] text-gray-700 md:text-[15px]">
                {detail.club.clubName || "-"}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
              한줄 소개
            </h2>
            <div className="flex flex-1 items-center rounded-lg border border-gray-100 bg-white px-4 py-3">
              <p className="text-[14px] text-gray-700 md:text-[15px]">
                {detail.club.oneLiner || "등록된 한줄 소개가 없습니다."}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
              동아리 전공
            </h2>
            <div className="flex flex-wrap gap-2">
              {detail.club.majors.length > 0 ? (
                detail.club.majors.map((major) => (
                  <span
                    key={`${clubId}-${major}`}
                    className="rounded-full border border-primary-300 px-3 py-1 text-[12px] text-primary-500 md:text-[13px]"
                  >
                    {major}
                  </span>
                ))
              ) : (
                <p className="text-[14px] text-gray-500 md:text-[15px]">
                  등록된 전공 정보가 없습니다.
                </p>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
              동아리 소개
            </h2>
            <div className="flex flex-1 items-start rounded-lg border border-gray-100 bg-white p-4">
              <p className="text-[14px] text-gray-700 leading-7 md:text-[15px]">
                {detail.club.introduction || "등록된 동아리 소개가 없습니다."}
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
              동아리 관련 링크
            </h2>
            <div className="flex flex-1 flex-col gap-3 rounded-lg border border-gray-100 bg-white p-4">
              {uniqueLinks.length > 0 ? (
                uniqueLinks.map((link) => (
                  <a
                    key={link}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="break-all text-[14px] text-gray-600 underline underline-offset-2 hover:text-gray-900 md:text-[15px]"
                  >
                    {link}
                  </a>
                ))
              ) : (
                <p className="text-[14px] text-gray-500 md:text-[15px]">
                  등록된 링크가 없습니다.
                </p>
              )}
            </div>
          </section>

          <section className="flex flex-col gap-2 md:flex-row md:gap-0">
            <h2 className="font-medium text-[14px] md:w-[160px] md:text-[15px]">
              개설 신청 양식
            </h2>
            <div className="flex flex-1 flex-col gap-3">
              {detail.clubCreationForm ? (
                <article className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-gray-200 bg-white font-semibold text-[11px] text-gray-700">
                        {previewFileExtensionLabel}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="break-all font-medium text-gray-900 text-sm md:text-base">
                          {previewFileName}
                        </p>
                        <p className="mt-1 text-[12px] text-gray-500">
                          등록된 개설 신청 양식
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadClubCreationForm}
                        disabled={isDownloadingClubCreationForm}
                        className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {isDownloadingClubCreationForm
                          ? "다운로드 중..."
                          : "다운로드"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsClubCreationFormPreviewOpen(true)}
                        className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-900 text-sm transition hover:border-gray-400 hover:bg-gray-50"
                      >
                        미리보기
                      </button>
                    </div>
                  </div>
                </article>
              ) : (
                <p className="text-[14px] text-gray-500 md:text-[15px]">
                  등록된 개설 신청 양식이 없습니다.
                </p>
              )}
            </div>
          </section>
        </div>
      </section>

      <TeacherClubCreationPreviewModal
        fileName={previewFileName}
        isOpen={isClubCreationFormPreviewOpen}
        onClose={() => setIsClubCreationFormPreviewOpen(false)}
        pdfPath={detail?.clubCreationForm ?? null}
      />
    </main>
  );
}
