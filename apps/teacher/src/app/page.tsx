"use client";

import { useEffect, useState } from "react";
import { apiClient, clearTokens, getAccessToken, getSessionUser } from "utils";

const normalizeUrl = (value: string) => value.trim().replace(/\/$/, "");

const moveToWebLogin = () => {
  const envWebUrl = process.env.NEXT_PUBLIC_WEB_URL;
  const webUrl = envWebUrl?.trim()
    ? normalizeUrl(envWebUrl)
    : typeof window !== "undefined" &&
        window.location.hostname.endsWith(".daedongyeojido.site")
      ? `${window.location.protocol}//dsm.daedongyeojido.site`
      : "http://localhost:3000";

  window.location.href = `${webUrl}/login`;
};

export default function TeacherHomePage() {
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const accessToken = getAccessToken();
    const sessionUser = getSessionUser();

    if (!accessToken || !sessionUser || sessionUser.role !== "TEACHER") {
      clearTokens();
      moveToWebLogin();
      return;
    }

    setUserName(sessionUser.userName);
    setIsCheckingSession(false);
  }, []);

  const handleLogout = async () => {
    try {
      await apiClient.delete("/auth/logout");
    } catch {
      // Ignore API logout errors and clear local session first.
    } finally {
      clearTokens();
      moveToWebLogin();
    }
  };

  if (isCheckingSession) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f6f7fb] px-6">
        <p className="text-gray-500 text-sm">
          지도 교사 세션을 확인하고 있습니다...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f7fb] px-6 py-16 text-[#111827]">
      <div className="mx-auto flex max-w-5xl flex-col gap-8">
        <section className="overflow-hidden rounded-[28px] bg-[#111111] px-8 py-10 text-white shadow-2xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <div className="max-w-2xl">
              <span className="inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1.5 font-medium text-sm text-white/80">
                Teacher
              </span>
              <h1 className="mt-5 font-bold text-3xl leading-tight md:text-4xl">
                대동여지도 지도 교사 포털
              </h1>
              <p className="mt-4 text-base text-white/70 leading-7">
                {userName} 선생님, 환영합니다. 지도 교사용 기능은 순차적으로
                추가될 예정이며 현재는 로그인 후 진입 가능한 기본 셸만
                제공됩니다.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 px-5 font-semibold text-sm text-white transition hover:bg-white/15"
            >
              로그아웃
            </button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <article className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 text-lg">
              현재 제공 범위
            </h2>
            <p className="mt-3 text-gray-600 text-sm leading-6">
              선생님 로그인과 전용 앱 진입 구조를 우선 구성했습니다. 실제 지도
              교사용 기능은 이후 단계에서 이 포털에 추가됩니다.
            </p>
          </article>

          <article className="rounded-[24px] border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="font-semibold text-gray-900 text-lg">
              다음 확장 포인트
            </h2>
            <p className="mt-3 text-gray-600 text-sm leading-6">
              학생 지원 현황 확인, 동아리 지도 승인 흐름, 교사 전용 알림 화면
              등을 이 영역에 이어서 붙일 수 있습니다.
            </p>
          </article>
        </section>
      </div>
    </main>
  );
}
