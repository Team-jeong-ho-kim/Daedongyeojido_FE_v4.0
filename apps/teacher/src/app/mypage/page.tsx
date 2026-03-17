"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import { apiClient, clearTokens, getAccessToken, getSessionUser } from "utils";
import { getTeacherMyInfo } from "@/api/teacher";
import { moveToWebLogin } from "@/lib/auth";
import type { TeacherMyInfoResponse } from "@/types/teacher";

export default function TeacherMyPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [teacherInfo, setTeacherInfo] = useState<TeacherMyInfoResponse | null>(
    null,
  );
  const logoutModalTitleId = useId();

  useEffect(() => {
    let isMounted = true;

    const loadTeacherInfo = async () => {
      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();

      if (!accessToken || !sessionUser || sessionUser.role !== "TEACHER") {
        clearTokens();
        moveToWebLogin();
        return;
      }

      try {
        const response = await getTeacherMyInfo();

        if (!isMounted) return;
        setTeacherInfo(response);
      } catch {
        if (!isMounted) return;
        setErrorMessage("선생님 마이페이지 정보를 불러오지 못했습니다.");
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    loadTeacherInfo();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await apiClient.delete("/auth/logout");
    } catch {
      // Ignore API logout errors and clear local session first.
    } finally {
      setIsLogoutModalOpen(false);
      clearTokens();
      moveToWebLogin();
    }
  };

  const handleOpenLogoutModal = () => {
    if (isLoggingOut) return;
    setIsLogoutModalOpen(true);
  };

  const handleCloseLogoutModal = () => {
    if (isLoggingOut) return;
    setIsLogoutModalOpen(false);
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white px-6">
        <p className="text-gray-500 text-sm">
          마이페이지 정보를 확인하고 있습니다...
        </p>
      </main>
    );
  }

  const matchedClubInfo =
    teacherInfo && teacherInfo.clubId !== null && teacherInfo.clubName !== null
      ? {
          clubId: teacherInfo.clubId,
          clubName: teacherInfo.clubName,
        }
      : null;

  return (
    <main className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1100px] px-6 py-16">
        <section className="pt-10">
          <div className="mb-10 flex items-center gap-8">
            <Image
              src="/admin-profile-default.svg"
              alt="프로필 이미지"
              className="h-20 w-20 rounded-full object-cover"
              width={80}
              height={80}
            />
            <div>
              <h2 className="font-semibold text-3xl tracking-tight">
                {teacherInfo?.teacherName ?? getSessionUser()?.userName}
              </h2>
              <p className="mt-2 font-medium text-gray-400 text-xl">
                지도 교사
              </p>
            </div>
          </div>

          <div className="mb-10 h-px w-full bg-gray-200" />

          <div className="space-y-5">
            <article className="rounded-[24px] border border-gray-200 bg-white p-8 shadow-sm">
              <div>
                <p className="font-semibold text-[22px] text-gray-900">
                  선생님 정보
                </p>
                <p className="mt-2 text-gray-500 text-sm leading-6">
                  지도 교사 계정과 현재 연결된 동아리 정보를 확인할 수 있습니다.
                </p>
              </div>

              {errorMessage ? (
                <div className="mt-6 rounded-2xl border border-[#f3c3c3] bg-[#fff5f5] px-5 py-4 text-[#c23d3d] text-sm">
                  {errorMessage}
                </div>
              ) : null}

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[20px] bg-[#f8f8f8] px-6 py-5">
                  <p className="font-medium text-gray-400 text-sm">계정 ID</p>
                  <p className="mt-3 font-semibold text-[20px] text-gray-900">
                    {teacherInfo?.accountId ?? "-"}
                  </p>
                </div>

                {matchedClubInfo ? (
                  <Link
                    href={`/clubs/${matchedClubInfo.clubId}`}
                    className="rounded-[20px] bg-[#f8f8f8] px-6 py-5 transition hover:bg-[#f2f2f2]"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-medium text-gray-400 text-sm">
                          매칭 동아리
                        </p>
                        <p className="mt-3 font-semibold text-[20px] text-gray-900">
                          {matchedClubInfo.clubName}
                        </p>
                        <p className="mt-2 text-gray-500 text-sm">
                          동아리 ID: {matchedClubInfo.clubId}
                        </p>
                        <p className="mt-4 text-[#E85D5D] text-sm">
                          클릭하여 개설 신청 상세를 확인할 수 있습니다.
                        </p>
                      </div>
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
                        →
                      </span>
                    </div>
                  </Link>
                ) : (
                  <div className="rounded-[20px] bg-[#f8f8f8] px-6 py-5">
                    <p className="font-medium text-gray-400 text-sm">
                      매칭 동아리
                    </p>
                    <p className="mt-3 font-semibold text-[20px] text-gray-900">
                      동아리가 매칭되지 않았습니다
                    </p>
                    <p className="mt-2 text-[#E85D5D] text-sm">
                      현재 연결된 전공동아리가 없습니다.
                    </p>
                  </div>
                )}
              </div>
            </article>
          </div>

          <div className="mt-16 flex justify-end gap-3">
            <button
              type="button"
              onClick={handleOpenLogoutModal}
              disabled={isLoggingOut}
              className="rounded-xl bg-[#1F2937] px-8 py-2.5 font-semibold text-sm text-white shadow-sm transition-all hover:bg-black hover:shadow-md active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
            </button>
          </div>
        </section>
      </div>

      {isLogoutModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <button
            type="button"
            aria-label="로그아웃 확인 모달 닫기"
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={handleCloseLogoutModal}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={logoutModalTitleId}
            className="relative w-[90%] max-w-md rounded-2xl bg-white p-8 shadow-2xl"
          >
            <h2
              id={logoutModalTitleId}
              className="mb-2 font-bold text-[18px] text-gray-900"
            >
              로그아웃 하시겠습니까?
            </h2>
            <p className="mb-8 text-gray-400 text-sm">
              로그아웃하면 지도 교사 페이지 이용을 위해 다시 로그인해야 합니다.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCloseLogoutModal}
                disabled={isLoggingOut}
                className="rounded-[12px] bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-[12px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoggingOut ? "로그아웃 중..." : "로그아웃"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
