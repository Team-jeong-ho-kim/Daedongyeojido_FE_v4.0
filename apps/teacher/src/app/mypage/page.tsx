"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useState } from "react";
import {
  apiClient,
  clearTokens,
  getAccessToken,
  getSessionUser,
  resolveClubCreationApplicationStatus,
} from "utils";
import {
  getTeacherClubCreationApplicationDetail,
  getTeacherClubCreationApplications,
  getTeacherMyInfo,
} from "@/api/teacher";
import { moveToWebLogin } from "@/lib/auth";
import {
  countPendingTeacherApplications,
  formatTeacherDateTime,
  sortTeacherApplicationsByLastSubmittedAt,
  TEACHER_STATUS_LABELS,
  TEACHER_STATUS_STYLES,
} from "@/lib/clubCreation";
import type {
  TeacherClubCreationApplication,
  TeacherMyInfoResponse,
} from "@/types/teacher";

export default function TeacherMyPage() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [teacherInfo, setTeacherInfo] = useState<TeacherMyInfoResponse | null>(
    null,
  );
  const [applications, setApplications] = useState<
    TeacherClubCreationApplication[]
  >([]);
  const logoutModalTitleId = useId();
  const teacherName = teacherInfo?.teacherName ?? getSessionUser()?.userName;
  const pendingApplicationCount = countPendingTeacherApplications(applications);

  useEffect(() => {
    let isMounted = true;

    const loadPage = async () => {
      const accessToken = getAccessToken();
      const sessionUser = getSessionUser();

      if (!accessToken || !sessionUser || sessionUser.role !== "TEACHER") {
        clearTokens();
        moveToWebLogin();
        return;
      }

      try {
        const [teacherResponse, applicationsResponse] = await Promise.all([
          getTeacherMyInfo(),
          getTeacherClubCreationApplications(),
        ]);

        const resolvedApplications = await Promise.all(
          applicationsResponse.map(async (application) => {
            try {
              const detail = await getTeacherClubCreationApplicationDetail(
                String(application.applicationId),
              );

              return {
                ...application,
                status: resolveClubCreationApplicationStatus(detail),
              };
            } catch {
              return application;
            }
          }),
        );

        if (!isMounted) return;

        setTeacherInfo(teacherResponse);
        setApplications(
          sortTeacherApplicationsByLastSubmittedAt(resolvedApplications),
        );
      } catch {
        if (!isMounted) return;
        setErrorMessage("지도 교사 검토 목록을 불러오지 못했습니다.");
      } finally {
        if (isMounted) {
          setIsCheckingSession(false);
        }
      }
    };

    void loadPage();

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
          지도 교사 검토 목록을 확인하고 있습니다...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white font-sans text-[#000000] selection:bg-primary-500 selection:text-white">
      <div className="mx-auto max-w-[1120px] px-6 py-16">
        <section className="pt-10">
          <div className="relative border-gray-200 border-b px-2 pb-8 md:px-4 md:pb-10">
            <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-5">
                  <Image
                    src="/admin-profile-default.svg"
                    alt="프로필 이미지"
                    width={96}
                    height={96}
                    className="h-20 w-20 object-contain md:h-24 md:w-24"
                    sizes="96px"
                  />

                  <div>
                    <h1 className="font-extrabold text-3xl text-gray-950 tracking-tight md:text-[34px]">
                      {teacherName}
                    </h1>
                    <p className="mt-2 font-medium text-gray-500 text-sm md:text-base">
                      지도 교사 전용 검토 공간입니다. 현재 매칭된 동아리 개설
                      신청만 확인할 수 있습니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:min-w-[340px]">
                <div className="rounded-[14px] bg-gray-50 px-5 py-5">
                  <p className="font-medium text-gray-400 text-xs tracking-[0.08em]">
                    계정 ID
                  </p>
                  <p className="mt-3 font-semibold text-[20px] text-gray-950">
                    {teacherInfo?.accountId ?? "-"}
                  </p>
                </div>
                <div className="rounded-[14px] bg-gray-50 px-5 py-5">
                  <p className="font-medium text-gray-400 text-xs tracking-[0.08em]">
                    검토 대기
                  </p>
                  <p className="mt-3 font-semibold text-[20px] text-gray-950">
                    {pendingApplicationCount}건
                  </p>
                  <p className="mt-1 text-gray-500 text-xs">
                    전체 검토 요청 {applications.length}건
                  </p>
                </div>
              </div>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-6 rounded-[14px] border border-[#f3c3c3] bg-[#fff5f5] px-6 py-4 text-[#c23d3d] text-sm shadow-sm">
              {errorMessage}
            </div>
          ) : null}

          <div className="mt-8 grid gap-6 lg:grid-cols-[260px_minmax(0,1fr)] lg:items-start">
            <article className="rounded-[18px] border border-gray-200 bg-white px-7 py-7 shadow-sm">
              <div>
                <p className="font-semibold text-[22px] text-gray-950">
                  선생님 정보
                </p>
                <p className="mt-2 text-gray-500 text-sm leading-6">
                  현재 계정 정보와 검토 중인 신청 현황을 빠르게 확인할 수
                  있습니다.
                </p>
              </div>

              <div className="mt-8 space-y-4">
                <div className="rounded-[12px] border border-gray-200 bg-gray-50 px-5 py-5">
                  <p className="font-medium text-gray-400 text-xs tracking-[0.08em]">
                    역할
                  </p>
                  <p className="mt-3 font-semibold text-[18px] text-gray-950">
                    지도 교사
                  </p>
                </div>
                <div className="rounded-[12px] border border-gray-200 bg-gray-50 px-5 py-5">
                  <p className="font-medium text-gray-400 text-xs tracking-[0.08em]">
                    매칭 신청
                  </p>
                  <p className="mt-3 font-semibold text-[18px] text-gray-950">
                    {applications.length}건
                  </p>
                </div>
              </div>
            </article>

            <article className="min-w-0 rounded-[18px] border border-gray-200 bg-white px-7 py-7 shadow-sm">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="font-semibold text-[24px] text-gray-950">
                    검토 신청 목록
                  </p>
                  <p className="mt-2 text-gray-500 text-sm leading-6">
                    최근 제출 순으로 정렬되며, 서버에서 내려준 본인 매칭 건만
                    표시됩니다.
                  </p>
                </div>
                <span className="inline-flex w-fit rounded-full border border-gray-200 bg-gray-50 px-4 py-2 font-medium text-gray-600 text-sm">
                  총 {applications.length}건
                </span>
              </div>

              {applications.length === 0 ? (
                <div className="mt-8 rounded-[14px] border border-gray-200 border-dashed bg-gray-50 px-6 py-10 text-center">
                  <p className="font-medium text-gray-700 text-sm">
                    현재 검토할 개설 신청이 없습니다.
                  </p>
                  <p className="mt-2 text-gray-400 text-xs">
                    새 신청이 매칭되면 이 영역에서 바로 확인할 수 있습니다.
                  </p>
                </div>
              ) : (
                <div className="mt-8 space-y-4">
                  {applications.map((application) => (
                    <Link
                      key={application.applicationId}
                      href={`/club-creation-applications/${application.applicationId}`}
                      className="group hover:-translate-y-0.5 block rounded-[14px] border border-gray-200 bg-gray-50 px-6 py-6 transition duration-200 hover:border-primary-200 hover:bg-white hover:shadow-md"
                    >
                      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                        <div className="flex items-start gap-4">
                          <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-[16px] border border-gray-200 bg-white shadow-sm">
                            {application.clubImage ? (
                              <Image
                                src={application.clubImage}
                                alt={application.clubName}
                                fill
                                className="object-cover"
                                sizes="72px"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-gray-400 text-xs">
                                이미지 없음
                              </div>
                            )}
                          </div>

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-semibold text-[19px] text-gray-950">
                                {application.clubName}
                              </p>
                              <span className="rounded-full border border-gray-200 bg-white px-3 py-1 font-medium text-[12px] text-gray-600">
                                신청서 #{application.applicationId}
                              </span>
                              <span
                                className={`rounded-full border px-3 py-1 font-medium text-[12px] ${TEACHER_STATUS_STYLES[application.status]}`}
                              >
                                {TEACHER_STATUS_LABELS[application.status]}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-500 text-sm">
                              <span>신청자 {application.applicantName}</span>
                              <span>검토 차수 {application.revision}차</span>
                              <span>
                                최종 제출{" "}
                                {formatTeacherDateTime(
                                  application.lastSubmittedAt,
                                )}
                              </span>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              {application.majors.map((major) => (
                                <span
                                  key={`${application.applicationId}-${major}`}
                                  className="rounded-full border border-gray-200 bg-white px-2.5 py-1 font-medium text-[11px] text-gray-600"
                                >
                                  {major}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end text-primary-600 text-sm lg:self-center">
                          <span className="font-semibold">상세 검토하기</span>
                          <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            aria-hidden="true"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 6l6 6-6 6"
                            />
                          </svg>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </article>
          </div>

          <div className="mt-12 flex justify-end gap-3">
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
            className="relative w-[90%] max-w-md rounded-xl bg-white p-8 shadow-2xl"
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
                className="rounded-[10px] bg-gray-400 px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="rounded-[10px] bg-[#E85D5D] px-8 py-3 font-medium text-white transition-colors duration-200 hover:bg-[#d14d4d] disabled:cursor-not-allowed disabled:opacity-60"
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
